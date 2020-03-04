import firebase from "firebase"

const config = {
  apiKey: "AIzaSyBlL6jeJByze2AiHP6a47aWhpVv4uFKrsE",
  authDomain: "nuxt-ts.firebaseapp.com",
  databaseURL: "https://nuxt-ts.firebaseio.com",
  projectId: "nuxt-ts",
  storageBucket: "nuxt-ts.appspot.com",
  messagingSenderId: "217016186100",
  appId: "1:217016186100:web:5f04ec9cda088601881aa1"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const db = firebase.firestore()
