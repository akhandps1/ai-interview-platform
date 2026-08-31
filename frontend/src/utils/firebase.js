/**
 * FILE: frontend/src/utils/firebase.js
 * PURPOSE: Core logic and configuration for firebase.js.
 */

import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "aiinterview-a9e37.firebaseapp.com",
  projectId: "aiinterview-a9e37",
  storageBucket: "aiinterview-a9e37.firebasestorage.app",
  messagingSenderId: "85111325057",
  appId: "1:85111325057:web:0c91034a5fffff790be880"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}