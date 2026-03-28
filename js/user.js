/**
 * User Database Module
 * Handles all Firestore user data operations
 */

import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/**
 * Create a new user profile in Firestore
 * @param {Object} user - Firebase user object
 * @param {Object} additionalData - Additional user data (phone, etc.)
 */
export const createUserProfile = async (user, additionalData = {}) => {
  const userRef = doc(db, "users", user.uid);
  
  const userData = {
    uid: user.uid,
    name: user.displayName || additionalData.name || user.email.split('@')[0],
    email: user.email,
    phone: additionalData.phone || '',
    location: '',
    preference: '',
    savedProperties: [],
    inquiries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await setDoc(userRef, userData);
  return userData;
};

/**
 * Get user profile from Firestore
 * @param {string} uid - User ID
 * @returns {Object|null} - User profile data
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
};

/**
 * Update user profile
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
 */
export const updateUserProfile = async (uid, updates) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

/**
 * Save a property to user's saved properties
 * @param {string} uid - User ID
 * @param {Object} property - Property object to save
 */
export const saveProperty = async (uid, property) => {
  const userRef = doc(db, "users", uid);
  
  // Check if already saved
  const userData = await getUserProfile(uid);
  if (userData?.savedProperties?.some(p => p.id === property.id)) {
    throw new Error('Property already saved');
  }
  
  await updateDoc(userRef, {
    savedProperties: arrayUnion({
      ...property,
      savedAt: new Date().toISOString()
    }),
    updatedAt: new Date().toISOString()
  });
};

/**
 * Remove a property from user's saved properties
 * @param {string} uid - User ID
 * @param {string} propertyId - Property ID to remove
 */
export const removeSavedProperty = async (uid, propertyId) => {
  const userRef = doc(db, "users", uid);
  
  // Get current saved properties
  const userData = await getUserProfile(uid);
  if (!userData?.savedProperties) return;
  
  // Find the property to remove
  const propertyToRemove = userData.savedProperties.find(p => p.id === propertyId);
  if (!propertyToRemove) return;
  
  await updateDoc(userRef, {
    savedProperties: arrayRemove(propertyToRemove),
    updatedAt: new Date().toISOString()
  });
};

/**
 * Get user's saved properties
 * @param {string} uid - User ID
 * @returns {Array} - Array of saved properties
 */
export const getSavedProperties = async (uid) => {
  const userData = await getUserProfile(uid);
  return userData?.savedProperties || [];
};

/**
 * Add an inquiry
 * @param {string} uid - User ID
 * @param {Object} inquiry - Inquiry data
 */
export const addInquiry = async (uid, inquiry) => {
  const userRef = doc(db, "users", uid);
  
  const newInquiry = {
    ...inquiry,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  await updateDoc(userRef, {
    inquiries: arrayUnion(newInquiry),
    updatedAt: new Date().toISOString()
  });
  
  return newInquiry;
};

/**
 * Get user's inquiries
 * @param {string} uid - User ID
 * @returns {Array} - Array of inquiries
 */
export const getInquiries = async (uid) => {
  const userData = await getUserProfile(uid);
  return userData?.inquiries || [];
};
