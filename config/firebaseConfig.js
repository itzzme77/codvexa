// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5sTkPejyjH-loBvH8owv55_gdEA1i6No",
  authDomain: "attendanceapp-7a8b6.firebaseapp.com",
  projectId: "attendanceapp-7a8b6",
  storageBucket: "attendanceapp-7a8b6.firebasestorage.app",
  messagingSenderId: "1082146625171",
  appId: "1:1082146625171:web:0dd0ebcdf53f3f4ac09f66",
  measurementId: "G-D5FPC9RN8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
