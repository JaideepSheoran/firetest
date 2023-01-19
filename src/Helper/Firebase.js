import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase, onValue } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyC5xbgRr572MqJuqtWTGGWa6-OMCDZGG80",
    authDomain: "fir-ada33.firebaseapp.com",
    projectId: "fir-ada33",
    storageBucket: "fir-ada33.appspot.com",
    messagingSenderId: "130456357757",
    appId: "1:130456357757:web:cb9ec6f80f5cf228491a14",
    databaseURL: "https://fir-ada33-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage();
export const storageRef = ref(storage, 'images');
export const database = getFirestore(app);
export const realTimeDatabase = getDatabase(app);
