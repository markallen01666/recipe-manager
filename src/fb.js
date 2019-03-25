import firebase from "firebase/app"
import "firebase/firestore"

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA8SKVMNAp9sVPnobdzvIR7LfexxKppAow",
  authDomain: "vuetify-example-54c1e.firebaseapp.com",
  databaseURL: "https://vuetify-example-54c1e.firebaseio.com",
  projectId: "vuetify-example-54c1e",
  storageBucket: "vuetify-example-54c1e.appspot.com",
  messagingSenderId: "174986386894"
};
firebase.initializeApp(config);

const db = firebase.firestore();

export default db;