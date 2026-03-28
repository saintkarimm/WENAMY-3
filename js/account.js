/**
 * Wenamy Account System
 * Handles authentication, saved properties, and inquiries
 */

class AccountManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.loadUserFromStorage();
    this.setupEventListeners();
    this.updateUI();
  }

  // Load user from localStorage
  loadUserFromStorage() {
    const userData = localStorage.getItem('wenamy_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Save user to localStorage
  saveUserToStorage() {
    if (this.currentUser) {
      localStorage.setItem('wenamy_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('wenamy_user');
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // New auth switch buttons
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
      switchToSignup.addEventListener('click', () => this.switchAuthView('signup'));
    }
    if (switchToLogin) {
      switchToLogin.addEventListener('click', () => this.switchAuthView('login'));
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Account navigation
    const navItems = document.querySelectorAll('.account-nav-item[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', () => this.switchTab(item.dataset.tab));
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Mobile sidebar toggle
    this.setupMobileSidebar();
  }

  // Setup mobile sidebar toggle with swipe gestures
  setupMobileSidebar() {
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('accountSidebar');
    const edgeIndicator = document.getElementById('sidebarEdgeIndicator');
    const swipeHint = document.getElementById('sidebarSwipeHint');

    if (!sidebar) return;

    // Toggle sidebar on edge indicator click
    if (edgeIndicator) {
      edgeIndicator.addEventListener('click', () => this.toggleSidebar(true));
    }

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));
    }

    // Close sidebar when clicking a nav item (on mobile)
    const navItems = sidebar.querySelectorAll('.account-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          this.toggleSidebar(false);
        }
      });
    });

    // Handle window resize to show/hide edge indicator
    window.addEventListener('resize', () => {
      if (this.currentUser) {
        if (edgeIndicator) {
          edgeIndicator.style.display = window.innerWidth <= 1024 ? 'flex' : 'none';
        }
        if (swipeHint) {
          swipeHint.style.display = window.innerWidth <= 1024 ? 'block' : 'none';
        }
        // Close sidebar when resizing to desktop
        if (window.innerWidth > 1024) {
          this.toggleSidebar(false);
        }
      }
    });

    // Setup swipe gestures
    this.setupSwipeGestures(sidebar, edgeIndicator);
  }

  // Toggle sidebar open/close
  toggleSidebar(open) {
    const sidebar = document.getElementById('accountSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const edgeIndicator = document.getElementById('sidebarEdgeIndicator');

    if (!sidebar) return;

    if (open) {
      sidebar.classList.add('active');
      if (sidebarOverlay) sidebarOverlay.classList.add('active');
      if (edgeIndicator) edgeIndicator.classList.add('hidden');
    } else {
      sidebar.classList.remove('active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      if (edgeIndicator) edgeIndicator.classList.remove('hidden');
    }
    
    // Reset any inline transform styles from swiping
    sidebar.style.transform = '';
    if (sidebarOverlay) sidebarOverlay.style.opacity = '';
  }

  // Setup swipe gestures for sidebar
  setupSwipeGestures(sidebar, edgeIndicator) {
    let touchStartX = 0;
    let touchCurrentX = 0;
    let isSwiping = false;
    let sidebarWidth = 260;

    // Touch start - detect swipe from edge
    document.addEventListener('touchstart', (e) => {
      if (window.innerWidth > 1024) return;
      
      touchStartX = e.touches[0].clientX;
      const sidebarIsOpen = sidebar.classList.contains('active');
      
      // Allow swipe from left edge (0-30px) to open
      // Allow swipe anywhere when sidebar is open to close
      if ((!sidebarIsOpen && touchStartX < 30) || sidebarIsOpen) {
        isSwiping = true;
        sidebar.classList.add('swiping');
        sidebarWidth = sidebar.offsetWidth || 260;
      }
    }, { passive: true });

    // Touch move - follow finger
    document.addEventListener('touchmove', (e) => {
      if (!isSwiping || window.innerWidth > 1024) return;
      
      touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      const sidebarIsOpen = sidebar.classList.contains('active');
      
      if (sidebarIsOpen) {
        // Swiping to close - move sidebar left
        const translateX = Math.min(0, deltaX);
        sidebar.style.transform = `translateX(${translateX}px)`;
        
        // Adjust overlay opacity
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
          const opacity = Math.max(0, 0.5 + (translateX / sidebarWidth) * 0.5);
          overlay.style.opacity = opacity;
        }
      } else {
        // Swiping to open - move sidebar from left
        const translateX = Math.min(0, -sidebarWidth + deltaX);
        if (deltaX > 0) {
          sidebar.style.transform = `translateX(${translateX}px)`;
          
          // Show overlay
          const overlay = document.getElementById('sidebarOverlay');
          if (overlay) {
            overlay.style.display = 'block';
            const opacity = Math.min(0.5, (deltaX / sidebarWidth) * 0.5);
            overlay.style.opacity = opacity;
          }
        }
      }
    }, { passive: true });

    // Touch end - complete or cancel swipe
    document.addEventListener('touchend', () => {
      if (!isSwiping || window.innerWidth > 1024) return;
      
      isSwiping = false;
      sidebar.classList.remove('swiping');
      
      const deltaX = touchCurrentX - touchStartX;
      const sidebarIsOpen = sidebar.classList.contains('active');
      const threshold = sidebarWidth * 0.3; // 30% threshold
      
      // Only process if there was actual movement
      if (Math.abs(deltaX) < 5) {
        // Just a tap, reset styles
        sidebar.style.transform = '';
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.style.opacity = '';
        return;
      }
      
      if (sidebarIsOpen) {
        // Close if swiped left enough
        if (deltaX < -threshold) {
          this.toggleSidebar(false);
        } else {
          this.toggleSidebar(true);
        }
      } else {
        // Open if swiped right enough
        if (deltaX > threshold) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    });

    // Mouse drag support for desktop testing
    let isDragging = false;
    
    document.addEventListener('mousedown', (e) => {
      if (window.innerWidth > 1024) return;
      
      const sidebarIsOpen = sidebar.classList.contains('active');
      const clickX = e.clientX;
      
      if ((!sidebarIsOpen && clickX < 30) || (sidebarIsOpen && clickX < sidebarWidth)) {
        isDragging = true;
        touchStartX = clickX;
        sidebar.classList.add('swiping');
        sidebarWidth = sidebar.offsetWidth || 260;
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || window.innerWidth > 1024) return;
      
      touchCurrentX = e.clientX;
      const deltaX = touchCurrentX - touchStartX;
      const sidebarIsOpen = sidebar.classList.contains('active');
      
      if (sidebarIsOpen) {
        const translateX = Math.min(0, deltaX);
        sidebar.style.transform = `translateX(${translateX}px)`;
      } else {
        const translateX = Math.min(0, -sidebarWidth + deltaX);
        if (deltaX > 0) {
          sidebar.style.transform = `translateX(${translateX}px)`;
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging || window.innerWidth > 1024) return;
      
      isDragging = false;
      sidebar.classList.remove('swiping');
      
      const deltaX = touchCurrentX - touchStartX;
      const sidebarIsOpen = sidebar.classList.contains('active');
      const threshold = sidebarWidth * 0.3;
      
      // Only process if there was actual movement
      if (Math.abs(deltaX) < 5) {
        sidebar.style.transform = '';
        return;
      }
      
      if (sidebarIsOpen && deltaX < -threshold) {
        this.toggleSidebar(false);
      } else if (!sidebarIsOpen && deltaX > threshold) {
        this.toggleSidebar(true);
      } else {
        this.toggleSidebar(sidebarIsOpen);
      }
    });
  }

  // Switch between login and signup views (new split screen)
  switchAuthView(view) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    if (view === 'signup') {
      if (loginForm) loginForm.style.display = 'none';
      if (signupForm) signupForm.style.display = 'flex';
      if (authTitle) authTitle.textContent = 'Create an account';
      if (authSubtitle) authSubtitle.textContent = 'Join Wenamy to save properties and track your inquiries.';
    } else {
      if (loginForm) loginForm.style.display = 'flex';
      if (signupForm) signupForm.style.display = 'none';
      if (authTitle) authTitle.textContent = 'Welcome back';
      if (authSubtitle) authSubtitle.textContent = 'Access your saved properties, notes, and inquiries anytime, anywhere — and keep everything in one place.';
    }
  }

  // Switch between login and signup tabs
  switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    tabs.forEach(t => t.classList.toggle('active', t.dataset.auth === tab));

    if (tab === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    }
  }

  // Handle login with Firebase
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Use Firebase Auth
    if (typeof firebaseAuthManager !== 'undefined') {
      const result = await firebaseAuthManager.login(email, password);
      
      if (result.success) {
        this.currentUser = result.user;
        this.updateUI();
        this.showNotification('Welcome back!', 'success');
      } else {
        this.showNotification(result.error, 'error');
      }
    } else {
      this.showNotification('Authentication service not available', 'error');
    }
  }

  // Handle signup with Firebase
  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    // Use Firebase Auth
    if (typeof firebaseAuthManager !== 'undefined') {
      const result = await firebaseAuthManager.signup(email, password, { name, phone });
      
      if (result.success) {
        this.currentUser = result.user;
        this.updateUI();
        this.showNotification('Account created successfully!', 'success');
      } else {
        this.showNotification(result.error, 'error');
      }
    } else {
      this.showNotification('Authentication service not available', 'error');
    }
  }

  // Handle logout with Firebase
  async logout() {
    // Use Firebase Auth
    if (typeof firebaseAuthManager !== 'undefined') {
      await firebaseAuthManager.logout();
    }
    
    this.currentUser = null;
    this.updateUI();
    this.switchTab('dashboard');
    this.showNotification('Logged out successfully', 'info');
  }

  // Switch between account tabs
  switchTab(tabName) {
    // Update nav items
    const navItems = document.querySelectorAll('.account-nav-item[data-tab]');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabName);
    });

    // Show/hide tabs
    const tabs = document.querySelectorAll('.account-tab');
    tabs.forEach(tab => {
      tab.style.display = tab.id === `tab-${tabName}` ? 'block' : 'none';
    });

    // Load tab-specific data
    if (tabName === 'saved') this.renderSavedProperties();
    if (tabName === 'inquiries') this.renderInquiries();
    if (tabName === 'profile') this.loadProfileData();
  }

  // Update UI based on auth state
  updateUI() {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const authSplitSection = document.getElementById('authSplitSection');
    const accountSection = document.getElementById('accountSection');
    const dashboardTab = document.getElementById('tab-dashboard');
    const sidebar = document.getElementById('accountSidebar');
    const edgeIndicator = document.getElementById('sidebarEdgeIndicator');
    const swipeHint = document.getElementById('sidebarSwipeHint');

    if (this.currentUser) {
      // User is logged in - show account section, hide auth section
      if (userName) userName.textContent = this.currentUser.name;
      if (userEmail) userEmail.textContent = this.currentUser.email;
      if (logoutBtn) logoutBtn.style.display = 'flex';
      if (authSplitSection) authSplitSection.style.display = 'none';
      if (accountSection) {
        accountSection.style.display = 'block';
        accountSection.classList.add('active');
      }
      if (dashboardTab) dashboardTab.style.display = 'block';
      if (sidebar) sidebar.style.display = 'block';
      // Only show edge indicator on mobile (<= 1024px)
      if (edgeIndicator) {
        edgeIndicator.style.display = window.innerWidth <= 1024 ? 'flex' : 'none';
      }
      if (swipeHint) {
        swipeHint.style.display = window.innerWidth <= 1024 ? 'block' : 'none';
      }

      // Update stats
      this.updateDashboardStats();
    } else {
      // User is logged out - show auth section, hide account section
      if (userName) userName.textContent = 'Welcome';
      if (userEmail) userEmail.textContent = 'Sign in to access your account';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (authSplitSection) authSplitSection.style.display = 'flex';
      if (accountSection) {
        accountSection.style.display = 'none';
        accountSection.classList.remove('active');
      }
      if (sidebar) sidebar.style.display = 'none';
      if (edgeIndicator) edgeIndicator.style.display = 'none';
      if (swipeHint) swipeHint.style.display = 'none';
      
      const tabs = document.querySelectorAll('.account-tab');
      tabs.forEach(tab => tab.style.display = 'none');
    }
  }

  // Update dashboard statistics
  updateDashboardStats() {
    const savedCount = document.getElementById('savedCount');
    const inquiryCount = document.getElementById('inquiryCount');
    const welcomeName = document.getElementById('welcomeName');

    // Use global savedPropertiesManager for saved count
    if (savedCount) {
      savedCount.textContent = savedPropertiesManager.getSavedCount();
    }
    if (inquiryCount && this.currentUser) {
      inquiryCount.textContent = this.currentUser.inquiries?.length || 0;
    }
    if (welcomeName && this.currentUser) {
      welcomeName.textContent = this.currentUser.name || 'there';
    }
  }

  // Save a property
  saveProperty(property) {
    if (!this.currentUser) {
      this.showNotification('Please sign in to save properties', 'error');
      window.location.href = 'account.html';
      return false;
    }

    const exists = this.currentUser.savedProperties.find(p => p.id === property.id);
    if (exists) {
      this.showNotification('Property already saved', 'info');
      return false;
    }

    this.currentUser.savedProperties.push({
      ...property,
      savedAt: new Date().toISOString()
    });

    this.saveUserToStorage();
    this.updateDashboardStats();
    this.showNotification('Property saved!', 'success');
    return true;
  }

  // Remove a saved property
  async removeSavedProperty(propertyId) {
    if (!this.currentUser) return;

    // Use savedPropertiesManager which syncs with Firebase
    await savedPropertiesManager.removeProperty(propertyId);
    
    // Update local user data
    this.currentUser.savedProperties = savedPropertiesManager.getSavedProperties();
    
    this.updateDashboardStats();
    this.renderSavedProperties();
    this.showNotification('Property removed', 'info');
  }

  // Check if property is saved
  isPropertySaved(propertyId) {
    if (!this.currentUser) return false;
    return this.currentUser.savedProperties.some(p => p.id === propertyId);
  }

  // Render saved properties using global state
  renderSavedProperties() {
    const grid = document.getElementById('savedGrid');
    if (!grid) return;

    // Use global savedPropertiesManager to render
    savedPropertiesManager.renderSavedProperties('savedGrid', {
      emptyMessage: 'Browse our properties and tap the basket icon to save them here',
      showRemoveButton: true
    });
  }

  // Add an inquiry
  addInquiry(inquiry) {
    if (!this.currentUser) {
      this.showNotification('Please sign in to track inquiries', 'error');
      return false;
    }

    this.currentUser.inquiries.push({
      ...inquiry,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    this.saveUserToStorage();
    this.updateDashboardStats();
    this.showNotification('Inquiry sent!', 'success');
    return true;
  }

  // Render inquiries
  renderInquiries() {
    const list = document.getElementById('inquiriesList');
    if (!list || !this.currentUser) return;

    const inquiries = this.currentUser.inquiries;

    if (inquiries.length === 0) {
      list.innerHTML = `
        <div class="saved-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h3>No inquiries yet</h3>
          <p>When you contact us about a property, it will appear here</p>
          <a href="contact.html" class="auth-submit" style="display:inline-flex;text-decoration:none;width:auto;padding:0.875rem 2rem;">Make an Inquiry</a>
        </div>
      `;
      return;
    }

    list.innerHTML = inquiries.map(inq => `
      <div class="inquiry-card">
        <div class="inquiry-info">
          <h4>${inq.property || 'General Inquiry'}</h4>
          <p>${new Date(inq.createdAt).toLocaleDateString()} - ${inq.message?.substring(0, 50)}...</p>
        </div>
        <span class="inquiry-status ${inq.status}">${inq.status}</span>
      </div>
    `).join('');
  }

  // Load profile data
  loadProfileData() {
    if (!this.currentUser) return;

    document.getElementById('profileName').value = this.currentUser.name || '';
    document.getElementById('profileEmail').value = this.currentUser.email || '';
    document.getElementById('profilePhone').value = this.currentUser.phone || '';
    document.getElementById('profileLocation').value = this.currentUser.location || '';
    document.getElementById('profilePreference').value = this.currentUser.preference || '';
  }

  // Handle profile update with Firebase
  async handleProfileUpdate(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    const updates = {
      name: document.getElementById('profileName').value,
      phone: document.getElementById('profilePhone').value,
      location: document.getElementById('profileLocation').value,
      preference: document.getElementById('profilePreference').value
    };

    // Use Firebase to update profile
    if (typeof firebaseAuthManager !== 'undefined') {
      const result = await firebaseAuthManager.updateProfile(updates);
      
      if (result.success) {
        this.currentUser = result.user;
        this.updateUI();
        this.showNotification('Profile updated!', 'success');
      } else {
        this.showNotification(result.error, 'error');
      }
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `account-notification ${type}`;
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

// Password toggle function
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

// Initialize account manager
const accountManager = new AccountManager();
window.accountManager = accountManager;

// Add CSS animation for notifications
const style = document.createElement('style');
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

// Show swipe hint for 2 seconds on page load (mobile only, when logged in)
document.addEventListener('DOMContentLoaded', () => {
  const swipeHint = document.getElementById('sidebarSwipeHint');
  const edgeIndicator = document.getElementById('sidebarEdgeIndicator');
  const accountSection = document.getElementById('accountSection');
  
  if (swipeHint && edgeIndicator && accountSection && accountSection.classList.contains('active') && window.innerWidth <= 1024) {
    swipeHint.classList.add('show');
    setTimeout(() => {
      swipeHint.classList.remove('show');
    }, 2000);
  }
});

// Subscribe to saved properties changes for real-time dashboard updates
if (typeof savedPropertiesManager !== 'undefined') {
  savedPropertiesManager.subscribe(() => {
    // Update dashboard stats when saved properties change
    if (window.accountManager) {
      window.accountManager.updateDashboardStats();
      
      // Re-render saved properties tab if visible
      const savedTab = document.getElementById('tab-saved');
      if (savedTab && savedTab.style.display !== 'none') {
        window.accountManager.renderSavedProperties();
      }
    }
  });
}