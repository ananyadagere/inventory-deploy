// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhMbcX2cBqRxgovKkIbL-qA1vIyzDRvZQ",
  authDomain: "inventory-management-app-a1c12.firebaseapp.com",
  projectId: "inventory-management-app-a1c12",
  storageBucket: "inventory-management-app-a1c12.appspot.com",
  messagingSenderId: "975237832911",
  appId: "1:975237832911:web:717ea7d09c035584b497ba",
  measurementId: "G-361KP3M2Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore};