/* Navigation Functionality */

(function() {
  'use strict';

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-mobile-links a');

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    
    const isOpen = mobileToggle.classList.contains('active');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Handle mobile menu link clicks
   */
  function handleLinkClick(e) {
    // Don't close menu if this is a dropdown toggle
    if (this.classList.contains('nav-mobile-dropdown-toggle')) {
      return;
    }
    
    const href = this.getAttribute('href');
    
    // Close menu
    closeMobileMenu();
    
    // Smooth scroll to section
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        setTimeout(() => {
          const navHeight = document.getElementById('nav')?.offsetHeight || 44;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, 300); // Wait for menu close animation
      }
    }
  }

  /**
   * Close menu when clicking outside
   */
  function handleOutsideClick(e) {
    if (!mobileMenu || !mobileToggle) return;
    
    if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  }

  /**
   * Handle escape key
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  }

  // Initialize event listeners
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Mobile toggle click
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Mobile menu link clicks
    navLinks.forEach((link) => {
      link.addEventListener('click', handleLinkClick);
    });

    // Mobile dropdown toggle
    const mobileDropdownToggles = document.querySelectorAll('.nav-mobile-dropdown-toggle');
    mobileDropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', handleOutsideClick);

    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close menu on window resize (if going to desktop)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 1023) {
          closeMobileMenu();
        }
      }, 150);
    }, { passive: true });

    // Header scroll effect
    const header = document.getElementById('nav');
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, 10);
    }, { passive: true });
  }
})();
