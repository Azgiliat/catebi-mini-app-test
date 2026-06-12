import {
  type FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const env = import.meta.env;
const isDev = env.DEV;
const projectId = env.VITE_FIREBASE_PROJECT_ID;

const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  appId: env.VITE_FIREBASE_APP_ID,
  projectId,
};

const missingProductionConfig = [
  ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
  ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
].filter(([, value]) => !value);

if (!isDev && missingProductionConfig.length > 0) {
  throw new Error(
    `Missing Firebase config: ${missingProductionConfig
      .map(([key]) => key)
      .join(", ")}`,
  );
}

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

if (isDev && !window.__CATEBI_AUTH_EMULATOR_CONNECTED__) {
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  window.__CATEBI_AUTH_EMULATOR_CONNECTED__ = true;
}

if (isDev && !window.__CATEBI_FIRESTORE_EMULATOR_CONNECTED__) {
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  window.__CATEBI_FIRESTORE_EMULATOR_CONNECTED__ = true;
}
