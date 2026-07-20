import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIvYCTi2TjjqN9niwAF_v_xyc4c5aEm4E",
  authDomain: "kabu-ai-1d6cf.firebaseapp.com",
  projectId: "kabu-ai-1d6cf",
  storageBucket: "kabu-ai-1d6cf.firebasestorage.app",
  messagingSenderId: "311880305149",
  appId: "1:311880305149:web:903a0c3360d69ef5b9b194",
  measurementId: "G-0GF9EM8JNV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
