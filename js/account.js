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

  // Setup mobile sidebar toggle
  setupMobileSidebar() {
    const sidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('accountSidebar');

    if (sidebarToggle && sidebar && sidebarOverlay) {
      // Toggle sidebar on button click
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
      });

      // Close sidebar when clicking overlay
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      });

      // Close sidebar when clicking a nav item (on mobile)
      const navItems = sidebar.querySelectorAll('.account-nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
          }
        });
      });
    }
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

  // Handle login
  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Demo login - accept any credentials
    this.currentUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
      phone: '',
      location: '',
      preference: '',
      savedProperties: [],
      inquiries: [],
      joinedAt: new Date().toISOString()
    };

    this.saveUserToStorage();
    this.updateUI();
    this.showNotification('Welcome back!', 'success');
  }

  // Handle signup
  handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    // Create new user
    this.currentUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone,
      location: '',
      preference: '',
      savedProperties: [],
      inquiries: [],
      joinedAt: new Date().toISOString()
    };

    this.saveUserToStorage();
    this.updateUI();
    this.showNotification('Account created successfully!', 'success');
  }

  // Handle logout
  logout() {
    this.currentUser = null;
    this.saveUserToStorage();
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

    // Special handling for auth view
    const authView = document.getElementById('authView');
    if (authView) {
      if (this.currentUser) {
        authView.style.display = 'none';
        const activeTab = document.getElementById(`tab-${tabName}`);
        if (activeTab) activeTab.style.display = 'block';
      } else {
        authView.style.display = 'block';
        tabs.forEach(tab => tab.style.display = 'none');
      }
    }

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

    if (this.currentUser) {
      // User is logged in - show account section, hide auth section
      if (userName) userName.textContent = this.currentUser.name;
      if (userEmail) userEmail.textContent = this.currentUser.email;
      if (logoutBtn) logoutBtn.style.display = 'flex';
      if (authSplitSection) authSplitSection.style.display = 'none';
      if (accountSection) accountSection.style.display = 'block';
      if (dashboardTab) dashboardTab.style.display = 'block';
      if (sidebar) sidebar.style.display = 'block';

      // Update stats
      this.updateDashboardStats();
    } else {
      // User is logged out - show auth section, hide account section
      if (userName) userName.textContent = 'Welcome';
      if (userEmail) userEmail.textContent = 'Sign in to access your account';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (authSplitSection) authSplitSection.style.display = 'flex';
      if (accountSection) accountSection.style.display = 'none';
      if (sidebar) sidebar.style.display = 'none';
      
      const tabs = document.querySelectorAll('.account-tab');
      tabs.forEach(tab => tab.style.display = 'none');
    }
  }

  // Update dashboard statistics
  updateDashboardStats() {
    const savedCount = document.getElementById('savedCount');
    const inquiryCount = document.getElementById('inquiryCount');
    const welcomeName = document.getElementById('welcomeName');

    if (savedCount && this.currentUser) {
      savedCount.textContent = this.currentUser.savedProperties?.length || 0;
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
  removeSavedProperty(propertyId) {
    if (!this.currentUser) return;

    this.currentUser.savedProperties = this.currentUser.savedProperties.filter(
      p => p.id !== propertyId
    );
    this.saveUserToStorage();
    this.updateDashboardStats();
    this.renderSavedProperties();
    this.showNotification('Property removed', 'info');
  }

  // Check if property is saved
  isPropertySaved(propertyId) {
    if (!this.currentUser) return false;
    return this.currentUser.savedProperties.some(p => p.id === propertyId);
  }

  // Render saved properties
  renderSavedProperties() {
    const grid = document.getElementById('savedGrid');
    if (!grid || !this.currentUser) return;

    const properties = this.currentUser.savedProperties;

    if (properties.length === 0) {
      grid.innerHTML = `
        <div class="saved-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <h3>No saved properties yet</h3>
          <p>Browse our properties and tap the heart icon to save them here</p>
          <a href="projects.html" class="auth-submit" style="display:inline-flex;text-decoration:none;width:auto;padding:0.875rem 2rem;">Browse Properties</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = properties.map(prop => `
      <div class="saved-property-card">
        <div class="saved-property-img">
          <img src="${prop.image}" alt="${prop.title}">
          <button class="saved-property-remove" onclick="accountManager.removeSavedProperty('${prop.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="saved-property-info">
          <h4>${prop.title}</h4>
          <p class="saved-property-location">${prop.location}</p>
          <p class="saved-property-price">${prop.price}</p>
        </div>
      </div>
    `).join('');
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

  // Handle profile update
  handleProfileUpdate(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    this.currentUser.name = document.getElementById('profileName').value;
    this.currentUser.phone = document.getElementById('profilePhone').value;
    this.currentUser.location = document.getElementById('profileLocation').value;
    this.currentUser.preference = document.getElementById('profilePreference').value;

    this.saveUserToStorage();
    this.updateUI();
    this.showNotification('Profile updated!', 'success');
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