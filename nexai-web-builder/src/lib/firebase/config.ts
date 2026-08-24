import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC25Nr1jm3Y27e888Jod1jNZgcLA5SFfmU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nexai-crm-database.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nexai-crm-database',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'nexai-crm-database.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '99918788107',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:99918788107:web:35de4dec97ebb030b0b90e',
};

let app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let db: Firestore;
let auth: Auth;

try {
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn('Aviso: Inicializando Firebase en modo fallback seguro:', e);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
