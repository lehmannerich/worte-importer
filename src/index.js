import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    updateDoc
  } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBkmGLluiIFmN9lYMY0UrEEk3H1BHQbIhE",
    authDomain: "words-6ab0b.firebaseapp.com",
    projectId: "words-6ab0b",
    storageBucket: "words-6ab0b.appspot.com",
    messagingSenderId: "89434132335",
    appId: "1:89434132335:web:ac8d974fcd0483a937e29a"
};

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'words')

// queries
const q = query(colRef, where("tag", "==", "tiere"), orderBy('createdAt'))

// realtime collection data
onSnapshot(colRef, (snapshot) => {
    let words = [];
    let str = '<ul>';
    snapshot.docs.forEach((doc) => {
        words.push(doc.data())
    })
    words.forEach((word) => {
        str += '<li>' + word.word + ', ' + word.tag + '</li>';
    });
    str += '</ul>';
    document.getElementById("wordbox").innerHTML = str;
});

// adding docs
const addWordForm = document.querySelector('.add')
addWordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let list = addWordForm.word.value.trim().split("\n");

    list.forEach((item) => {
        addDoc(colRef, {
            tag: addWordForm.tag.value,
            word: item,
            createdAt: serverTimestamp()
        })
    });

    addWordForm.reset();
});

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'words', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

// fetching a single document (& realtime)
const docRef = doc(db, 'words', 'Or6POm2lnWVaWTeuNKqs')

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'words', updateForm.id.value)

  updateDoc(docRef, {
    word: 'updated word'
  })
  .then(() => {
    updateForm.reset()
  })
})