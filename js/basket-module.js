/**
 * Basket Module
 * Handles saved properties display and management
 * Optimized for performance and cost efficiency
 */

import { getSavedProperties, removeSavedProperty } from './user.js';
import { subscribeToAuth } from './auth-state.js';
import { withRateLimit } from './rate-limiter.js';

// Global state
let currentUser = null;
let savedProperties = [];
let isLoading = false;
let unsubscribeAuth = null;

/**
 * Initialize basket page
 * Prevents duplicate initializations
 */
export const initBasket = () => {
  // Prevent duplicate initialization
  if (unsubscribeAuth) {
    return;
  }
  
  // Show skeleton loading state
  renderSkeleton();
  
  unsubscribeAuth = subscribeToAuth(async (state) => {
    currentUser = state.user;
    
    if (state.isReady) {
      if (currentUser) {
        await loadSavedProperties();
      } else {
        savedProperties = [];
        renderEmptyBasket();
      }
    }
  });
};

/**
 * Cleanup basket module
 * Call when leaving page
 */
export const cleanupBasket = () => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
  }
};

/**
 * Load saved properties from Firestore
 */
const loadSavedProperties = async () => {
  if (!currentUser || isLoading) return;
  
  isLoading = true;
  
  try {
    savedProperties = await getSavedProperties(currentUser.uid);
    renderBasketItems();
    updateBasketCount();
  } catch (error) {
    console.error('Error loading saved properties:', error);
    showError('Failed to load saved properties');
  } finally {
    isLoading = false;
  }
};

/**
 * Render basket items
 */
const renderBasketItems = () => {
  const container = document.getElementById('basketItems');
  if (!container) return;
  
  if (savedProperties.length === 0) {
    renderEmptyBasket();
    return;
  }
  
  container.innerHTML = savedProperties.map(property => `
    <div class="basket-item" data-property-id="${property.id}">
      <div class="basket-item-img">
        <img src="${property.image}" alt="${property.title}">
      </div>
      <div class="basket-item-info">
        <h3>${property.title}</h3>
        <p class="basket-item-location">${property.location}</p>
        <p class="basket-item-price">${property.price}</p>
      </div>
      <div class="basket-item-actions">
        <a href="${property.url}" class="btn-view">View</a>
        <button class="btn-remove" onclick="removeFromBasket('${property.id}')" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
};

/**
 * Render empty basket state
 */
const renderEmptyBasket = () => {
  const container = document.getElementById('basketItems');
  if (!container) return;
  
  container.innerHTML = `
    <div class="basket-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h3>Your basket is empty</h3>
      <p>Browse our properties and add them to your basket for later</p>
      <a href="projects.html" class="btn-primary-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Browse Properties
      </a>
    </div>
  `;
};

// Track pending operations to prevent duplicates
const pendingOperations = new Set();

/**
 * Render skeleton loading state
 */
const renderSkeleton = () => {
  const container = document.getElementById('basketItems');
  if (!container) return;
  
  container.innerHTML = `
    <div class="basket-skeleton">
      ${Array(3).fill(0).map(() => `
        <div class="skeleton-item">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-price"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

/**
 * Remove property from basket
 * @param {string} propertyId - Property ID to remove
 */
window.removeFromBasket = async (propertyId) => {
  if (!currentUser || pendingOperations.has(propertyId)) return;
  
  // Lock button
  pendingOperations.add(propertyId);
  const btn = document.querySelector(`button[onclick="removeFromBasket('${propertyId}')"]`);
  if (btn) {
    btn.disabled = true;
    btn.classList.add('loading');
  }
  
  try {
    // Apply rate limiting
    await withRateLimit(async () => {
      await removeSavedProperty(currentUser.uid, propertyId);
    }, `removeProperty:${currentUser.uid}:${propertyId}`, 'removeProperty');
    
    await loadSavedProperties();
  } catch (error) {
    console.error('Error removing property:', error);
    showError('Failed to remove property');
  } finally {
    // Unlock button
    pendingOperations.delete(propertyId);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }
};

/**
 * Update basket count in navbar
 */
const updateBasketCount = () => {
  const countElements = document.querySelectorAll('#basketCount, #mobileBasketCount');
  const count = savedProperties.length;
  
  countElements.forEach(el => {
    if (el) {
      el.textContent = count > 0 ? count : '';
      el.style.display = count > 0 ? 'flex' : 'none';
    }
  });
};

/**
 * Show error message
 * @param {string} message - Error message
 */
const showError = (message) => {
  const container = document.getElementById('basketItems');
  if (container) {
    container.innerHTML = `
      <div class="basket-error">
        <p>${message}</p>
        <button onclick="location.reload()" class="btn-primary-soft">Retry</button>
      </div>
    `;
  }
};
