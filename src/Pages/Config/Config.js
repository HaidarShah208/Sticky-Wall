// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY1LDm9mzwdr9edPON1hU3TUKw-9U2gB8",
  authDomain: "stikcy-wall.firebaseapp.com",
  projectId: "stikcy-wall",
  storageBucket: "stikcy-wall.appspot.com",
  messagingSenderId: "3173808772",
  appId: "1:3173808772:web:08f6ba6afacf8098b060d1",
  measurementId: "G-FEGE9Q57FQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {app,analytics,firestore,auth};