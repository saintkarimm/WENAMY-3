/**
 * Navbar Module
 * Simplified version - no auth logic
 * Enhanced with premium glassmorphism scroll effects
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
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
