// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB9aE_tPDMhKX92w8t05-_s0Jn4WYQ1bo",
  authDomain: "atari-bb474.firebaseapp.com",
  projectId: "atari-bb474",
  storageBucket: "atari-bb474.appspot.com",
  messagingSenderId: "312113110330",
  appId: "1:312113110330:web:d913af6109f15a0d1b4403",
  measurementId: "G-0SD8XTPMVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }
