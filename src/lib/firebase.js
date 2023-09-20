import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAym9PMq4Q1Fqt6nV_PVUt-vTId2J162ds",
    authDomain: "steradian-f7a8e.firebaseapp.com",
    projectId: "steradian-f7a8e",
    storageBucket: "steradian-f7a8e.appspot.com",
    messagingSenderId: "281885251916",
    appId: "1:281885251916:web:c1acbc9a1e626d4b8d17e9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };