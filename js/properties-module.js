/**
 * Properties Module
 * Handles property saving functionality on projects/offplan pages
 */

import { saveProperty, removeSavedProperty, getSavedProperties } from './user.js';
import { subscribeToAuth } from './auth-state.js';

// Global state
let currentUser = null;
let savedPropertyIds = new Set();
let isLoading = false;

// Track pending operations to prevent duplicate writes
const pendingOperations = new Set();

/**
 * Initialize properties page
 */
export const initProperties = () => {
  subscribeToAuth(async (state) => {
    currentUser = state.user;
    
    if (state.isReady) {
      if (currentUser) {
        await loadSavedPropertyIds();
      } else {
        savedPropertyIds.clear();
        updateHeartButtons();
      }
    }
  });
  
  // Setup event delegation for heart buttons
  setupHeartButtonListeners();
};

/**
 * Load saved property IDs
 */
const loadSavedPropertyIds = async () => {
  if (!currentUser) return;
  
  try {
    const savedProperties = await getSavedProperties(currentUser.uid);
    savedPropertyIds = new Set(savedProperties.map(p => p.id));
    updateBasketCount(savedProperties.length);
  } catch (error) {
    console.error('Error loading saved properties:', error);
  }
};

/**
 * Update heart button states
 */
const updateHeartButtons = () => {
  document.querySelectorAll('.project-save-btn').forEach(btn => {
    const card = btn.closest('.project-luxury-card');
    if (!card) return;
    
    const propertyId = card.dataset.projectId;
    const isSaved = savedPropertyIds.has(propertyId);
    
    if (isSaved) {
      btn.classList.add('saved');
      btn.setAttribute('aria-label', 'Remove from saved');
    } else {
      btn.classList.remove('saved');
      btn.setAttribute('aria-label', 'Save property');
    }
  });
};

/**
 * Setup heart button event listeners
 */
const setupHeartButtonListeners = () => {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.project-save-btn');
    if (!btn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      showNotification('Please sign in to save properties', 'info');
      window.location.href = 'account.html';
      return;
    }
    
    const card = btn.closest('.project-luxury-card');
    if (!card) return;
    
    const propertyId = card.dataset.projectId;
    
    // Prevent duplicate operations
    if (pendingOperations.has(propertyId)) return;
    pendingOperations.add(propertyId);
    
    // Lock button
    btn.disabled = true;
    btn.classList.add('loading');
    
    const property = {
      id: propertyId,
      title: card.dataset.projectTitle,
      location: card.dataset.projectLocation,
      price: card.dataset.projectPrice,
      image: card.dataset.projectImage,
      url: card.querySelector('.project-luxury-cta')?.href || `project-detail.html?id=${propertyId}`
    };
    
    try {
      if (savedPropertyIds.has(property.id)) {
        // Remove from saved
        await removeSavedProperty(currentUser.uid, property.id);
        savedPropertyIds.delete(property.id);
        btn.classList.remove('saved');
        btn.setAttribute('aria-label', 'Save property');
        showNotification('Removed from saved properties', 'info');
      } else {
        // Add to saved
        await saveProperty(currentUser.uid, property);
        savedPropertyIds.add(property.id);
        btn.classList.add('saved');
        btn.setAttribute('aria-label', 'Remove from saved');
        showNotification('Property saved!', 'success');
      }
      
      updateBasketCount(savedPropertyIds.size);
    } catch (error) {
      console.error('Error saving property:', error);
      if (error.message === 'Property already saved') {
        showNotification('Property already saved', 'info');
      } else {
        showNotification('Error saving property', 'error');
      }
    } finally {
      // Unlock button
      pendingOperations.delete(propertyId);
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
};

/**
 * Update basket count
 * @param {number} count - Number of saved properties
 */
const updateBasketCount = (count) => {
  const countElements = document.querySelectorAll('#basketCount, #mobileBasketCount');
  
  countElements.forEach(el => {
    if (el) {
      el.textContent = count > 0 ? count : '';
      el.style.display = count > 0 ? 'flex' : 'none';
    }
  });
};

/**
 * Show notification
 * @param {string} message - Message to show
 * @param {string} type - Notification type (success, error, info)
 */
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `property-notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};
