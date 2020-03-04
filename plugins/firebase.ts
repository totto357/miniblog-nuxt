import firebase from "firebase"

const config = {
  apiKey: "AIzaSyA1weyhTGkdD5KRNmA13vT9wqdG75dqbSg",
  authDomain: "miniblog-nuxt.firebaseapp.com",
  databaseURL: "https://miniblog-nuxt.firebaseio.com",
  projectId: "miniblog-nuxt",
  storageBucket: "miniblog-nuxt.appspot.com",
  messagingSenderId: "196630679337",
  appId: "1:196630679337:web:9757648ff876ca7102b138"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const db = firebase.firestore()
