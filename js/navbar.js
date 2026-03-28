/**
 * Navbar Module
 * Handles dynamic navbar rendering based on auth state
 */

import { observeAuth, logout } from "./auth.js";
import { getUserProfile, createUserProfile } from "./user.js";

// Global state
let currentUser = null;
let userProfile = null;

/**
 * Initialize navbar auth state observer
 * Call this on every page
 */
export const initNavbar = () => {
  // Show loading state initially
  showNavbarLoadingState();
  
  observeAuth(async (user) => {
    currentUser = user;
    
    if (user) {
      // Fetch user profile from Firestore
      try {
        userProfile = await getUserProfile(user.uid);
        // Create profile if missing
        if (!userProfile) {
          userProfile = await createUserProfile(user, { name: user.displayName || '' });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        userProfile = null;
      }
    } else {
      userProfile = null;
    }
    
    renderNavbar();
  });
};

/**
 * Show loading state before auth is determined
 */
const showNavbarLoadingState = () => {
  const desktopSignInBtn = document.getElementById('navbarSignInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  const mobileMenuSignInBtn = document.getElementById('mobileMenuSignInBtn');
  const desktopAuthContainer = document.getElementById('navbarUserDisplay');
  const mobileAuthContainer = document.getElementById('mobileUserDisplay');
  
  // Hide everything until auth state is determined
  if (desktopSignInBtn) desktopSignInBtn.classList.remove('show');
  if (mobileSignInBtn) mobileSignInBtn.classList.remove('show');
  if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'none';
  if (desktopAuthContainer) desktopAuthContainer.classList.remove('show');
  if (mobileAuthContainer) mobileAuthContainer.classList.remove('show');
};

/**
 * Render navbar based on auth state
 */
const renderNavbar = () => {
  const desktopAuthContainer = document.getElementById('navbarUserDisplay');
  const mobileAuthContainer = document.getElementById('mobileUserDisplay');
  const desktopSignInBtn = document.getElementById('navbarSignInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  const mobileMenuSignInBtn = document.getElementById('mobileMenuSignInBtn');
  
  if (currentUser) {
    // User is logged in
    const displayName = userProfile?.name || currentUser.displayName || currentUser.email.split('@')[0];
    const initials = getInitials(displayName);
    
    // Hide sign in buttons
    if (desktopSignInBtn) desktopSignInBtn.classList.remove('show');
    if (mobileSignInBtn) mobileSignInBtn.classList.remove('show');
    if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'none';
    
    // Show user display (desktop)
    if (desktopAuthContainer) {
      desktopAuthContainer.classList.add('show');
      desktopAuthContainer.innerHTML = `
        <div class="navbar-user-trigger" onclick="toggleUserDropdown(event)">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0a101d&color=fff&size=128" 
               alt="${displayName}" class="navbar-user-avatar">
          <span class="navbar-user-name">${displayName}</span>
          <svg class="navbar-user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="navbar-user-dropdown" id="userDropdown">
          <a href="account.html" class="dropdown-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          <a href="account.html?tab=profile" class="dropdown-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-item" onclick="handleLogout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      `;
    }
    
    // Show user display (mobile) - initials only
    if (mobileAuthContainer) {
      mobileAuthContainer.classList.add('show');
      mobileAuthContainer.innerHTML = `
        <a href="account.html" class="navbar-user-trigger mobile-trigger">
          <span class="navbar-user-initials">${initials}</span>
        </a>
      `;
    }
    
  } else {
    // User is logged out
    if (desktopSignInBtn) desktopSignInBtn.classList.add('show');
    if (mobileSignInBtn) mobileSignInBtn.classList.add('show');
    if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'block';
    if (desktopAuthContainer) desktopAuthContainer.classList.remove('show');
    if (mobileAuthContainer) mobileAuthContainer.classList.remove('show');
  }
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

/**
 * Toggle user dropdown
 * @param {Event} event - Click event
 */
window.toggleUserDropdown = (event) => {
  event.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
};

/**
 * Handle logout
 */
window.handleLogout = async () => {
  try {
    await logout();
    closeUserDropdown();
    // Redirect to home or reload
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Close user dropdown
 */
const closeUserDropdown = () => {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userDisplay = document.getElementById('navbarUserDisplay');
  if (userDisplay && !userDisplay.contains(e.target)) {
    closeUserDropdown();
  }
});

// Export for use in other modules
export { currentUser, userProfile };
