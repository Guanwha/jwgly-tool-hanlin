import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
import 'firebase/database';

// Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAo3ucyajUjVBZp5f--u1ckGgBFE9X7Tdw',
  authDomain: 'jwgly-tool-hanlin.firebaseapp.com',
  databaseURL: 'https://jwgly-tool-hanlin.firebaseio.com',
  projectId: 'jwgly-tool-hanlin',
  storageBucket: 'jwgly-tool-hanlin.appspot.com',
  messagingSenderId: '318245930077',
  appId: '1:318245930077:web:edec68bdd7c7b3162af9b4',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
