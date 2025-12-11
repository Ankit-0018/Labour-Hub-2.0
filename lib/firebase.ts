// Import the functions you need from the SDKs you need
import { initializeApp ,  getApps } from "firebase/app";
import {getAuth, RecaptchaVerifier} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

//invisible recaptcha
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const auth = getAuth(app);

export const generateRecaptcha = async () => {
  if (typeof window === "undefined") return;

  // If already exists, clear it safely
  if (recaptchaVerifier) {
    try {
      await recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Recaptcha clear warning:", e);
    }
    recaptchaVerifier = null;
    // also delete global instance
    (window as any).recaptchaVerifier = null;
  }

  // Create a new one
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  // Firebase requires render() to initialize it properly
  await recaptchaVerifier.render();

  // Attach globally (helps avoid multiple renders across pages)
  (window as any).recaptchaVerifier = recaptchaVerifier;

  return recaptchaVerifier;
};

export const db = getFirestore(app);