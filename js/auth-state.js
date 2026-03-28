/**
 * Global Auth State Manager
 * Single source of truth for authentication state
 * Uses subscription pattern with real-time updates
 * Optimized for performance and cost efficiency
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
let unsubscribeAuth = null;

// Subscription registry
const subscribers = new Set();

// Debounce timer for notifications
let notifyTimeout = null;
const NOTIFY_DEBOUNCE = 50; // ms

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
 * Deep compare two objects for equality
 * More efficient than JSON.stringify for large objects
 */
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};

/**
 * Setup real-time listener for user document
 * Uses metadata comparison for performance
 */
const setupUserListener = (uid) => {
  // Unsubscribe from previous listener
  if (unsubscribeUserDoc) {
    unsubscribeUserDoc();
    unsubscribeUserDoc = null;
  }
  
  const userRef = doc(db, "users", uid);
  
  unsubscribeUserDoc = onSnapshot(
    userRef,
    { includeMetadataChanges: false }, // Only data changes, not metadata
    (doc) => {
      if (doc.exists()) {
        const newData = doc.data();
        
        // Only update if data actually changed (deep compare)
        if (!deepEqual(userProfile, newData)) {
          userProfile = newData;
          
          // Update cache
          cache.userProfile = newData;
          cache.lastFetched = Date.now();
          
          notifySubscribers();
        }
      }
    },
    (error) => {
      console.error('Auth state: Real-time listener error:', error);
    }
  );
};

/**
 * Cleanup all listeners and state
 * Call when app is being destroyed or for testing
 */
export const cleanupAuthState = () => {
  // Unsubscribe from auth listener
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
  }
  
  // Unsubscribe from user document listener
  if (unsubscribeUserDoc) {
    unsubscribeUserDoc();
    unsubscribeUserDoc = null;
  }
  
  // Clear debounce timeout
  if (notifyTimeout) {
    clearTimeout(notifyTimeout);
    notifyTimeout = null;
  }
  
  // Remove storage event listener
  window.removeEventListener('storage', handleStorageEvent);
  
  // Clear all state
  clearCache();
  currentUser = null;
  userProfile = null;
  isAuthReady = false;
  isLoading = true;
  lastUserId = null;
  subscribers.clear();
};

/**
 * Initialize global auth state
 * Call this once at app startup
 * @returns {Function} - Cleanup function
 */
export const initAuthState = () => {
  // Prevent duplicate initialization
  if (unsubscribeAuth) {
    console.warn('Auth state: Already initialized');
    return cleanupAuthState;
  }
  
  unsubscribeAuth = observeAuth(async (user) => {
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
    
    // IMMEDIATE: Notify subscribers that auth state is known (before Firestore)
    // This prevents navbar flicker - shows auth state immediately
    isAuthReady = true;
    notifySubscribers();
    
    if (user) {
      try {
        // Check cache first for instant display
        if (isCacheValid(user.uid)) {
          userProfile = cache.userProfile;
          notifySubscribers(); // Update with cached profile
        }
        
        // Fetch fresh data from Firestore
        const freshProfile = await getUserProfile(user.uid);
        
        if (freshProfile) {
          userProfile = freshProfile;
        } else {
          // Create profile if missing
          const { createUserProfile } = await import('./user.js');
          userProfile = await createUserProfile(user, { name: user.displayName || '' });
        }
        
        // Update cache
        cache.userProfile = userProfile;
        cache.lastFetched = Date.now();
        cache.userId = user.uid;
        
        // Setup real-time listener for updates
        setupUserListener(user.uid);
        
        // Notify with fresh data
        notifySubscribers();
      } catch (error) {
        console.error('Auth state: Error fetching profile:', error);
        // Don't clear userProfile on error - keep cached version if available
      }
    } else {
      userProfile = null;
      clearCache();
    }
    
    isLoading = false;
    notifySubscribers();
  });
  
  // Listen for storage events (multi-tab sync)
  window.addEventListener('storage', handleStorageEvent);
  
  // Return cleanup function
  return cleanupAuthState;
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
 * Debounced to prevent rapid re-renders
 */
const notifySubscribers = () => {
  // Clear existing timeout
  if (notifyTimeout) {
    clearTimeout(notifyTimeout);
  }
  
  // Debounce notifications
  notifyTimeout = setTimeout(() => {
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
  }, NOTIFY_DEBOUNCE);
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
