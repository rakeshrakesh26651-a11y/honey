/**
 * Himalayan Harvest Honey — Serverless Firebase Admin SDK Foundation
 * Secure server-side authentication, role verification, and database operations.
 * NEVER import this file into frontend client bundles.
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, FieldValue, type Firestore } from 'firebase-admin/firestore';

/**
 * Initializes Firebase Admin singleton safely.
 * Accepts full JSON in FIREBASE_SERVICE_ACCOUNT_KEY or discrete credentials.
 */
export function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    return existingApps[0];
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || 'himalayan-harvest-honey';

  if (rawKey) {
    try {
      const parsed = JSON.parse(rawKey);
      return initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || projectId,
      });
    } catch (err) {
      console.warn('[Firebase Admin] Could not parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err);
    }
  }

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      projectId,
    });
  }

  // Fallback for local development or automated build passes
  return initializeApp({
    projectId,
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export interface AuthenticatedAdmin {
  uid: string;
  email?: string;
  token: DecodedIdToken;
}

/**
 * Extracts and cryptographically verifies the Firebase ID Token.
 * Enforces `decodedToken.admin === true`.
 * Throws an Error with an attached `statusCode` (401 or 403) on failure.
 */
export async function verifyAdminToken(req: any): Promise<AuthenticatedAdmin> {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    const error: any = new Error('Unauthorized: Missing or malformed Authorization header. Expected Bearer <token>');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    const error: any = new Error('Unauthorized: Token string is empty.');
    error.statusCode = 401;
    throw error;
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token, true);

    // Cryptographic claim check: Must have admin === true
    if (decoded.admin !== true) {
      const error: any = new Error('Forbidden: Administrative privileges (admin claim) required.');
      error.statusCode = 403;
      throw error;
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      token: decoded,
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    const error: any = new Error(`Unauthorized: Invalid or expired ID token (${err.message || 'Token verification failed'})`);
    error.statusCode = 401;
    throw error;
  }
}

/**
 * Extracts and cryptographically verifies the customer's Firebase ID Token.
 * Returns the authoritative UID extracted directly from the verified token.
 * NEVER trusts any client-submitted UID.
 */
export async function verifyCustomerToken(req: any): Promise<string> {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    const error: any = new Error('Unauthorized: Authentication required.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    const error: any = new Error('Unauthorized: Missing token.');
    error.statusCode = 401;
    throw error;
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch (err: any) {
    const error: any = new Error('Unauthorized: Invalid or expired customer session.');
    error.statusCode = 401;
    throw error;
  }
}

/**
 * Server-only audit log recorder.
 * Writes directly to `/audit_logs` using Admin SDK with server timestamp.
 */
export async function recordAuditLog(log: {
  adminUid: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}): Promise<void> {
  try {
    const db = getAdminDb();
    const docRef = db.collection('audit_logs').doc();
    await docRef.set({
      id: docRef.id,
      ...log,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('[Audit Log] Failed to write audit log entry:', err);
  }
}
