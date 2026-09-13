"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "siddharth-varpe-portfolio";

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDW977qXkBO56Pr5xdQG3XCPFOpD2TcRlk",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "siddharth-varpe-portfolio.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "271096455502",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:271096455502:web:1bb939411419849ccf3e1f",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LHF5BHR1WW",
};

export const clientApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
export const clientAuth: Auth = getAuth(clientApp);
export const clientDb: Firestore = getFirestore(clientApp);
export const clientStorage: FirebaseStorage = getStorage(clientApp);
