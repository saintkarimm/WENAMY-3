/**
 * Navbar Module
 * Simplified version - no auth logic
 * Enhanced with premium glassmorphism scroll effects and dynamic contrast
 */

/**
 * Initialize navbar scroll effect for glassmorphism enhancement
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    // Add scrolled class when user scrolls past threshold
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
  
  // Initial check
  updateNavbar();
}

/**
 * Initialize dynamic navbar contrast based on background
 * Detects light/dark backgrounds and switches navbar colors
 */
function initNavbarDynamicContrast() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  // Check if we're on a category page with dark hero
  const heroSection = document.querySelector('.category-hero');
  if (!heroSection) return;
  
  let ticking = false;
  let isDarkMode = true;
  
  function updateContrast() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Switch to light mode when scrolled past hero (into light content area)
    // Switch to dark mode when in hero area
    const shouldBeDark = scrollY < (heroHeight - 100);
    
    if (shouldBeDark !== isDarkMode) {
      isDarkMode = shouldBeDark;
      
      if (isDarkMode) {
        navbar.classList.add('navbar-dark');
        navbar.classList.remove('navbar-light');
      } else {
        navbar.classList.add('navbar-light');
        navbar.classList.remove('navbar-dark');
      }
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateContrast);
      ticking = true;
    }
  }, { passive: true });
  
  // Initial check - start with dark mode on category pages
  navbar.classList.add('navbar-dark');
  updateContrast();
}

/**
 * Initialize navbar
 * Shows static Sign In button only
 */
function initNavbar() {
  const desktopAuthContainer = document.getElementById('navbarUserDisplay');
  const mobileAuthContainer = document.getElementById('mobileUserDisplay');
  const desktopSignInBtn = document.getElementById('navbarSignInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  const mobileMenuSignInBtn = document.getElementById('mobileMenuSignInBtn');
  
  // Always show sign in buttons
  if (desktopSignInBtn) desktopSignInBtn.classList.add('show');
  if (mobileSignInBtn) mobileSignInBtn.classList.add('show');
  if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'block';
  
  // Hide user displays
  if (desktopAuthContainer) desktopAuthContainer.classList.remove('show');
  if (mobileAuthContainer) mobileAuthContainer.classList.remove('show');
  
  // Initialize scroll effects
  initNavbarScroll();
  
  // Initialize dynamic contrast for category pages
  initNavbarDynamicContrast();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
