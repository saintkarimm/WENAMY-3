/**
 * Authentication Module
 * Handles all Firebase authentication logic
 */

import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User display name
 * @returns {Promise<Object>} - User credential
 */
export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  
  return userCredential;
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User credential
 */
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Observe authentication state changes
 * @param {Function} callback - Callback function(user)
 * @returns {Function} - Unsubscribe function
 */
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get user-friendly error message
 * @param {string} code - Firebase error code
 * @returns {string} - Human-readable error message
 */
export const getAuthErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use': 'Email already registered. Please sign in.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.'
  };
  return messages[code] || 'An error occurred. Please try again.';
};
