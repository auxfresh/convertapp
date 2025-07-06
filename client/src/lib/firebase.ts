import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { getDatabase, ref, push, set, query, orderByChild, limitToLast, onValue, off, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}-default-rtdb.firebaseio.com/`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-in
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, googleProvider);
};

export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Auth redirect error:", error);
    throw error;
  }
};

// Email/Password Authentication
export const signUpWithEmailAndPassword = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    if (userCredential.user && displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const signOutUser = () => {
  return signOut(auth);
};

// Firebase Realtime Database functions for storing conversion history
export interface ConversionRecord {
  id?: string;
  type: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  exchangeRate?: number;
  timestamp: number;
}

export const saveConversionToFirebase = async (userId: string, conversion: Omit<ConversionRecord, 'id' | 'timestamp'>) => {
  try {
    const conversionsRef = ref(database, `users/${userId}/conversions`);
    const newConversionRef = push(conversionsRef);
    
    const conversionWithTimestamp: ConversionRecord = {
      ...conversion,
      timestamp: Date.now(),
    };
    
    await set(newConversionRef, conversionWithTimestamp);
    return newConversionRef.key;
  } catch (error) {
    console.error('Error saving conversion to Firebase:', error);
    throw error;
  }
};

export const getRecentConversions = (userId: string, limit: number = 10, callback: (conversions: ConversionRecord[]) => void) => {
  const conversionsRef = ref(database, `users/${userId}/conversions`);
  const recentQuery = query(conversionsRef, orderByChild('timestamp'), limitToLast(limit));
  
  const unsubscribe = onValue(recentQuery, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const conversions: ConversionRecord[] = Object.entries(data).map(([id, conversion]) => ({
        id,
        ...(conversion as Omit<ConversionRecord, 'id'>),
      })).reverse(); // Most recent first
      callback(conversions);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

export const clearConversionHistory = async (userId: string) => {
  try {
    const conversionsRef = ref(database, `users/${userId}/conversions`);
    await remove(conversionsRef);
  } catch (error) {
    console.error('Error clearing conversion history:', error);
    throw error;
  }
};

export type { User as FirebaseUser };
