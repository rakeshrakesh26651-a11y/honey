import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const cleanVal = (val?: string): string => {
  if (!val) return '';
  return val.replace(/^[",'\s]+|[",'\s]+$/g, '').trim();
};

const apiKey =
  cleanVal(import.meta.env.VITE_FIREBASE_API_KEY) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY) ||
  'AIzaSyPlaceholderKeyForBuildSafety';

const authDomain =
  cleanVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) ||
  'himalayan-harvest-honey.firebaseapp.com';

const projectId =
  cleanVal(import.meta.env.VITE_FIREBASE_PROJECT_ID) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ||
  'himalayan-harvest-honey';

const storageBucket =
  cleanVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) ||
  'himalayan-harvest-honey.firebasestorage.app';

const messagingSenderId =
  cleanVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) ||
  '123456789012';

const appId =
  cleanVal(import.meta.env.VITE_FIREBASE_APP_ID) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID) ||
  '1:123456789012:web:abcdef123456';

const measurementId =
  cleanVal(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) ||
  cleanVal(import.meta.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) ||
  undefined;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

/**
 * Checks if production/custom Firebase credentials have been configured in environment variables.
 */
export const isFirebaseConfigured = Boolean(
  apiKey &&
  !apiKey.includes('your_') &&
  !apiKey.includes('Placeholder')
);

if (!isFirebaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[Himalayan Harvest Honey] Firebase credentials are not set or using placeholders. ' +
    'Please set VITE_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_API_KEY in .env.local'
  );
}

// Initialize Firebase singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
