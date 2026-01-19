/**
 * Firebase User Creation Script
 * 
 * This script helps you create initial users for testing the authentication system.
 * Run this script using Node.js after setting up your Firebase project.
 * 
 * Usage: node scripts/createUsers.js
 * 
 * Note: You need to run this in a Node.js environment, not in React Native.
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Sample users to create
const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    displayName: 'Admin User'
  },
  {
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    displayName: 'Manager User'
  },
  {
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee',
    displayName: 'Employee User'
  }
];

async function createUser(userData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName,
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    console.log(`✓ Created ${userData.role}: ${userData.email}`);
    return true;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`✗ User already exists: ${userData.email}`);
    } else {
      console.error(`✗ Error creating ${userData.email}:`, error.message);
    }
    return false;
  }
}

async function createAllUsers() {
  console.log('Starting user creation...\n');
  
  for (const userData of users) {
    await createUser(userData);
  }
  
  console.log('\n✓ User creation process completed!');
  console.log('\nYou can now use these credentials to log in:');
  console.log('- admin@example.com / admin123 (Admin)');
  console.log('- manager@example.com / manager123 (Manager)');
  console.log('- employee@example.com / employee123 (Employee)');
  
  process.exit(0);
}

// Run the script
createAllUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
