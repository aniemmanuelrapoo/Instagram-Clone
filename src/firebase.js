  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCnMdSs93IAzj2U4w-DdrjZ-Q5Emr4ILZw",
      authDomain: "instagram-clone-9874-6bddd.firebaseapp.com",
      projectId: "instagram-clone-9874-6bddd",
      storageBucket: "instagram-clone-9874-6bddd.appspot.com",
      messagingSenderId: "9552441587",
      appId: "1:9552441587:web:66dcf9d71aae18c7628786",
      measurementId: "G-B3J860KMV4"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };