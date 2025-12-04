// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkzAddohgpRIJaPagTgE0USwfYBJYqzkA",
  authDomain: "association-d3568.firebaseapp.com",
  projectId: "association-d3568",
  storageBucket: "association-d3568.firebasestorage.app",
  messagingSenderId: "615756770100",
  appId: "1:615756770100:web:e0c1581559d49336865361",
  measurementId: "G-2WP5D9GXWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);