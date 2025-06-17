import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - In production, use environment variables
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "healthbuddy-demo.firebaseapp.com",
  projectId: "healthbuddy-demo",
  storageBucket: "healthbuddy-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;