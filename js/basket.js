/**
 * Wenamy Basket/Cart System
 * Allows users to add properties to a basket for later viewing
 */

class BasketManager {
  constructor() {
    this.basket = [];
    this.init();
  }

  init() {
    this.loadBasketFromStorage();
    this.updateBasketCount();
  }

  // Load basket from localStorage
  loadBasketFromStorage() {
    const basketData = localStorage.getItem('wenamy_basket');
    if (basketData) {
      this.basket = JSON.parse(basketData);
    }
  }

  // Save basket to localStorage
  saveBasketToStorage() {
    localStorage.setItem('wenamy_basket', JSON.stringify(this.basket));
  }

  // Add property to basket
  addToBasket(property) {
    // Check if property already exists in basket
    const exists = this.basket.find(item => item.id === property.id);
    if (exists) {
      this.showNotification('Property already in basket', 'info');
      return false;
    }

    this.basket.push({
      ...property,
      addedAt: new Date().toISOString()
    });

    this.saveBasketToStorage();
    this.updateBasketCount();
    this.showNotification('Property added to basket!', 'success');
    return true;
  }

  // Remove property from basket
  removeFromBasket(propertyId) {
    this.basket = this.basket.filter(item => item.id !== propertyId);
    this.saveBasketToStorage();
    this.updateBasketCount();
    this.renderBasketItems();
    this.showNotification('Property removed from basket', 'info');
  }

  // Check if property is in basket
  isInBasket(propertyId) {
    return this.basket.some(item => item.id === propertyId);
  }

  // Get basket count
  getBasketCount() {
    return this.basket.length;
  }

  // Update basket count display in navbar
  updateBasketCount() {
    const countElements = document.querySelectorAll('#basketCount');
    const mobileCountElements = document.querySelectorAll('#mobileBasketCount');
    const count = this.getBasketCount();
    
    countElements.forEach(el => {
      el.textContent = count > 0 ? count : '';
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    
    mobileCountElements.forEach(el => {
      el.textContent = count > 0 ? count : '';
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Get all basket items
  getBasketItems() {
    return this.basket;
  }

  // Clear basket
  clearBasket() {
    this.basket = [];
    this.saveBasketToStorage();
    this.updateBasketCount();
  }

  // Render basket items on basket page
  renderBasketItems() {
    const container = document.getElementById('basketItems');
    if (!container) return;

    if (this.basket.length === 0) {
      container.innerHTML = `
        <div class="basket-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
      return;
    }

    container.innerHTML = this.basket.map(item => `
      <div class="basket-item">
        <div class="basket-item-img">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="basket-item-info">
          <h4>${item.title}</h4>
          <p class="basket-item-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${item.location}
          </p>
          <p class="basket-item-price">${item.price}</p>
        </div>
        <div class="basket-item-actions">
          <a href="${item.url || 'project-detail.html?id=' + item.id}" class="btn-secondary">View Details</a>
          <button class="btn-remove" onclick="basketManager.removeFromBasket('${item.id}')" aria-label="Remove from basket">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `basket-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Add property to basket from card element
BasketManager.prototype.addToBasketFromCard = function(button) {
  const card = button.closest('.project-luxury-card');
  if (!card) return;
  
  const property = {
    id: card.dataset.projectId,
    title: card.dataset.projectTitle,
    location: card.dataset.projectLocation,
    price: card.dataset.projectPrice,
    image: card.dataset.projectImage,
    url: card.querySelector('a')?.href || 'project-detail.html?id=' + card.dataset.projectId
  };
  
  const added = this.addToBasket(property);
  if (added) {
    button.classList.add('in-basket');
    button.setAttribute('aria-label', 'Added to basket');
  }
};

// Check and update basket button states on page load
BasketManager.prototype.updateBasketButtonStates = function() {
  document.querySelectorAll('.project-luxury-card').forEach(card => {
    const projectId = card.dataset.projectId;
    const basketBtn = card.querySelector('.project-basket-btn');
    
    if (projectId && basketBtn && this.isInBasket(projectId)) {
      basketBtn.classList.add('in-basket');
      basketBtn.setAttribute('aria-label', 'Added to basket');
    }
  });
};

// Initialize basket manager
const basketManager = new BasketManager();

// Update button states after initialization
document.addEventListener('DOMContentLoaded', () => {
  basketManager.updateBasketButtonStates();
});

// Add CSS animation for notifications
if (!document.getElementById('basket-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'basket-notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
