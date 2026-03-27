/**
 * Saved Properties Global State Manager
 * Mimics React Context API for vanilla JavaScript
 * Provides global state for saved properties with localStorage persistence
 */

class SavedPropertiesManager {
  constructor() {
    this.state = {
      savedProperties: []
    };
    this.listeners = [];
    this.STORAGE_KEY = 'wenamy_saved_properties';
    this.init();
  }

  // Initialize - load from localStorage
  init() {
    this.loadFromStorage();
    this.notifyListeners();
  }

  // Load saved properties from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.state.savedProperties = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading saved properties:', e);
      this.state.savedProperties = [];
    }
  }

  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state.savedProperties));
    } catch (e) {
      console.error('Error saving properties:', e);
    }
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners of state change
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.state.savedProperties);
    });
  }

  // Save a property
  saveProperty(property) {
    const exists = this.isSaved(property.id);
    
    if (exists) {
      this.removeProperty(property.id);
      this.showNotification('Removed from saved', 'info');
      return false;
    }

    this.state.savedProperties.push({
      ...property,
      savedAt: new Date().toISOString()
    });
    
    this.saveToStorage();
    this.notifyListeners();
    this.showNotification('Property saved!', 'success');
    return true;
  }

  // Remove a property
  removeProperty(propertyId) {
    this.state.savedProperties = this.state.savedProperties.filter(
      p => p.id !== propertyId
    );
    this.saveToStorage();
    this.notifyListeners();
  }

  // Check if property is saved
  isSaved(propertyId) {
    return this.state.savedProperties.some(p => p.id === propertyId);
  }

  // Get all saved properties
  getSavedProperties() {
    return [...this.state.savedProperties];
  }

  // Get count of saved properties
  getSavedCount() {
    return this.state.savedProperties.length;
  }

  // Toggle save/unsave from card element
  toggleFromCard(button) {
    const card = button.closest('.project-luxury-card');
    if (!card) return;

    const property = {
      id: card.dataset.projectId,
      title: card.dataset.projectTitle,
      location: card.dataset.projectLocation,
      price: card.dataset.projectPrice,
      image: card.dataset.projectImage,
      url: card.querySelector('a')?.href || `project-detail.html?id=${card.dataset.projectId}`
    };

    const isNowSaved = this.saveProperty(property);
    this.updateButtonVisualState(button, isNowSaved);
    return isNowSaved;
  }

  // Update button visual state
  updateButtonVisualState(button, isSaved) {
    if (isSaved) {
      button.classList.add('in-basket');
      button.setAttribute('aria-label', 'Remove from saved');
    } else {
      button.classList.remove('in-basket');
      button.setAttribute('aria-label', 'Save property');
    }
  }

  // Update all basket buttons on page
  updateAllButtonStates() {
    document.querySelectorAll('.project-luxury-card').forEach(card => {
      const projectId = card.dataset.projectId;
      const basketBtn = card.querySelector('.project-basket-btn');
      
      if (projectId && basketBtn) {
        this.updateButtonVisualState(basketBtn, this.isSaved(projectId));
      }
    });
  }

  // Toggle heart icon save/unsave
  toggleHeart(button) {
    const card = button.closest('.project-luxury-card');
    if (!card) return;

    const property = {
      id: card.dataset.projectId,
      title: card.dataset.projectTitle,
      location: card.dataset.projectLocation,
      price: card.dataset.projectPrice,
      image: card.dataset.projectImage,
      url: card.querySelector('.project-luxury-cta')?.href || `project-detail.html?id=${card.dataset.projectId}`
    };

    const isSaved = this.isSaved(property.id);
    
    if (isSaved) {
      this.removeProperty(property.id);
      button.classList.remove('saved');
      button.setAttribute('aria-label', 'Save property');
    } else {
      this.saveProperty(property);
      button.classList.add('saved');
      button.setAttribute('aria-label', 'Remove from saved');
    }
  }

  // Update all heart buttons on page
  updateAllHeartStates() {
    document.querySelectorAll('.project-luxury-card').forEach(card => {
      const projectId = card.dataset.projectId;
      const heartBtn = card.querySelector('.project-save-btn');
      
      if (projectId && heartBtn) {
        if (this.isSaved(projectId)) {
          heartBtn.classList.add('saved');
          heartBtn.setAttribute('aria-label', 'Remove from saved');
        } else {
          heartBtn.classList.remove('saved');
          heartBtn.setAttribute('aria-label', 'Save property');
        }
      }
    });
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `saved-property-notification ${type}`;
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
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }

  // Render saved properties to a container
  renderSavedProperties(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const properties = this.getSavedProperties();
    const { emptyMessage = 'No saved properties yet', showRemoveButton = true } = options;

    if (properties.length === 0) {
      container.innerHTML = `
        <div class="saved-properties-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>${emptyMessage}</p>
          <a href="projects.html" class="btn-primary-soft">Browse Properties</a>
        </div>
      `;
      return;
    }

    container.innerHTML = properties.map(property => `
      <div class="saved-property-item" data-property-id="${property.id}">
        <div class="saved-property-image">
          <img src="${property.image}" alt="${property.title}">
        </div>
        <div class="saved-property-info">
          <h4>${property.title}</h4>
          <p class="saved-property-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${property.location}
          </p>
          <p class="saved-property-price">${property.price}</p>
        </div>
        <div class="saved-property-actions">
          <a href="${property.url}" class="btn-view">View</a>
          ${showRemoveButton ? `
            <button class="btn-remove-saved" onclick="savedPropertiesManager.removeProperty('${property.id}')" aria-label="Remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
}

// Create global instance
const savedPropertiesManager = new SavedPropertiesManager();

// Add CSS animations
if (!document.getElementById('saved-properties-styles')) {
  const style = document.createElement('style');
  style.id = 'saved-properties-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .saved-properties-empty {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }
    
    .saved-properties-empty svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    .saved-property-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      margin-bottom: 0.75rem;
      transition: all 0.2s ease;
    }
    
    .saved-property-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    .saved-property-image {
      width: 80px;
      height: 60px;
      border-radius: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .saved-property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .saved-property-info {
      flex: 1;
      min-width: 0;
    }
    
    .saved-property-info h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .saved-property-location {
      font-size: 0.8125rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 0.25rem;
    }
    
    .saved-property-price {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
    }
    
    .saved-property-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }
    
    .btn-view {
      padding: 0.375rem 0.75rem;
      background: #f1f5f9;
      color: #0f172a;
      text-decoration: none;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: center;
      transition: all 0.2s ease;
    }
    
    .btn-view:hover {
      background: #e2e8f0;
    }
    
    .btn-remove-saved {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      margin: 0 auto;
    }
    
    .btn-remove-saved:hover {
      background: #ef4444;
      color: #ffffff;
    }
    
    .btn-remove-saved svg {
      width: 14px;
      height: 14px;
    }
  `;
  document.head.appendChild(style);
}

// Auto-update button states on page load
document.addEventListener('DOMContentLoaded', () => {
  savedPropertiesManager.updateAllButtonStates();
  savedPropertiesManager.updateAllHeartStates();
});
