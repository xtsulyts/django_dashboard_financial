// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClaZZXiSSPvikECwcR6qamrR1SRuif_EA",
  authDomain: "dashboard-financial-7d9ef.firebaseapp.com",
  projectId: "dashboard-financial-7d9ef",
  storageBucket: "dashboard-financial-7d9ef.firebasestorage.app",
  messagingSenderId: "604889819950",
  appId: "1:604889819950:web:b428bdb702aab70ce4e8bf",
  measurementId: "G-Z5DV8HVSE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);