/**
 * WENAMY Basket / Saved Properties System
 * Pure LocalStorage implementation - No backend required
 */

(function() {
  'use strict';

  // LocalStorage key
  const BASKET_KEY = 'wenamy_basket';

  /**
   * Get basket data from LocalStorage
   * @returns {Array} Array of saved properties
   */
  function getBasket() {
    try {
      const data = localStorage.getItem(BASKET_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading basket:', e);
      return [];
    }
  }

  /**
   * Save basket data to LocalStorage
   * @param {Array} basket - Array of property objects
   */
  function saveBasket(basket) {
    try {
      localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
    } catch (e) {
      console.error('Error saving basket:', e);
    }
  }

  /**
   * Add property to basket
   * @param {Object} property - Property object with id, title, price, image, location
   * @returns {boolean} True if added, false if already exists
   */
  function addToBasket(property) {
    const basket = getBasket();
    
    // Check for duplicates
    if (basket.some(item => item.id === property.id)) {
      return false;
    }
    
    basket.push(property);
    saveBasket(basket);
    updateNavbarCount();
    return true;
  }

  /**
   * Remove property from basket
   * @param {string} id - Property ID
   * @returns {boolean} True if removed, false if not found
   */
  function removeFromBasket(id) {
    const basket = getBasket();
    const index = basket.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    basket.splice(index, 1);
    saveBasket(basket);
    updateNavbarCount();
    return true;
  }

  /**
   * Check if property is in basket
   * @param {string} id - Property ID
   * @returns {boolean}
   */
  function isInBasket(id) {
    const basket = getBasket();
    return basket.some(item => item.id === id);
  }

  /**
   * Toggle property in basket (add if not exists, remove if exists)
   * @param {Object} property - Property object
   * @returns {Object} {added: boolean, removed: boolean}
   */
  function toggleBasket(property) {
    if (isInBasket(property.id)) {
      removeFromBasket(property.id);
      return { added: false, removed: true };
    } else {
      addToBasket(property);
      return { added: true, removed: false };
    }
  }

  /**
   * Clear all items from basket
   */
  function clearBasket() {
    saveBasket([]);
    updateNavbarCount();
  }

  /**
   * Get basket count
   * @returns {number} Number of saved properties
   */
  function getBasketCount() {
    return getBasket().length;
  }

  /**
   * Update navbar basket count badge
   */
  function updateNavbarCount() {
    const count = getBasketCount();
    const badges = document.querySelectorAll('.basket-count');
    
    badges.forEach(badge => {
      badge.textContent = count;
      
      // Add animation class
      badge.classList.remove('basket-count-update');
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('basket-count-update');
      
      // Show/hide badge based on count
      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  }

  /**
   * Sync heart icons with basket state
   * Call this on page load to mark saved properties
   */
  function syncHeartIcons() {
    const basket = getBasket();
    const savedIds = basket.map(item => item.id);
    
    // Find all heart buttons
    const heartButtons = document.querySelectorAll('.project-save-btn');
    
    heartButtons.forEach(btn => {
      const propertyId = btn.dataset.propertyId;
      if (propertyId && savedIds.includes(propertyId)) {
        btn.classList.add('saved');
      } else {
        btn.classList.remove('saved');
      }
    });
  }

  /**
   * Initialize basket system
   * Sets up event delegation for heart icons
   */
  function initBasket() {
    // Update navbar count on all pages
    updateNavbarCount();
    
    // Sync heart icons if on projects page
    if (document.querySelector('.projects-grid')) {
      syncHeartIcons();
      
      // Event delegation for heart clicks
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid) {
        projectsGrid.addEventListener('click', function(e) {
          const heartBtn = e.target.closest('.project-save-btn');
          if (!heartBtn) return;
          
          e.preventDefault();
          e.stopPropagation();
          
          const propertyId = heartBtn.dataset.propertyId;
          if (!propertyId) return;
          
          // Get property data from the card
          const card = heartBtn.closest('.project-luxury-card');
          const property = {
            id: propertyId,
            title: card.querySelector('.project-luxury-name')?.textContent || 'Property',
            price: card.querySelector('.project-luxury-price')?.textContent || '',
            location: card.querySelector('.project-luxury-location')?.textContent || '',
            image: card.querySelector('img')?.src || ''
          };
          
          // Toggle basket
          const result = toggleBasket(property);
          
          // Update UI
          if (result.added) {
            heartBtn.classList.add('saved');
          } else {
            heartBtn.classList.remove('saved');
          }
        });
      }
    }
  }

  // Expose public API
  window.WenamyBasket = {
    getBasket,
    addToBasket,
    removeFromBasket,
    isInBasket,
    toggleBasket,
    clearBasket,
    getBasketCount,
    updateNavbarCount,
    syncHeartIcons,
    init: initBasket
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBasket);
  } else {
    initBasket();
  }
})();
