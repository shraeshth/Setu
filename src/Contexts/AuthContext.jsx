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
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

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

      // NEW FIELDS based on your schema
      skills: [],
      education: [],
      experience: [],

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

        // NEW
        skills: [],
        education: [],
        experience: [],

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const lastActive = data.lastActiveAt?.toDate();
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            let newStreak = data.streak || 0;
            let shouldUpdate = false;

            if (lastActive) {
              const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
              const diffTime = Math.abs(today - lastActiveDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                // Logged in consecutive day
                newStreak += 1;
                shouldUpdate = true;
              } else if (diffDays > 1) {
                // Missed a day or more
                newStreak = 1;
                shouldUpdate = true;
              }
              // If diffDays === 0, logged in same day, do nothing to streak
            } else {
              // First time tracking
              newStreak = 1;
              shouldUpdate = true;
            }

            // Always update lastActiveAt if it's a new day or hasn't been set
            if (!lastActive || shouldUpdate || (lastActive && lastActive.getDate() !== today.getDate())) {
              await setDoc(userRef, {
                lastActiveAt: serverTimestamp(),
                streak: newStreak
              }, { merge: true });
            }
          }
        } catch (error) {
          console.error("Error updating user activity:", error);
        }
      }
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
