// import 'crypto-browserify/index';
// import 'url';
// import 'util';
// import 'stream-browserify/index';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import admin from 'firebase-admin';

// var serviceAccount = require("./blog-site-e4aad-firebase-adminsdk-e2sxs-a6fbe87b8a.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const firebaseConfig = {
    apiKey: "AIzaSyBgN6HXIQzZ4Bw5onQk00xONMXCmxMcF4I",
    authDomain: "blog-site-e4aad.firebaseapp.com",
    projectId: "blog-site-e4aad",
    storageBucket: "blog-site-e4aad.appspot.com",
    messagingSenderId: "473655799045",
    appId: "1:473655799045:web:072cc18ccb1709c55d9b6c",
    measurementId: "G-PMERWHCCRQ"
  };

  export const firebaseApp = initializeApp(firebaseConfig);
  export const auth = getAuth(firebaseApp);
  export const provider = new GoogleAuthProvider();
  export const firestore = getFirestore(firebaseApp);
  export const storage = getStorage(firebaseApp);
