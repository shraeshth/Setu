import { useState, useCallback } from 'react';
import {
    doc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export const useFirestore = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDocument = useCallback(async (collectionName, id) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCollection = useCallback(async (collectionName, constraints = []) => {
        setLoading(true);
        setError(null);
        try {
            const collectionRef = collection(db, collectionName);
            const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addDocument = useCallback(async (collectionName, data) => {
        setLoading(true);
        setError(null);
        try {
            const collectionRef = collection(db, collectionName);
            const docRef = await addDoc(collectionRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDocument = useCallback(async (collectionName, id, data) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDocument = useCallback(async (collectionName, id) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getDocument,
        getCollection,
        addDocument,
        updateDocument,
        deleteDocument
    };
};
