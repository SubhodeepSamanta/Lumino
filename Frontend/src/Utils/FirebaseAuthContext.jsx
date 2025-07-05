import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const FirebaseAuthContext = createContext();

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signOutUser = () => signOut(auth);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, signIn, signUp, signOutUser, signInWithGoogle }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}; 