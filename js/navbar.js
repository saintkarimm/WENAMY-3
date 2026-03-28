/**
 * Navbar Module
 * Simplified version - no auth logic
 */

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
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
