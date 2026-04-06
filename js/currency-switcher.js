/**
 * Currency Switcher Module for Wenamy
 * Supports USD and GHS currencies with hardcoded exchange rates
 * Base prices stored in USD, converted to GHS on display
 */

(function() {
  'use strict';

  // Exchange rate configuration - update monthly
  const EXCHANGE_RATES = {
    USD: 1,
    GHS: 11.01  // 1 USD = 11.01 GHS (updated April 2026)
  };

  const CURRENCY_CONFIG = {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      flag: '🇺🇸',
      position: 'before'
    },
    GHS: {
      code: 'GHS',
      symbol: 'GH₵',
      name: 'Ghana Cedi',
      flag: '🇬🇭',
      position: 'before'
    }
  };

  // Storage key for localStorage
  const STORAGE_KEY = 'wenamy_currency_preference';

  /**
   * Currency Switcher Class
   */
  class CurrencySwitcher {
    constructor() {
      this.currentCurrency = this.getStoredCurrency() || 'USD';
      this.priceElements = [];
      this.isInitialized = false;
    }

    /**
     * Initialize the currency switcher
     */
    init() {
      if (this.isInitialized) return;
      this.isInitialized = true;
      
      this.findPriceElements();
      this.renderSwitcher();
      this.bindEvents();
      // Don't update display on init - let the original prices show
      // Only update when user explicitly changes currency
      if (this.currentCurrency !== 'USD') {
        this.updateDisplay();
      }
    }

    /**
     * Get stored currency preference
     */
    getStoredCurrency() {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    }

    /**
     * Store currency preference
     */
    storeCurrency(currency) {
      try {
        localStorage.setItem(STORAGE_KEY, currency);
      } catch (e) {
        // Silent fail for private browsing mode
      }
    }

    /**
     * Find all price elements on the page
     */
    findPriceElements() {
      // Find elements with data-usd attribute (new format)
      // Only select elements that are actually price displays
      this.priceElements = Array.from(document.querySelectorAll(
        '.project-luxury-price[data-usd], .offplan-luxury-price[data-usd], .price-value[data-usd]'
      ));
      
      // Also find elements with price-related classes that don't have data-usd yet
      const legacyPriceSelectors = [
        '.project-luxury-price',
        '.offplan-luxury-price',
        '.price-value'
      ];
      
      legacyPriceSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!el.hasAttribute('data-usd')) {
            this.migrateLegacyPrice(el);
          }
        });
      });

      // Re-query after migration
      this.priceElements = Array.from(document.querySelectorAll(
        '.project-luxury-price[data-usd], .offplan-luxury-price[data-usd], .price-value[data-usd]'
      ));
    }

    /**
     * Migrate legacy price text to data-usd format
     */
    migrateLegacyPrice(element) {
      const text = element.textContent.trim();
      
      // Skip "Contact for Pricing" and similar non-numeric prices
      if (text.toLowerCase().includes('contact') || 
          text.toLowerCase().includes('pricing') ||
          text.toLowerCase().includes('available')) {
        element.setAttribute('data-usd', 'contact');
        return;
      }

      // Extract numeric value from price text
      const match = text.match(/[\d,]+\.?\d*/);
      if (match) {
        const numericValue = parseFloat(match[0].replace(/,/g, ''));
        if (!isNaN(numericValue)) {
          element.setAttribute('data-usd', numericValue);
          // Store original text format for reference
          element.setAttribute('data-original-format', text);
        }
      }
    }

    /**
     * Render the currency switcher UI
     */
    renderSwitcher() {
      const container = document.querySelector('.currency-switcher-container');
      if (!container) return;

      const config = CURRENCY_CONFIG[this.currentCurrency];
      
      container.innerHTML = `
        <div class="currency-switcher">
          <button class="currency-switcher-toggle" 
                  aria-label="Select currency, current: ${config.name}"
                  aria-expanded="false"
                  aria-haspopup="menu"
                  title="${config.name} (${config.code})">
            <span class="currency-flag">${config.flag}</span>
          </button>
          <div class="currency-dropdown" role="menu">
            ${Object.values(CURRENCY_CONFIG).map(currency => `
              <button class="currency-option ${currency.code === this.currentCurrency ? 'active' : ''}" 
                      data-currency="${currency.code}" 
                      role="menuitem"
                      aria-label="Switch to ${currency.name}">
                <span class="currency-flag">${currency.flag}</span>
                <span class="currency-name">${currency.name}</span>
                <span class="currency-code-small">${currency.code}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
      const container = document.querySelector('.currency-switcher-container');
      if (!container) return;

      const toggle = container.querySelector('.currency-switcher-toggle');
      const dropdown = container.querySelector('.currency-dropdown');
      const options = container.querySelectorAll('.currency-option');

      // Toggle dropdown
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        dropdown.classList.toggle('active');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('active');
        }
      });

      // Currency selection
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const currency = option.getAttribute('data-currency');
          this.switchCurrency(currency);
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('active');
        });
      });

      // Keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    }

    /**
     * Switch to a different currency
     */
    switchCurrency(currency) {
      if (currency === this.currentCurrency) return;
      
      this.currentCurrency = currency;
      this.storeCurrency(currency);
      this.renderSwitcher();
      this.bindEvents();
      // Re-find elements to catch any dynamically added content
      this.findPriceElements();
      this.updateDisplay();
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('currencyChanged', {
        detail: { currency: currency }
      }));
    }

    /**
     * Update all price displays
     */
    updateDisplay() {
      const rate = EXCHANGE_RATES[this.currentCurrency];
      const config = CURRENCY_CONFIG[this.currentCurrency];

      this.priceElements.forEach(element => {
        // Skip if element is not in document or is hidden
        if (!document.contains(element) || element.offsetParent === null) {
          return;
        }
        
        const usdValue = element.getAttribute('data-usd');
        
        // Skip non-numeric prices
        if (usdValue === 'contact' || usdValue === 'null' || usdValue === '' || !usdValue) {
          return;
        }

        const numericValue = parseFloat(usdValue);
        if (isNaN(numericValue)) return;

        // Calculate converted value
        const convertedValue = numericValue * rate;

        // Format the price
        const formattedPrice = this.formatPrice(convertedValue, config);

        // Update the price
        this.animatePriceChange(element, formattedPrice);
      });
    }

    /**
     * Format price with appropriate separators
     */
    formatPrice(value, config) {
      // Determine if we need decimals
      const hasDecimals = value % 1 !== 0;
      
      // Format number with commas
      const formattedNumber = hasDecimals 
        ? value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : value.toLocaleString('en-US');

      // Add symbol
      if (config.position === 'before') {
        return `${config.symbol}${formattedNumber}`;
      }
      return `${formattedNumber} ${config.symbol}`;
    }

    /**
     * Animate price change
     */
    animatePriceChange(element, newPrice) {
      // Simply update the text content without animation to avoid layout issues
      element.textContent = newPrice;
    }

    /**
     * Get current exchange rate
     */
    getExchangeRate(currency) {
      return EXCHANGE_RATES[currency] || 1;
    }

    /**
     * Convert a specific USD amount to current currency
     */
    convert(amount) {
      const rate = EXCHANGE_RATES[this.currentCurrency];
      const config = CURRENCY_CONFIG[this.currentCurrency];
      const convertedValue = amount * rate;
      return this.formatPrice(convertedValue, config);
    }

    /**
     * Refresh prices - useful after dynamic content is loaded
     */
    refresh() {
      this.findPriceElements();
      if (this.currentCurrency !== 'USD') {
        this.updateDisplay();
      }
    }
  }

  // Initialize on DOM ready
  function initCurrencySwitcher() {
    if (!window.currencySwitcher) {
      window.currencySwitcher = new CurrencySwitcher();
    }
    window.currencySwitcher.init();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrencySwitcher);
  } else {
    initCurrencySwitcher();
  }

  // Expose to global scope for manual initialization or debugging
  window.CurrencySwitcher = CurrencySwitcher;

})();
