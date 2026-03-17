/* Utility Functions */

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if an element is in viewport
 * @param {Element} element - The element to check
 * @param {number} offset - Optional offset (default: 0)
 * @returns {boolean} - Whether element is in viewport
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight - offset) &&
    rect.bottom >= offset
  );
}

/**
 * Get the current scroll position
 * @returns {number} - Current scroll position
 */
function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Smooth scroll to an element
 * @param {string} target - The target selector or element
 * @param {number} offset - Optional offset from top
 */
function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  }
}

/**
 * Add class when element enters viewport
 * @param {Element} element - The element to observe
 * @param {string} className - The class to add
 * @param {number} threshold - Intersection threshold (0-1)
 */
function addClassOnIntersect(element, className, threshold = 0.1) {
  if (!element) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );
  
  observer.observe(element);
}

/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Check if device is touch-enabled
 * @returns {boolean} - Whether device supports touch
 */
function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} - Whether reduced motion is preferred
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Add event listener with passive option
 * @param {Element} element - The element to attach listener to
 * @param {string} event - The event type
 * @param {Function} handler - The event handler
 * @param {boolean} passive - Whether to use passive listener
 */
function addPassiveEventListener(element, event, handler, passive = true) {
  element.addEventListener(event, handler, passive ? { passive: true } : false);
}

/**
 * Remove class from all elements matching selector
 * @param {string} selector - The selector
 * @param {string} className - The class to remove
 */
function removeClassFromAll(selector, className) {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.remove(className);
  });
}

/**
 * Add class to element and remove from siblings
 * @param {Element} element - The element to activate
 * @param {string} className - The class to toggle
 * @param {string} siblingSelector - Selector for siblings
 */
function activateElement(element, className, siblingSelector) {
  if (!element) return;
  
  const parent = element.parentElement;
  if (parent) {
    parent.querySelectorAll(siblingSelector).forEach((el) => {
      el.classList.remove(className);
    });
  }
  element.classList.add(className);
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport,
    getScrollPosition,
    smoothScrollTo,
    addClassOnIntersect,
    formatNumber,
    isTouchDevice,
    prefersReducedMotion,
    addPassiveEventListener,
    removeClassFromAll,
    activateElement
  };
}
