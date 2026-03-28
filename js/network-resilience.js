/**
 * Network Resilience Module
 * Handles retries, offline states, and network errors
 */

// Network state tracking
let isOnline = navigator.onLine;
let retryQueue = [];

/**
 * Check if device is online
 * @returns {boolean}
 */
export const checkOnline = () => isOnline;

/**
 * Wait for connection to return
 * @param {number} timeout - Max wait time in ms
 * @returns {Promise<boolean>}
 */
export const waitForConnection = (timeout = 30000) => {
  return new Promise((resolve) => {
    if (isOnline) {
      resolve(true);
      return;
    }
    
    const checkOnline = () => {
      if (navigator.onLine) {
        resolve(true);
        cleanup();
      }
    };
    
    const timeoutId = setTimeout(() => {
      resolve(false);
      cleanup();
    }, timeout);
    
    const cleanup = () => {
      window.removeEventListener('online', checkOnline);
      clearTimeout(timeoutId);
    };
    
    window.addEventListener('online', checkOnline);
  });
};

/**
 * Execute function with retry logic
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @returns {Promise}
 */
export const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    onRetry = null,
    retryableErrors = ['network-request-failed', 'unavailable', 'deadline-exceeded']
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt
      if (attempt === maxRetries) break;
      
      // Check if error is retryable
      const errorCode = error.code || error.message;
      const isRetryable = retryableErrors.some(e => 
        errorCode?.toLowerCase().includes(e.toLowerCase())
      );
      
      if (!isRetryable && !isNetworkError(error)) {
        throw error; // Non-retryable error
      }
      
      // Calculate exponential backoff delay
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      if (onRetry) {
        onRetry(attempt + 1, maxRetries, error);
      }
      
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * Check if error is a network error
 * @param {Error} error
 * @returns {boolean}
 */
const isNetworkError = (error) => {
  const networkErrors = [
    'network-request-failed',
    'offline',
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted'
  ];
  
  const errorCode = error.code?.toLowerCase() || '';
  const errorMessage = error.message?.toLowerCase() || '';
  
  return networkErrors.some(e => 
    errorCode.includes(e) || errorMessage.includes(e)
  );
};

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Queue operation for when online
 * @param {Function} operation - Function to queue
 * @param {string} id - Unique operation ID
 */
export const queueWhenOnline = (operation, id) => {
  // Remove existing operation with same ID
  retryQueue = retryQueue.filter(op => op.id !== id);
  
  retryQueue.push({
    id,
    operation,
    timestamp: Date.now()
  });
  
  // Try to process queue
  processQueue();
};

/**
 * Process queued operations
 */
const processQueue = async () => {
  if (!isOnline || retryQueue.length === 0) return;
  
  const operations = [...retryQueue];
  retryQueue = [];
  
  for (const { operation, id } of operations) {
    try {
      await operation();
    } catch (error) {
      console.error(`Queued operation ${id} failed:`, error);
      // Re-queue if it's a network error
      if (isNetworkError(error)) {
        retryQueue.push({ id, operation, timestamp: Date.now() });
      }
    }
  }
};

/**
 * Show network status notification
 * @param {string} message - Message to show
 * @param {string} type - 'online' | 'offline' | 'error'
 */
export const showNetworkStatus = (message, type = 'info') => {
  // Remove existing notification
  const existing = document.getElementById('network-status');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'network-status';
  notification.className = `network-status ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds (except offline)
  if (type !== 'offline') {
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Listen for online/offline events
window.addEventListener('online', () => {
  isOnline = true;
  showNetworkStatus('Back online', 'online');
  processQueue();
});

window.addEventListener('offline', () => {
  isOnline = false;
  showNetworkStatus('You are offline', 'offline');
});
