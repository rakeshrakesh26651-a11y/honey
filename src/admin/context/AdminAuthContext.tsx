import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AdminAuthContextType {
  adminUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdminClaim: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isBusyRef = useRef(false);

  const clearError = () => setError(null);

  /**
   * Verifies the cryptographic custom claims on the user's ID token.
   * Forces token refresh to guarantee real-time claim reflection.
   */
  const checkAdminClaim = async (userToVerify?: User | null): Promise<boolean> => {
    const targetUser = userToVerify || auth.currentUser;
    if (!targetUser) {
      setIsAdmin(false);
      return false;
    }

    try {
      // Force refresh token to detect recently granted claims
      const tokenResult = await targetUser.getIdTokenResult(true);
      const hasAdminClaim = Boolean(tokenResult.claims && tokenResult.claims.admin === true);
      setIsAdmin(hasAdminClaim);
      return hasAdminClaim;
    } catch (err: any) {
      console.warn('[AdminAuthContext] Could not verify ID token claims:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAdminUser(currentUser);
      if (currentUser) {
        await checkAdminClaim(currentUser);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<void> => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Force refresh token to verify admin custom claim
      const tokenResult = await user.getIdTokenResult(true);

      if (!tokenResult.claims || tokenResult.claims.admin !== true) {
        // Automatically sign out non-admin accounts from the admin session
        await signOut(auth);
        setAdminUser(null);
        setIsAdmin(false);
        const forbiddenError = 'Access Denied: This account does not possess administrative privileges ({ admin: true }).';
        setError(forbiddenError);
        throw new Error(forbiddenError);
      }

      setAdminUser(user);
      setIsAdmin(true);
    } catch (err: any) {
      const msg = err.message || 'Administrative login failed. Please verify credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      isBusyRef.current = false;
    }
  };

  const logoutAdmin = async (): Promise<void> => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setError(null);

    try {
      await signOut(auth);
      setAdminUser(null);
      setIsAdmin(false);
    } catch (err: any) {
      console.warn('[AdminAuthContext] Sign out notice:', err);
    } finally {
      isBusyRef.current = false;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdmin,
        loading,
        error,
        clearError,
        loginAdmin,
        logoutAdmin,
        checkAdminClaim,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
