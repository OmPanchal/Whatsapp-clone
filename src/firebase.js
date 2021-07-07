import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCZZ5O3PzIcJMQ_XzRyoQfrVYtd0zMuRuE",
  authDomain: "whatsapp-clone-ef09c.firebaseapp.com",
  projectId: "whatsapp-clone-ef09c",
  storageBucket: "whatsapp-clone-ef09c.appspot.com",
  messagingSenderId: "842130201063",
  appId: "1:842130201063:web:4f6d30303a766b7a94c542",
  measurementId: "G-4TD8GNXY82",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
