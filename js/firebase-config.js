

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyADcugP3jcSI1tmZUKWz-QROeX2jkHiH5k",
  authDomain: "phulong-54b1a.firebaseapp.com",
  projectId: "phulong-54b1a",
  storageBucket: "phulong-54b1a.firebasestorage.app",
  messagingSenderId: "545621521894",
  appId: "1:545621521894:web:35f41775e0bb64d2089227",
  measurementId: "G-QWYHX305XL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const COLLECTION_NAME = 'landing_page';