import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../Contexts/AuthContext.jsx";

/**
 * Custom hook to fetch navigation badge counts
 * Returns: { profileIncomplete, unreadNotifications, newTasks }
 */
export const useNavigationBadges = () => {
    const { currentUser } = useAuth();
    const [profileIncomplete, setProfileIncomplete] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [newTasks, setNewTasks] = useState(0);

    // Profile completion count
    useEffect(() => {
        if (!currentUser) return;

        const fetchProfileCompletion = async () => {
            try {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();

                    // Define required fields
                    const fields = [
                        data.displayName,
                        data.bio,
                        data.headline,
                        data.availability,
                        data.photoURL,
                        data.skills?.length > 0,
                        data.wantToLearn?.length > 0,
                        data.education?.length > 0,
                        data.experience?.length > 0,
                        data.certifications?.length > 0,
                    ];

                    // Count empty fields
                    const emptyCount = fields.filter(field => !field).length;
                    setProfileIncomplete(emptyCount);
                }
            } catch (error) {
                console.error("Error fetching profile completion:", error);
            }
        };

        fetchProfileCompletion();
    }, [currentUser]);

    // Unread notifications count (real-time)
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "notifications"),
            where("userUid", "==", currentUser.uid),
            where("isRead", "==", false)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setUnreadNotifications(snapshot.size);
            },
            (error) => {
                console.error("Error fetching unread notifications:", error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    // New/pending workspace tasks count (real-time)
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "collaborations"),
            where("memberIds", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                // Count tasks with status "pending" or "new"
                let count = 0;
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status === "pending" || data.status === "new") {
                        count++;
                    }
                });
                setNewTasks(count);
            },
            (error) => {
                console.error("Error fetching workspace tasks:", error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    return {
        profileIncomplete,
        unreadNotifications,
        newTasks,
    };
};
