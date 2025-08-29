// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register function
  async function register(email, password, displayName) {
    try {
      const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
        email,
        password,
      });
      
      // Update the user's display name if provided
      if (displayName && result.user) {
        await FirebaseAuthentication.updateProfile({
          displayName: displayName
        });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  async function login(email, password) {
    try {
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({
        email,
        password,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Logout function
  async function logout() {
    try {
      await FirebaseAuthentication.signOut();
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  const getCurrentUser = async () => {
    try {
      const result = await FirebaseAuthentication.getCurrentUser();
      return result.user;
    } catch (error) {
      return null;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    let unsubscribe;

    const setupAuthListener = async () => {
      try {
        // Get initial user state
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Set up auth state listener
        unsubscribe = await FirebaseAuthentication.addListener('authStateChange', (change) => {
          console.log('Auth state changed:', change);
          setCurrentUser(change.user);
        });

        setLoading(false);
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        setLoading(false);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe.remove();
      }
    };
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}