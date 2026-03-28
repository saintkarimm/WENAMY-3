/**
 * Global Auth State Manager
 * Single source of truth for authentication state
 * Uses subscription pattern with real-time updates
 */

import { observeAuth } from './auth.js';
import { getUserProfile } from './user.js';
import { db } from './firebase.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Global state
let currentUser = null;
let userProfile = null;
let isAuthReady = false;
let isLoading = true;
let lastUserId = null;

// Real-time listener unsubscribe function
let unsubscribeUserDoc = null;

// Subscription registry
const subscribers = new Set();

// Cache for user data to prevent repeated Firestore calls
const cache = {
  userProfile: null,
  savedProperties: null,
  lastFetched: null,
  userId: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clear all cached data
 * Call on logout or user switch
 */
const clearCache = () => {
  cache.userProfile = null;
  cache.savedProperties = null;
  cache.lastFetched = null;
  cache.userId = null;
};

/**
 * Check if cache is valid for current user
 */
const isCacheValid = (userId) => {
  return cache.userId === userId && 
         cache.userProfile && 
         cache.lastFetched && 
         (Date.now() - cache.lastFetched) < CACHE_DURATION;
};

/**
 * Setup real-time listener for user document
 */
const setupUserListener = (uid) => {
  // Unsubscribe from previous listener
  if (unsubscribeUserDoc) {
    unsubscribeUserDoc();
    unsubscribeUserDoc = null;
  }
  
  const userRef = doc(db, "users", uid);
  
  unsubscribeUserDoc = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const newData = doc.data();
      
      // Only update if data actually changed
      if (JSON.stringify(userProfile) !== JSON.stringify(newData)) {
        userProfile = newData;
        
        // Update cache
        cache.userProfile = newData;
        cache.lastFetched = Date.now();
        
        notifySubscribers();
      }
    }
  }, (error) => {
    console.error('Auth state: Real-time listener error:', error);
  });
};

/**
 * Initialize global auth state
 * Call this once at app startup
 */
export const initAuthState = () => {
  observeAuth(async (user) => {
    isLoading = true;
    
    // Handle user switch - clear cache if different user
    if (user && lastUserId && user.uid !== lastUserId) {
      clearCache();
    }
    
    // Handle logout - clear everything
    if (!user && lastUserId) {
      clearCache();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }
    }
    
    currentUser = user;
    lastUserId = user?.uid || null;
    
    if (user) {
      try {
        // Check cache first
        if (isCacheValid(user.uid)) {
          userProfile = cache.userProfile;
        } else {
          userProfile = await getUserProfile(user.uid);
          
          // Create profile if missing
          if (!userProfile) {
            const { createUserProfile } = await import('./user.js');
            userProfile = await createUserProfile(user, { name: user.displayName || '' });
          }
          
          // Update cache
          cache.userProfile = userProfile;
          cache.lastFetched = Date.now();
          cache.userId = user.uid;
        }
        
        // Setup real-time listener for updates
        setupUserListener(user.uid);
      } catch (error) {
        console.error('Auth state: Error fetching profile:', error);
        userProfile = null;
      }
    } else {
      userProfile = null;
      clearCache();
    }
    
    isAuthReady = true;
    isLoading = false;
    
    // Notify all subscribers
    notifySubscribers();
  });
  
  // Listen for storage events (multi-tab sync)
  window.addEventListener('storage', handleStorageEvent);
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function({ user, profile, isReady, isLoading })
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuth = (callback) => {
  subscribers.add(callback);
  
  // Immediately call with current state if ready
  if (isAuthReady) {
    callback({
      user: currentUser,
      profile: userProfile,
      isReady: isAuthReady,
      isLoading
    });
  }
  
  return () => subscribers.delete(callback);
};

/**
 * Notify all subscribers of state change
 */
const notifySubscribers = () => {
  const state = {
    user: currentUser,
    profile: userProfile,
    isReady: isAuthReady,
    isLoading
  };
  
  subscribers.forEach(callback => {
    try {
      callback(state);
    } catch (error) {
      console.error('Auth state: Subscriber error:', error);
    }
  });
};

/**
 * Get current auth state (synchronous)
 * @returns {Object} - Current auth state
 */
export const getAuthState = () => ({
  user: currentUser,
  profile: userProfile,
  isReady: isAuthReady,
  isLoading
});

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => !!currentUser;

/**
 * Get current user ID
 * @returns {string|null}
 */
export const getCurrentUserId = () => currentUser?.uid || null;

/**
 * Update cached user profile
 * @param {Object} updates - Profile updates
 */
export const updateCachedProfile = (updates) => {
  if (userProfile) {
    userProfile = { ...userProfile, ...updates };
    cache.userProfile = userProfile;
    notifySubscribers();
  }
};

/**
 * Invalidate cache (call after data mutations)
 * Also broadcasts to other tabs
 */
export const invalidateCache = () => {
  cache.userProfile = null;
  cache.savedProperties = null;
  cache.lastFetched = null;
  
  // Broadcast to other tabs
  try {
    localStorage.setItem('wenamy_cache_invalidated', Date.now().toString());
    localStorage.removeItem('wenamy_cache_invalidated');
  } catch (e) {
    // Ignore localStorage errors (private mode)
  }
};

/**
 * Handle storage events for multi-tab sync
 */
const handleStorageEvent = (e) => {
  if (e.key === 'wenamy_auth_logout') {
    // Another tab logged out - refresh to sync
    window.location.reload();
  } else if (e.key === 'wenamy_cache_invalidated') {
    // Another tab invalidated cache
    cache.userProfile = null;
    cache.savedProperties = null;
    cache.lastFetched = null;
  }
};

/**
 * Broadcast logout to other tabs
 */
export const broadcastLogout = () => {
  try {
    localStorage.setItem('wenamy_auth_logout', Date.now().toString());
    localStorage.removeItem('wenamy_auth_logout');
  } catch (e) {
    // Ignore localStorage errors (private mode)
  }
};

/**
 * Wait for auth to be ready
 * @returns {Promise<Object>} - Auth state
 */
export const waitForAuth = () => {
  return new Promise((resolve) => {
    if (isAuthReady) {
      resolve(getAuthState());
      return;
    }
    
    const unsubscribe = subscribeToAuth((state) => {
      if (state.isReady) {
        unsubscribe();
        resolve(state);
      }
    });
  });
};
