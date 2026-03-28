/**
 * Global Authentication System for Wenamy
 * Centralized auth state with persistent localStorage
 * Provides dynamic navbar rendering across all pages
 */

class AuthManager {
  constructor() {
    // Use same storage key as account.js for sync
    this.STORAGE_KEY = 'wenamy_user';
    this.currentUser = null;
    this.listeners = [];
    this.init();
  }

  // Initialize - load user from storage and setup listeners
  init() {
    this.loadUserFromStorage();
    this.setupNavbarListener();
    
    // Update navbar on page load - use multiple timing strategies
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateNavbar();
      });
    } else {
      // DOM already loaded
      this.updateNavbar();
    }
    
    // Also update after a short delay to ensure all scripts have run
    setTimeout(() => {
      this.updateNavbar();
    }, 100);
  }

  // Load user from localStorage
  loadUserFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading auth user:', e);
      this.currentUser = null;
    }
  }

  // Save user to localStorage
  saveUserToStorage() {
    try {
      if (this.currentUser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving auth user:', e);
    }
  }

  // Subscribe to auth state changes
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.currentUser);
    });
    
    // Dispatch custom event for cross-page communication
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { user: this.currentUser, isAuthenticated: this.isAuthenticated() }
    }));
  }

  // Login user
  login(userData) {
    this.currentUser = {
      id: userData.id || Date.now().toString(),
      name: userData.name || userData.email?.split('@')[0] || 'User',
      email: userData.email,
      avatar: userData.avatar || null,
      phone: userData.phone || '',
      token: userData.token || 'demo-token-' + Date.now(),
      loggedInAt: new Date().toISOString()
    };
    
    this.saveUserToStorage();
    this.notifyListeners();
    this.updateNavbar();
    
    return this.currentUser;
  }

  // Logout user
  logout() {
    this.currentUser = null;
    this.saveUserToStorage();
    this.notifyListeners();
    this.updateNavbar();
    
    // Close any open dropdowns
    this.closeDropdown();
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user name
  getUserName() {
    return this.currentUser?.name || '';
  }

  // Get user email
  getUserEmail() {
    return this.currentUser?.email || '';
  }

  // Get user avatar (or generate initials)
  getUserAvatar() {
    if (this.currentUser?.avatar) {
      return this.currentUser.avatar;
    }
    // Generate initials avatar
    const name = this.getUserName();
    if (name) {
      const initials = this.getInitials(name);
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0a101d&color=fff&size=128`;
    }
    return null;
  }

  // Get initials from name
  getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Setup storage event listener for cross-tab sync
  setupNavbarListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) {
        this.loadUserFromStorage();
        this.updateNavbar();
        this.notifyListeners();
      }
    });
  }

  // Update navbar UI based on auth state
  updateNavbar() {
    const signInBtn = document.getElementById('navbarSignInBtn');
    const userDisplay = document.getElementById('navbarUserDisplay');
    const mobileSignInBtn = document.getElementById('mobileSignInBtn');
    const mobileUserDisplay = document.getElementById('mobileUserDisplay');
    const mobileMenuSignInBtn = document.getElementById('mobileMenuSignInBtn');

    if (this.isAuthenticated()) {
      // User is logged in - show user display, hide sign in buttons
      if (signInBtn) signInBtn.classList.remove('show');
      if (mobileSignInBtn) mobileSignInBtn.classList.remove('show');
      if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'none';
      
      if (userDisplay) {
        userDisplay.classList.add('show');
        this.renderUserDisplay(userDisplay, false);
      }
      if (mobileUserDisplay) {
        mobileUserDisplay.classList.add('show');
        this.renderUserDisplay(mobileUserDisplay, true);
      }
    } else {
      // User is logged out - show sign in button, hide user displays
      if (signInBtn) signInBtn.classList.add('show');
      if (mobileSignInBtn) mobileSignInBtn.classList.add('show');
      if (mobileMenuSignInBtn) mobileMenuSignInBtn.style.display = 'block';
      if (userDisplay) userDisplay.classList.remove('show');
      if (mobileUserDisplay) mobileUserDisplay.classList.remove('show');
    }
  }

  // Render user display element
  renderUserDisplay(container, isMobile) {
    const name = this.getUserName();
    const avatar = this.getUserAvatar();
    
    // For mobile, show initials only to save space
    const displayText = isMobile ? this.getInitials(name) : name;
    
    container.innerHTML = `
      <div class="navbar-user-trigger${isMobile ? ' mobile-trigger' : ''}" onclick="authManager.toggleDropdown(event)">
        ${!isMobile && avatar ? `<img src="${avatar}" alt="${name}" class="navbar-user-avatar">` : ''}
        ${isMobile ? `<span class="navbar-user-initials">${displayText}</span>` : `<span class="navbar-user-name">${displayText}</span>`}
        ${!isMobile ? `<svg class="navbar-user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>` : ''}
      </div>
      <div class="navbar-user-dropdown" id="${isMobile ? 'mobileUserDropdown' : 'userDropdown'}">
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
        <button class="dropdown-item logout-item" onclick="authManager.logout(); authManager.closeDropdown();">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    `;
  }

  // Toggle dropdown menu
  toggleDropdown(event) {
    event.stopPropagation();
    const isMobile = window.innerWidth <= 1024;
    const dropdownId = isMobile ? 'mobileUserDropdown' : 'userDropdown';
    const dropdown = document.getElementById(dropdownId);
    
    if (dropdown) {
      const isShowing = dropdown.classList.contains('show');
      
      // Close all dropdowns first
      this.closeDropdown();
      
      // Toggle current dropdown
      if (!isShowing) {
        dropdown.classList.add('show');
        // Add click listener with delay to prevent immediate close
        setTimeout(() => {
          document.addEventListener('click', this.handleOutsideClick);
        }, 0);
      }
    }
  }

  // Close dropdown
  closeDropdown() {
    const dropdowns = document.querySelectorAll('.navbar-user-dropdown');
    dropdowns.forEach(d => d.classList.remove('show'));
    document.removeEventListener('click', this.handleOutsideClick);
  }

  // Handle click outside dropdown
  handleOutsideClick = (event) => {
    const userDisplay = document.getElementById('navbarUserDisplay');
    const mobileUserDisplay = document.getElementById('mobileUserDisplay');
    
    if ((!userDisplay || !userDisplay.contains(event.target)) && 
        (!mobileUserDisplay || !mobileUserDisplay.contains(event.target))) {
      this.closeDropdown();
    }
  }
}

// Create global instance
const authManager = new AuthManager();

// Expose to window for global access
window.authManager = authManager;
window.getCurrentUser = () => authManager.getCurrentUser();
window.isAuthenticated = () => authManager.isAuthenticated();
window.logout = () => authManager.logout();
