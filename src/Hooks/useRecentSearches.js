import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useFirestore } from "./useFirestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Corrected path

const MAX_SEARCHES = 10;
const STORAGE_KEY = "recent_searches";

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState([]);
    const { currentUser } = useAuth();
    const { getDocument } = useFirestore();

    // Load from localStorage helper
    const loadFromStorage = useCallback(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent searches", e);
            }
        } else {
            setRecentSearches([]);
        }
    }, []);

    // Initial load and event listeners
    useEffect(() => {
        loadFromStorage();

        const handleStorageChange = () => loadFromStorage();

        // Listen for custom event (same tab) and storage event (cross-tab)
        window.addEventListener("recent-searches-updated", handleStorageChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("recent-searches-updated", handleStorageChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [loadFromStorage]);

    // Sync with Firestore when user logs in
    useEffect(() => {
        if (!currentUser) return;

        const syncWithFirestore = async () => {
            try {
                const userDocRef = doc(db, "users", currentUser.uid, "recent_searches", "list");
                const docSnap = await getDoc(userDocRef);

                let firestoreSearches = [];
                if (docSnap.exists()) {
                    firestoreSearches = docSnap.data().searches || [];
                }

                // Merge localStorage and Firestore
                const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
                const merged = Array.from(new Set([...local, ...firestoreSearches])).slice(0, MAX_SEARCHES);

                setRecentSearches(merged);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

                // Notify other components
                window.dispatchEvent(new Event("recent-searches-updated"));

                // Update Firestore
                await setDoc(userDocRef, { searches: merged }, { merge: true });
            } catch (err) {
                console.error("Error syncing searches with Firestore:", err);
            }
        };

        syncWithFirestore();
    }, [currentUser]);

    // Add a new search term
    const addSearch = useCallback(async (query) => {
        if (!query || !query.trim()) return;
        const term = query.trim();

        setRecentSearches((prev) => {
            const updated = [term, ...prev.filter((s) => s !== term)].slice(0, MAX_SEARCHES);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(new Event("recent-searches-updated"));

            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid, "recent_searches", "list");
                setDoc(userDocRef, { searches: updated }, { merge: true }).catch(err =>
                    console.error("Failed to save search to Firestore", err)
                );
            }

            return updated;
        });
    }, [currentUser]);

    // Remove a specific search term
    const removeSearch = useCallback(async (term) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((s) => s !== term);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(new Event("recent-searches-updated"));

            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid, "recent_searches", "list");
                setDoc(userDocRef, { searches: updated }, { merge: true }).catch(err =>
                    console.error("Failed to remove search from Firestore", err)
                );
            }

            return updated;
        });
    }, [currentUser]);

    // Clear all searches
    const clearSearches = useCallback(async () => {
        setRecentSearches([]);
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event("recent-searches-updated"));

        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid, "recent_searches", "list");
            await setDoc(userDocRef, { searches: [] }, { merge: true });
        }
    }, [currentUser]);

    return {
        recentSearches,
        addSearch,
        removeSearch,
        clearSearches
    };
}
