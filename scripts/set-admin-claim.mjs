/**
 * Himalayan Harvest Honey — Admin Custom Claim Provisioning Script
 * 
 * Usage:
 *   node scripts/set-admin-claim.mjs <user-email>
 *   node scripts/set-admin-claim.mjs <user-email> --revoke
 * 
 * Security:
 *   - Runs OFFLINE in the local terminal or secure CI environment.
 *   - Never exposed via public HTTP endpoints.
 *   - Requires private service account key.
 */

import { readFileSync, existsSync } from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith('--'));
const isRevoke = args.includes('--revoke');

if (!email) {
  console.error('\n❌ Error: Please specify the user email.');
  console.log('Usage:');
  console.log('  node scripts/set-admin-claim.mjs <email>');
  console.log('  node scripts/set-admin-claim.mjs <email> --revoke\n');
  process.exit(1);
}

// 1. Resolve Service Account Credentials safely
let credential;
const serviceAccountPath = './serviceAccountKey.json';

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const parsed = raw.startsWith('{') ? JSON.parse(raw) : JSON.parse(readFileSync(raw, 'utf8'));
    credential = cert(parsed);
  } catch (err) {
    console.error('❌ Could not parse FIREBASE_SERVICE_ACCOUNT_KEY environment variable:', err.message);
    process.exit(1);
  }
} else if (existsSync(serviceAccountPath)) {
  try {
    const parsed = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    credential = cert(parsed);
  } catch (err) {
    console.error(`❌ Could not parse ${serviceAccountPath}:`, err.message);
    process.exit(1);
  }
} else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  credential = cert({
    projectId: process.env.FIREBASE_PROJECT_ID || 'himalayan-harvest-honey',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
} else {
  console.error('\n❌ Error: No Firebase Admin credentials found.');
  console.error('Please provide one of the following:');
  console.error('  1. Place serviceAccountKey.json in the project root');
  console.error('  2. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local');
  console.error('  3. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY\n');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential });
}

const auth = getAuth();

async function run() {
  try {
    console.log(`\n🔍 Looking up Firebase user by email: ${email}...`);
    const user = await auth.getUserByEmail(email);
    console.log(`✓ Found user: ${user.email} (UID: ${user.uid})`);

    const currentClaims = user.customClaims || {};
    console.log('Current custom claims:', currentClaims);

    if (isRevoke) {
      console.log(`\nRevoking { admin: true } from ${user.email}...`);
      const updatedClaims = { ...currentClaims };
      delete updatedClaims.admin;
      await auth.setCustomUserClaims(user.uid, updatedClaims);
      console.log(`✅ Successfully revoked admin claim from ${user.email}`);
    } else {
      console.log(`\nGranting { admin: true } claim to ${user.email}...`);
      await auth.setCustomUserClaims(user.uid, {
        ...currentClaims,
        admin: true,
      });
      console.log(`✅ Successfully granted { admin: true } to ${user.email}`);
    }

    // Verify reflection
    const verifiedUser = await auth.getUser(user.uid);
    console.log('\nVerified updated custom claims:', verifiedUser.customClaims);
    console.log('\nNote: If the user is currently signed in, they must refresh their token or sign out and back in.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to update admin custom claims:', error.message);
    process.exit(1);
  }
}

run();
