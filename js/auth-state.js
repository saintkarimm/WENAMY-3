/**
 * Global Auth State Manager
 * Single source of truth for authentication state
 * Uses subscription pattern for efficient updates
 */

import { observeAuth } from './auth.js';
import { getUserProfile } from './user.js';

// Global state
let currentUser = null;
let userProfile = null;
let isAuthReady = false;
let isLoading = true;

// Subscription registry
const subscribers = new Set();

// Cache for user data to prevent repeated Firestore calls
const cache = {
  userProfile: null,
  savedProperties: null,
  lastFetched: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize global auth state
 * Call this once at app startup
 */
export const initAuthState = () => {
  observeAuth(async (user) => {
    isLoading = true;
    currentUser = user;
    
    if (user) {
      try {
        // Check cache first
        if (cache.userProfile && cache.lastFetched && (Date.now() - cache.lastFetched) < CACHE_DURATION) {
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
        }
      } catch (error) {
        console.error('Auth state: Error fetching profile:', error);
        userProfile = null;
      }
    } else {
      userProfile = null;
      // Clear cache on logout
      cache.userProfile = null;
      cache.savedProperties = null;
      cache.lastFetched = null;
    }
    
    isAuthReady = true;
    isLoading = false;
    
    // Notify all subscribers
    notifySubscribers();
  });
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
 */
export const invalidateCache = () => {
  cache.userProfile = null;
  cache.savedProperties = null;
  cache.lastFetched = null;
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
