// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore,
    collection,
    addDoc, orderBy, getDocs,
    query, limit } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJF4FPH6EXs1jNWzFuTaevX5SIGrn4ZXA",
    authDomain: "turn-project-7725f.firebaseapp.com",
    projectId: "turn-project-7725f",
    storageBucket: "turn-project-7725f.appspot.com",
    messagingSenderId: "762417957244",
    appId: "1:762417957244:web:60872ad611736c04ba7cf9",
    measurementId: "G-GW1R53GSBG"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rankRef = collection(db,"rank1"); //rank1 컬렉션 하위를 모두 가져옴
const rank =[];
export const saveinfo = (score, time) =>
  addDoc(rankRef,{score,time});

// rankRef를 score는 내림차순, time은 오름차순으로 10개만 쿼리로 묶음
export const rankquery = query(rankRef, orderBy("score","desc"),orderBy("time"),limit(10)) 
const querySnapshot = await getDocs(rankquery);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  //console.log(doc.id, " => ", doc.data()); //콘솔 로그 확인 용
  rank.push(doc.data())
});
export const rankpage = rank;