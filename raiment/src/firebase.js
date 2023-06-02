import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "raiment-497.firebaseapp.com",
  projectId: "raiment-497",
  storageBucket: "raiment-497.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

// const storage = getStorage(firebaseApp);
// "gs://raiment-497.appspot.com"
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { auth, storage };
export default db;
