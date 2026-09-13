import "server-only";
import { initializeApp, getApps, getApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "siddharth-varpe-portfolio";

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  `${projectId}.appspot.com`;

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

function initAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const formattedKey = formatPrivateKey(privateKeyRaw);

  if (clientEmail && formattedKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
      storageBucket,
    });
  }

  // Fallback to Google Application Default Credentials (e.g. Firebase App Hosting)
  return initializeApp({
    credential: applicationDefault(),
    projectId,
    storageBucket,
  });
}

export const adminApp = initAdminApp();
export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

// Configure Firestore settings
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch {
  // Settings already locked or initialized
}
