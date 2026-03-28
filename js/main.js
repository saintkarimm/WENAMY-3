/* Main Entry Point - Initialize all functionality */

(function() {
  'use strict';

  /**
   * Initialize all modules
   */
  function init() {
    console.log('WENAMY website initialized');
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any additional functionality here
    initLazyLoading();
    initImageOptimization();
  }

  /**
   * Lazy load images when they enter viewport
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /**
   * Optimize images based on device pixel ratio
   */
  function initImageOptimization() {
    const dpr = window.devicePixelRatio || 1;
    
    // Add DPR class to body for CSS targeting
    if (dpr >= 2) {
      document.body.classList.add('dpr-2x');
    }
    if (dpr >= 3) {
      document.body.classList.add('dpr-3x');
    }
  }

  /**
   * Handle visibility change (pause animations when tab is hidden)
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      document.body.classList.add('tab-hidden');
    } else {
      document.body.classList.remove('tab-hidden');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle visibility change
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Handle online/offline status
  window.addEventListener('online', () => {
    document.body.classList.remove('offline');
  });

  window.addEventListener('offline', () => {
    document.body.classList.add('offline');
  });
})();
