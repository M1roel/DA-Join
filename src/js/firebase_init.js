const firebaseConfig = {
  apiKey: "AIzaSyAHxp8mS5rkKRPAmEbvzthcTNu6-0EhWZ4",
  authDomain: "join-2ee9e.firebaseapp.com",
  databaseURL: "https://join-2ee9e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-2ee9e",
  storageBucket: "join-2ee9e.appspot.com",
  messagingSenderId: "556856087583",
  appId: "1:556856087583:web:9fb061542276ce800e312a",
  measurementId: "G-BRE1SCSM0J",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
