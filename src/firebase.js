
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRPGSeCB2iTt7a8X3WCYBc5pYBmLUAYUo",
  authDomain: "e-commerce-96181.firebaseapp.com",
  projectId: "e-commerce-96181",
  storageBucket: "e-commerce-96181.appspot.com",
  messagingSenderId: "367139920710",
  appId: "1:367139920710:web:51c57317f924a866b06347"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;















