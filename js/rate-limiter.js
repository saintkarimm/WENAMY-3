/**
 * Rate Limiter Module
 * Prevents rapid repeated actions and spam
 * Lightweight and memory-efficient
 */

// Action tracking map
const actionTracker = new Map();

// Default cooldowns in milliseconds
const DEFAULT_COOLDOWNS = {
  saveProperty: 1000,      // 1 second between save/unsave
  removeProperty: 1000,
  updateProfile: 2000,     // 2 seconds between profile updates
  login: 3000,             // 3 seconds between login attempts
  signup: 5000,            // 5 seconds between signup attempts
  inquiry: 5000            // 5 seconds between inquiries
};

// Maximum attempts before temporary block
const MAX_ATTEMPTS = {
  login: 5,
  signup: 3,
  inquiry: 10
};

// Block durations in milliseconds
const BLOCK_DURATION = 60000; // 1 minute

/**
 * Check if action is allowed
 * @param {string} actionId - Unique action identifier (e.g., 'saveProperty:123')
 * @param {string} actionType - Type of action for cooldown lookup
 * @returns {Object} - { allowed: boolean, remainingMs: number, message?: string }
 */
export const checkRateLimit = (actionId, actionType) => {
  const now = Date.now();
  const cooldown = DEFAULT_COOLDOWNS[actionType] || 1000;
  
  const tracker = actionTracker.get(actionId);
  
  // Check if currently blocked
  if (tracker?.blockedUntil && now < tracker.blockedUntil) {
    const remainingMs = tracker.blockedUntil - now;
    return {
      allowed: false,
      remainingMs,
      message: `Too many attempts. Please try again in ${Math.ceil(remainingMs / 1000)}s.`
    };
  }
  
  // Check cooldown
  if (tracker?.lastAttempt) {
    const elapsed = now - tracker.lastAttempt;
    if (elapsed < cooldown) {
      return {
        allowed: false,
        remainingMs: cooldown - elapsed,
        message: `Please wait ${Math.ceil((cooldown - elapsed) / 1000)}s before trying again.`
      };
    }
  }
  
  return { allowed: true, remainingMs: 0 };
};

/**
 * Record an action attempt
 * @param {string} actionId - Unique action identifier
 * @param {string} actionType - Type of action
 * @param {boolean} success - Whether the action succeeded
 */
export const recordAttempt = (actionId, actionType, success = true) => {
  const now = Date.now();
  const maxAttempts = MAX_ATTEMPTS[actionType] || Infinity;
  
  let tracker = actionTracker.get(actionId);
  
  if (!tracker) {
    tracker = {
      attempts: 0,
      lastAttempt: now,
      blockedUntil: null
    };
  }
  
  tracker.lastAttempt = now;
  
  if (!success) {
    tracker.attempts++;
    
    // Block if too many failed attempts
    if (tracker.attempts >= maxAttempts) {
      tracker.blockedUntil = now + BLOCK_DURATION;
      tracker.attempts = 0; // Reset after blocking
    }
  } else {
    // Reset on success
    tracker.attempts = 0;
    tracker.blockedUntil = null;
  }
  
  actionTracker.set(actionId, tracker);
  
  // Cleanup old entries periodically
  cleanupOldEntries();
};

/**
 * Execute function with rate limiting
 * @param {Function} fn - Function to execute
 * @param {string} actionId - Action identifier
 * @param {string} actionType - Action type
 * @returns {Promise} - Result of function or throws rate limit error
 */
export const withRateLimit = async (fn, actionId, actionType) => {
  const check = checkRateLimit(actionId, actionType);
  
  if (!check.allowed) {
    const error = new Error(check.message);
    error.code = 'rate-limited';
    error.remainingMs = check.remainingMs;
    throw error;
  }
  
  try {
    const result = await fn();
    recordAttempt(actionId, actionType, true);
    return result;
  } catch (error) {
    recordAttempt(actionId, actionType, false);
    throw error;
  }
};

// Cleanup tracking
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Cleanup old tracker entries to prevent memory leaks
 */
const cleanupOldEntries = () => {
  const now = Date.now();
  
  // Only cleanup periodically
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }
  
  lastCleanup = now;
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  for (const [key, tracker] of actionTracker.entries()) {
    // Remove if old and not blocked
    if (!tracker.blockedUntil && now - tracker.lastAttempt > maxAge) {
      actionTracker.delete(key);
    }
    // Remove if block has expired and old
    else if (tracker.blockedUntil && now > tracker.blockedUntil && now - tracker.blockedUntil > maxAge) {
      actionTracker.delete(key);
    }
  }
};

/**
 * Reset rate limit for specific action
 * @param {string} actionId - Action identifier
 */
export const resetRateLimit = (actionId) => {
  actionTracker.delete(actionId);
};

/**
 * Get current rate limit status
 * @param {string} actionId - Action identifier
 * @returns {Object|null} - Current status
 */
export const getRateLimitStatus = (actionId) => {
  return actionTracker.get(actionId) || null;
};
