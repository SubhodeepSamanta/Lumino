// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLYXbQ9HZn-JLbkZ5mf71RBIcL1Mh7RwQ",
  authDomain: "lumino-silk.firebaseapp.com",
  projectId: "lumino-silk",
  storageBucket: "lumino-silk.firebasestorage.app",
  messagingSenderId: "386319384592",
  appId: "1:386319384592:web:0516ddbd7318bed407ca95",
  measurementId: "G-05JNPGDL1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 