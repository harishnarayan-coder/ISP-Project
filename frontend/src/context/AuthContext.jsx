import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check local storage for persisted session
    const saved = localStorage.getItem('renewcast_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Authorized Researcher',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isFirebaseLive: true
        };
        setUser(userData);
        localStorage.setItem('renewcast_user', JSON.stringify(userData));
      } else {
        // If not signed in via live Firebase, preserve local demo session if active
        const saved = localStorage.getItem('renewcast_user');
        if (!saved || JSON.parse(saved).isFirebaseLive) {
          setUser(null);
          localStorage.removeItem('renewcast_user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase Auth is not initialized. Please configure API keys.');
      }
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userData = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Researcher',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        isFirebaseLive: true
      };
      setUser(userData);
      localStorage.setItem('renewcast_user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (error) {
      console.warn('Firebase Google Sign-In notice:', error.code, error.message);
      
      // If Firebase project API key is unconfigured, provide academic project session
      if (
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/invalid-api-key' ||
        error.code === 'auth/configuration-not-found' ||
        error.message.includes('API key')
      ) {
        const demoUser = {
          uid: 'academic-researcher-harish',
          displayName: 'T. Harish Narayan',
          email: 'harish.narayan@renewcast.edu',
          photoURL: null,
          role: 'Lead Project Researcher',
          isFirebaseLive: false
        };
        setUser(demoUser);
        localStorage.setItem('renewcast_user', JSON.stringify(demoUser));
        setLoading(false);
        return demoUser;
      }

      setAuthError(error.message || 'Google Sign-In failed');
      setLoading(false);
      throw error;
    }
  };

  const loginAsLeadResearcher = () => {
    const demoUser = {
      uid: 'academic-researcher-harish',
      displayName: 'T. Harish Narayan',
      email: 'harish.narayan@renewcast.edu',
      photoURL: null,
      role: 'Lead Project Researcher',
      isFirebaseLive: false
    };
    setUser(demoUser);
    localStorage.setItem('renewcast_user', JSON.stringify(demoUser));
  };

  const logout = async () => {
    try {
      if (auth && user?.isFirebaseLive) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('renewcast_user');
      setAuthError(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      authError,
      loginWithGoogle,
      loginAsLeadResearcher,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
