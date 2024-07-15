import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);

const apikey = process.env.REACT_APP_API_KEY

const firebaseConfig = {
  apiKey: apikey,
  authDomain: "chat-app-d23c8.firebaseapp.com",
  projectId: "chat-app-d23c8",
  storageBucket: "chat-app-d23c8.appspot.com",
  messagingSenderId: "1788262347",
  appId: "1:1788262347:web:a1af5ae47a19b72ee2284e",
  measurementId: "G-LCLC3MZ8WW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

export {auth, db, storage};