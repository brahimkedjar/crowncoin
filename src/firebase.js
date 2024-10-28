// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAarGT4dQezrVqbDCQh3zZ6LIE-L6E77K8",
    authDomain: "sgovs-abf1f.firebaseapp.com",
    projectId: "sgovs-abf1f",
    storageBucket: "sgovs-abf1f.appspot.com",
    messagingSenderId: "204434892234",
    appId: "1:204434892234:web:9ec848c225deb65e665b33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
