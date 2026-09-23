import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getFriendlyAuthErrorMessage(errorCodeOrMessage: string): string {
  if (!errorCodeOrMessage) return 'An unexpected error occurred. Please try again.';

  if (errorCodeOrMessage.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email address. Please sign in instead.';
  }
  if (errorCodeOrMessage.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (errorCodeOrMessage.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (errorCodeOrMessage.includes('auth/user-not-found')) {
    return 'No account found with this email address. Please check your spelling or sign up.';
  }
  if (errorCodeOrMessage.includes('auth/wrong-password')) {
    return 'Incorrect password. Please double check and try again.';
  }
  if (errorCodeOrMessage.includes('auth/invalid-credential')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (errorCodeOrMessage.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact customer support.';
  }
  if (errorCodeOrMessage.includes('auth/too-many-requests')) {
    return 'Access temporarily blocked due to multiple failed login attempts. Please reset your password or try again later.';
  }
  if (errorCodeOrMessage.includes('auth/network-request-failed')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (errorCodeOrMessage.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign in is not enabled in your Firebase console.';
  }
  if (errorCodeOrMessage.includes('auth/api-key-not-valid') || errorCodeOrMessage.includes('auth/invalid-api-key')) {
    return 'Firebase API key is invalid. Please check your environment variables in .env.local.';
  }

  return errorCodeOrMessage.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\.?$/, '');
}

// Timeout helper: prevents Firestore operations from blocking Auth state or hanging UI
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallback);
      }
    }, timeoutMs);

    promise
      .then((val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          console.warn('Firestore operation warning (fallback used):', err);
          resolve(fallback);
        }
      });
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lock to prevent multiple simultaneous auth requests (e.g. rapid double clicks)
  const isAuthBusyRef = useRef(false);

  const clearError = () => setError(null);

  // Background fetch of Firestore profile: non-blocking with 2.5s timeout
  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await withTimeout(getDoc(docRef), 2500, null);

      if (docSnap && docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setUserProfile(data);
        return data;
      }
    } catch (err) {
      console.warn('Could not fetch profile from Firestore:', err);
    }

    // Fallback profile derived from Firebase Auth user
    const fallbackProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || '',
      createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUserProfile((prev) => (prev && prev.uid === firebaseUser.uid ? prev : fallbackProfile));
    return fallbackProfile;
  };

  // Listen to Auth State with instant loading state resolution
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Immediately initialize profile from Auth user so UI renders without delay
        setUserProfile((prev) => {
          if (prev && prev.uid === currentUser.uid) return prev;
          return {
            uid: currentUser.uid,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            phone: currentUser.phoneNumber || '',
            createdAt: currentUser.metadata?.creationTime || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        setLoading(false);

        // Fetch Firestore profile in background
        fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (name: string, email: string, phone: string, password: string) => {
    if (isAuthBusyRef.current) return;
    isAuthBusyRef.current = true;
    setError(null);

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const newUser = userCredential.user;

      // 2. Update display name in Auth
      if (name.trim()) {
        try {
          await updateProfile(newUser, { displayName: name.trim() });
        } catch (profileErr) {
          console.warn('Could not update Firebase Auth displayName:', profileErr);
        }
      }

      // 3. Prepare customer profile
      const nowIso = new Date().toISOString();
      const profileData: UserProfile = {
        uid: newUser.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Set user and profile state immediately so caller has access instantly
      setUser(newUser);
      setUserProfile(profileData);

      // 4. Save to Firestore in background with timeout protection
      const userRef = doc(db, 'users', newUser.uid);
      await withTimeout(setDoc(userRef, profileData), 3000, null);
    } catch (err: any) {
      const friendlyMsg = getFriendlyAuthErrorMessage(err?.code || err?.message || '');
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      isAuthBusyRef.current = false;
    }
  };

  const login = async (email: string, password: string) => {
    if (isAuthBusyRef.current) return;
    isAuthBusyRef.current = true;
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedUser = userCredential.user;

      // Update state immediately
      setUser(loggedUser);
      setUserProfile((prev) => {
        if (prev && prev.uid === loggedUser.uid) return prev;
        return {
          uid: loggedUser.uid,
          name: loggedUser.displayName || '',
          email: loggedUser.email || '',
          phone: loggedUser.phoneNumber || '',
          createdAt: loggedUser.metadata?.creationTime || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      // Background fetch extra firestore fields
      fetchUserProfile(loggedUser);
    } catch (err: any) {
      const friendlyMsg = getFriendlyAuthErrorMessage(err?.code || err?.message || '');
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      isAuthBusyRef.current = false;
    }
  };

  const logout = async () => {
    if (isAuthBusyRef.current) return;
    isAuthBusyRef.current = true;
    setError(null);

    // Optimistically clear user state immediately so UI updates with zero delay
    setUser(null);
    setUserProfile(null);

    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Firebase signOut notice:', err);
    } finally {
      isAuthBusyRef.current = false;
    }
  };

  const resetPassword = async (email: string) => {
    if (isAuthBusyRef.current) return;
    isAuthBusyRef.current = true;
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const friendlyMsg = getFriendlyAuthErrorMessage(err?.code || err?.message || '');
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      isAuthBusyRef.current = false;
    }
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await fetchUserProfile(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        clearError,
        signup,
        login,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
