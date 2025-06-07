import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy1yj3UYhG-ITRsP7yqf1DoauLZPvmjvs",
  authDomain: "coinly-76e67.firebaseapp.com",
  projectId: "coinly-76e67",
  storageBucket: "coinly-76e67.firebasestorage.app",
  messagingSenderId: "1092659313084",
  appId: "1:1092659313084:web:3b055398640fd18b0253b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };