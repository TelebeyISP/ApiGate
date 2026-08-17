import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkRSZVMR3v5rMBjKOGssJr3bhAlsQFldg",
  authDomain: "com-telebey.firebaseapp.com",
  projectId: "com-telebey",
  storageBucket: "com-telebey.firebasestorage.app",
  messagingSenderId: "631383112300",
  appId: "1:631383112300:web:09b924279f626bbaf27649",
  measurementId: "G-NGD9ST79Q6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
