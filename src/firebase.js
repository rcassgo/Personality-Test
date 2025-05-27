import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo1qO9R0C0F_mJBrGebarnStVow73U3rM",
  authDomain: "apersonality-test.firebaseapp.com",
  projectId: "apersonality-test",
  storageBucket: "apersonality-test.firebasestorage.app",
  messagingSenderId: "457960634265",
  appId: "1:457960634265:web:aad3f14495b161c8938508"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
