import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyB4W48z34aDNRDB_iSeK9G6guJG-QIDYYA",
    authDomain: "book-shelf-database.firebaseapp.com",
    databaseURL: "https://book-shelf-database.firebaseio.com",
    projectId: "book-shelf-database",
    storageBucket: "book-shelf-database.appspot.com",
    messagingSenderId: "505919260844"
};
firebase.initializeApp(config);

export default firebase;