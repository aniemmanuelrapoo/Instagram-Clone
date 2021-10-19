  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAt6wPfA9H8UUr_eS7MKROAjIjdiSt_WQM",
    authDomain: "aniemmanuel-instagram-clone.firebaseapp.com",
    projectId: "aniemmanuel-instagram-clone",
    storageBucket: "aniemmanuel-instagram-clone.appspot.com",
    messagingSenderId: "6934757256",
    appId: "1:6934757256:web:897a5547f0ef45cb7d043d"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };