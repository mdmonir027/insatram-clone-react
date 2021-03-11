import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRBASE__API__KEY,
  authDomain: process.env.REACT_APP_FIRBASE__AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRBASE__PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRBASE__STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRBASE__MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_FIRBASE__APP_ID,
  measurementId: process.env.REACT_APP_FIRBASE__MEASUREMENT_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebaseApp.firestore();

export { db, auth, storage };
