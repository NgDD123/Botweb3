import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        checkPaymentStatus(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkPaymentStatus = async (userId) => {
    try {
      const response = await axios.get(`/api/payment-status/${userId}`);
      setHasPaid(response.data.hasPaid);
    } catch (error) {
      console.error('Error checking payment status', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      checkPaymentStatus(auth.currentUser.uid);
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, hasPaid, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
