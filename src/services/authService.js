import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';

/**
 * Sign in user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: object, role: string}>}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User role not found. Please contact administrator.');
    }
    
    const userData = userDoc.data();
    const role = userData.role; // 'employee' | 'manager' | 'admin'
    
    return { 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || user.email,
      }, 
      role 
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user with role
 * @param {string} email 
 * @param {string} password 
 * @param {string} role - 'employee' | 'manager' | 'admin'
 * @param {string} displayName 
 * @returns {Promise<object>}
 */
export const registerUser = async (email, password, role, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      isActive: true
    });
    
    return { user, role };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get user role from Firestore
 * @param {string} uid 
 * @returns {Promise<string>}
 */
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 * @param {function} callback 
 * @returns {function} unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await getUserRole(user.uid);
      callback({ user, role });
    } else {
      callback(null);
    }
  });
};

/**
 * Get current user
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
