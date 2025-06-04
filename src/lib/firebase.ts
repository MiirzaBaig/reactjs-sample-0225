import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcSYyU-LbVUZLBFMUEdtTA1l_FKdEv1_8",
  authDomain: "matrix-fd5d5.firebaseapp.com",
  projectId: "matrix-fd5d5",
  storageBucket: "matrix-fd5d5.firebasestorage.app",
  messagingSenderId: "776017269484",
  appId: "1:776017269484:web:d05a6c69416e19695a8bc9",
  measurementId: "G-CZ3S8Y0SMR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); 