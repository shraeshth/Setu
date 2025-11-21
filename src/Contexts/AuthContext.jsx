import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth/dist/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore/dist/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user (email + password) and create Firestore profile doc
  const signup = async (email, password, displayName) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // Set displayName in Firebase Auth profile
    if (displayName) {
      await firebaseUpdateProfile(userCred.user, { displayName });
    }
    // Create user doc in Firestore
    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      email: userCred.user.email,
      displayName: displayName || null,
      photoURL: userCred.user.photoURL || null,
      skills: [],
      createdAt: serverTimestamp(),
    });
    // Send email verification (optional but recommended)
    await sendEmailVerification(userCred.user);
    return userCred;
  };

  // Email + password login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign-in (popup)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // When a user signs in with Google, ensure user doc exists
    const u = result.user;
    const userDocRef = doc(db, "users", u.uid);
    const snapshot = await getDoc(userDocRef);
    if (!snapshot.exists()) {
      await setDoc(userDocRef, {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || null,
        photoURL: u.photoURL || null,
        skills: [],
        createdAt: serverTimestamp(),
      });
    }
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const sendResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfile = (updates) => {
    if (!auth.currentUser) throw new Error("No user");
    return firebaseUpdateProfile(auth.currentUser, updates);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    sendResetEmail,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
