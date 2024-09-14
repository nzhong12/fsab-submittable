import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaUdFFlPCSLZ3iRyEic08z86VB87DCw1U",
    authDomain: "react-collegecandidates-proj.firebaseapp.com",
    projectId: "react-collegecandidates-proj",
    storageBucket: "react-collegecandidates-proj.appspot.com",
    messagingSenderId: "435915539864",
    appId: "1:435915539864:web:1807135dd08d8cf01dd7ed"
  };

const app = initializeApp(firebaseConfig) // interact with firebase backend

const db = getFirestore(app)

export { db }