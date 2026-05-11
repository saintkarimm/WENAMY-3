/**
 * Currency Switcher Module for Wenamy
 * Supports USD, GHS, GBP, and EUR currencies with hardcoded exchange rates
 * Base prices stored in USD, converted to other currencies on display
 */

(function() {
  'use strict';

  // Exchange rate configuration - update monthly
  // Rates are: 1 USD = X Currency
  const EXCHANGE_RATES = {
    USD: 1,
    GHS: 11.01,  // 1 USD = 11.01 GHS (updated April 2026)
    GBP: 0.75,   // 1 USD = 0.75 GBP (1 GBP = 1.33 USD)
    EUR: 0.86    // 1 USD = 0.86 EUR (1 EUR = 1.16 USD)
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
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      flag: '🇬🇧',
      position: 'before'
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      flag: '🇪🇺',
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
      // Always update display to match selected currency
      // HTML defaults to GHS but switcher may show USD
      this.updateDisplay();
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
        let numericValue = parseFloat(match[0].replace(/,/g, ''));
        if (!isNaN(numericValue)) {
          // If price is already in GHS (GH₵ or GHS), convert to USD equivalent
          if (text.includes('GH₵') || text.includes('GHS') || text.includes('₵')) {
            numericValue = numericValue / EXCHANGE_RATES.GHS;
          }
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

      const currencies = Object.values(CURRENCY_CONFIG);
      
      container.innerHTML = `
        <div class="currency-switcher">
          <!-- Desktop: Dual Flag Selector -->
          <div class="currency-switcher-desktop">
            <span class="currency-switcher-label">Choose Currency</span>
            <div class="currency-flags-row">
              ${currencies.map(currency => `
                <button class="currency-flag-btn ${currency.code === this.currentCurrency ? 'active' : ''}" 
                        data-currency="${currency.code}"
                        aria-label="Switch to ${currency.name}"
                        title="${currency.name}">
                  <span class="currency-flag">${currency.flag}</span>
                </button>
              `).join('<div class="currency-flag-divider"></div>')}
            </div>
          </div>
          
          <!-- Mobile: Circular Button -->
          <div class="currency-switcher-mobile">
            <button class="currency-switcher-toggle" 
                    aria-label="Select currency, current: ${CURRENCY_CONFIG[this.currentCurrency].name}"
                    aria-expanded="false"
                    aria-haspopup="menu"
                    title="${CURRENCY_CONFIG[this.currentCurrency].name} (${CURRENCY_CONFIG[this.currentCurrency].code})">
              <span class="currency-flag">${CURRENCY_CONFIG[this.currentCurrency].flag}</span>
              <span class="currency-toggle-text">${CURRENCY_CONFIG[this.currentCurrency].code}</span>
            </button>
            <div class="currency-dropdown" role="menu">
              ${currencies.map(currency => `
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
        </div>
      `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
      const container = document.querySelector('.currency-switcher-container');
      if (!container) return;

      // Desktop: Flag buttons
      const flagButtons = container.querySelectorAll('.currency-flag-btn');
      flagButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const currency = btn.getAttribute('data-currency');
          if (currency !== this.currentCurrency) {
            this.switchCurrency(currency);
          }
        });
      });

      // Mobile: Toggle dropdown
      const toggle = container.querySelector('.currency-switcher-toggle');
      const dropdown = container.querySelector('.currency-dropdown');
      
      if (toggle && dropdown) {
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

        // Keyboard navigation
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
          }
        });
      }

      // Mobile: Currency selection from dropdown
      const options = container.querySelectorAll('.currency-option');
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const currency = option.getAttribute('data-currency');
          this.switchCurrency(currency);
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
          }
          if (dropdown) {
            dropdown.classList.remove('active');
          }
        });
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
        // Skip only if element is no longer attached to the document.
        // Do NOT skip hidden elements — offplan.html hides properties until
        // "Load More" is clicked; those prices must still be converted so
        // they don't flash the original GHS text when revealed.
        if (!document.contains(element)) {
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
      // Format number with commas, keeping decimals when present
      const formattedNumber = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

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
    
    // Initialize floating behavior
    initFloatingCurrencySwitcher();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrencySwitcher);
  } else {
    initCurrencySwitcher();
  }

  // Expose to global scope for manual initialization or debugging
  window.CurrencySwitcher = CurrencySwitcher;

  /**
   * Floating Currency Switcher - Sticks to right side on scroll
   */
  function initFloatingCurrencySwitcher() {
    const container = document.querySelector('.currency-switcher-container');
    if (!container) return;
    
    // Store original position
    const originalOffsetTop = container.offsetTop;
    const scrollThreshold = originalOffsetTop + 100; // Start floating after scrolling 100px past the original position
    
    let isFloating = false;
    let isHidden = false;
    let lastScrollY = 0;
    let scrollTimeout = null;
    
    // Get footer element
    const footer = document.querySelector('footer') || document.querySelector('.footer') || document.querySelector('.page-footer');
    
    // Use CSS will-change for better performance
    container.style.willChange = 'transform, opacity';
    
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Check if footer is in view - ALWAYS check this (don't skip for small scrolls)
      let footerInView = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // Footer is "in view" when its top edge enters the viewport
        footerInView = footerRect.top < windowHeight;
      }
      
      // Handle showing/hiding based on footer visibility
      if (footerInView && !isHidden) {
        container.classList.add('floating-hidden');
        isHidden = true;
      } else if (!footerInView && isHidden) {
        container.classList.remove('floating-hidden');
        isHidden = false;
      }
      
      // Skip floating mode transition for tiny scroll changes (reduces jitter)
      if (Math.abs(scrollY - lastScrollY) < 5) {
        return;
      }
      lastScrollY = scrollY;
      
      // Handle floating mode activation
      if (scrollY > scrollThreshold && !isFloating) {
        // Switch to floating mode
        container.classList.add('floating');
        isFloating = true;
        
        // Use CSS transition instead of manual animation for smoother effect
        container.style.opacity = '1';
        container.style.transform = isMobile() ? 'translateX(0)' : 'translateY(-50%) translateX(0)';
        
      } else if (scrollY <= scrollThreshold && isFloating) {
        // Return to normal mode
        container.classList.remove('floating');
        container.classList.remove('floating-hidden');
        isFloating = false;
        isHidden = false;
        container.style.opacity = '';
        container.style.transform = '';
      }
    }
    
    function isMobile() {
      return window.innerWidth <= 768;
    }
    
    // Debounced scroll handler for smooth performance
    function onScroll() {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(handleScroll);
    }
    
    // Passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (isFloating) {
          container.classList.remove('floating');
          isFloating = false;
          handleScroll();
        }
      }, 250);
    });
    
    // Initial check
    handleScroll();
    
    // Clean up will-change after initial animation
    setTimeout(() => {
      container.style.willChange = 'auto';
    }, 1000);
  }

})();
