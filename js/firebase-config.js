/**
 * FIREBASE CONFIGURATION
 *
 * Hướng dẫn setup:
 * 1. Truy cập Firebase Console: https://console.firebase.google.com/
 * 2. Tạo project mới hoặc chọn project có sẵn
 * 3. Vào Project Settings > Your apps > Web app
 * 4. Copy Firebase config và thay thế vào phần firebaseConfig bên dưới
 * 5. Bật Authentication (Email/Password)
 * 6. Tạo Firestore Database (test mode)
 *
 * LƯU Ý: Hệ thống này KHÔNG dùng Firebase Storage (không free)
 * Thay vào đó, images được lưu dưới dạng Base64 trong Firestore
 */

// Import Firebase SDK v9+ (modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADcugP3jcSI1tmZUKWz-QROeX2jkHiH5k",
  authDomain: "phulong-54b1a.firebaseapp.com",
  projectId: "phulong-54b1a",
  storageBucket: "phulong-54b1a.firebasestorage.app",
  messagingSenderId: "545621521894",
  appId: "1:545621521894:web:35f41775e0bb64d2089227",
  measurementId: "G-QWYHX305XL"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Export các services để sử dụng trong các file khác
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection name trong Firestore
export const COLLECTION_NAME = 'landing_page';

console.log('✅ Firebase initialized successfully (using Base64 for images)');
