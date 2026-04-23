// src/firebase/firestore.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDBMYBq-m4MoARvifZga7Hx-lbJPReIPU",
    authDomain: "world-cup-predictor-d12e7.firebaseapp.com",
    projectId: "world-cup-predictor-d12e7",
    storageBucket: "world-cup-predictor-d12e7.firebasestorage.app",
    messagingSenderId: "322210802213",
    appId: "1:322210802213:web:eecbac929f1f4753f56dcc",
    measurementId: "G-X9C4V7E6QS"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);