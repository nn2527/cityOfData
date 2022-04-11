// We have added prof. Dave and prof. Yiran to the firebase folder name: City of Datum 8 Doodle
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, // etc. etc.
  collection,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_ms7pXusr9AW4Oaw0o76VhWjTdm5XAn8",
  authDomain: "city-of-datum-8-doodle.firebaseapp.com",
  projectId: "city-of-datum-8-doodle",
  storageBucket: "city-of-datum-8-doodle.appspot.com",
  messagingSenderId: "228916488563",
  appId: "1:228916488563:web:b8575aa8911dc6cee07d06",
  measurementId: "G-9C3WH80S49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
var noteRef = collection(db, "notes");
var moneyDoc = doc(db, "money", "amount");

const App = Vue.createApp({
  data() {
    return {
      notes: [],
      poses: [],
      description: "",
      money: 0,
      giveamount: 0,
      randomnote: "",
      display: false
    };
  },
  async mounted() {
    // await deleteDoc(doc(db, "notes", "note6"));
    // ^If we want to delete a doc we used for testing
    let querySnapshot = await getDocs(collection(db, "notes"));
    let notes = [];
    querySnapshot.forEach((doc) => {
      notes.push(doc.data());
    });
    this.notes = notes;

    let querySnapshot2 = await getDocs(collection(db, "poses"));
    let poses = [];
    querySnapshot2.forEach((doc) => {
      poses.push(doc.data());
    });
    this.poses = poses;
    let rand = Math.floor(Math.random() * this.poses.length);
    console.log(poses[rand]);
    if (poses[rand].content.includes("stand")) {
      this.description = "she's standing with her hand reaching out.";
    } else if (poses[rand].content.includes("sit")) {
      this.description = "the way she stands is very elegant!";
    } else if (poses[rand].content.includes("observe")) {
      this.description = "you suddenly realize...her head moves!";
    } else if (poses[rand].content.includes("rotate")) {
      this.description = "her body begins to rotate...she's alive!";
    }

    let money = await getDoc(moneyDoc);
    money = money.data();
    this.money = money.amount;
  },
  //   How income accumulated
  methods: {
    async checkgive() {
      if (this.giveamount == 0) {
        alert("You did not contribute any money 🥺 😢 😭");
      } else {
        this.display = true;
        this.money += Number(this.giveamount);
        let moneyDoc = doc(db, "money", "amount");
        await setDoc(moneyDoc, {
          amount: this.money
        });
        this.giveamount = 0;
        this.aftergiving();
      }
    },
    aftergiving() {
      //visitor will get a random note everything they give more money.
      let rand = Math.floor(Math.random() * this.notes.length);
      this.randomnote = this.notes[rand].content;
    },
    async addnote() {
      let docname = "note" + (this.notes.length + 1);
      this.notes.push(this.typenote);
      const docRef = await setDoc(doc(db, "notes", docname), {
        content: this.typenote
      });
      this.display = false;
      this.typenote = "";
      alert("Thank you for your note 😍 🤗 🥳");
    }
  }
});

App.component("note", {
  props: ["note"],
  template: `<li>{{ note.content }}</li>`
});

App.mount("#app");
