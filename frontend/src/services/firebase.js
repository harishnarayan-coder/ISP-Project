import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXOPkTuvnB7zrWx_56uCAaEevVwK9lbrs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "renewcast-535f6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "renewcast-535f6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "renewcast-535f6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "269838922939",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:269838922939:web:e3c228f66f65adc35fe59e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NGFQENTNQM"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { app, analytics };
