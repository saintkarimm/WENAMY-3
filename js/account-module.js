/**
 * Account Module
 * Handles account page functionality with Firebase
 */

import { signUp, signIn, logout, getAuthErrorMessage } from './auth.js';
import { createUserProfile, updateUserProfile, getSavedProperties, getInquiries } from './user.js';
import { subscribeToAuth, invalidateCache } from './auth-state.js';

// Global state
let currentUser = null;
let userData = null;

/**
 * Initialize account page
 * Uses global auth state manager
 */
export const initAccount = () => {
  setupEventListeners();
  
  // Subscribe to global auth state
  subscribeToAuth((state) => {
    currentUser = state.user;
    userData = state.profile;
    
    if (state.isReady) {
      if (currentUser) {
        updateUI();
      } else {
        showAuthSection();
      }
    }
  });
};

/**
 * Setup all event listeners
 */
const setupEventListeners = () => {
  // Auth switch buttons
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  
  if (switchToSignup) {
    switchToSignup.addEventListener('click', () => switchAuthView('signup'));
  }
  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => switchAuthView('login'));
  }
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Profile form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Tab navigation
  document.querySelectorAll('.account-nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });
};

/**
 * Handle login
 */
const handleLogin = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    await signIn(email, password);
    showNotification('Welcome back!', 'success');
  } catch (error) {
    showNotification(getAuthErrorMessage(error.code), 'error');
  }
};

/**
 * Handle signup
 */
const handleSignup = async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  
  try {
    const userCredential = await signUp(email, password, name);
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user, { name, phone });
    
    showNotification('Account created successfully!', 'success');
  } catch (error) {
    showNotification(getAuthErrorMessage(error.code), 'error');
  }
};

/**
 * Handle logout
 */
const handleLogout = async () => {
  try {
    await logout();
    showNotification('Logged out successfully', 'info');
  } catch (error) {
    showNotification('Error logging out', 'error');
  }
};

/**
 * Handle profile update
 */
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  
  const updates = {
    name: document.getElementById('profileName').value,
    phone: document.getElementById('profilePhone').value,
    location: document.getElementById('profileLocation').value,
    preference: document.getElementById('profilePreference').value
  };
  
  try {
    await updateUserProfile(currentUser.uid, updates);
    userData = { ...userData, ...updates };
    invalidateCache(); // Invalidate global cache
    updateUI();
    showNotification('Profile updated!', 'success');
  } catch (error) {
    showNotification('Error updating profile', 'error');
  }
};

/**
 * Update UI based on auth state
 */
const updateUI = () => {
  if (currentUser && userData) {
    showAccountSection();
    updateDashboardStats();
    loadProfileData();
  } else {
    showAuthSection();
  }
};

/**
 * Show auth section (login/signup)
 */
const showAuthSection = () => {
  const authSection = document.getElementById('authSplitSection');
  const accountSection = document.getElementById('accountSection');
  const sidebar = document.getElementById('accountSidebar');
  
  if (authSection) authSection.style.display = 'flex';
  if (accountSection) accountSection.style.display = 'none';
  if (sidebar) sidebar.style.display = 'none';
};

/**
 * Show account section (dashboard)
 */
const showAccountSection = () => {
  const authSection = document.getElementById('authSplitSection');
  const accountSection = document.getElementById('accountSection');
  const sidebar = document.getElementById('accountSidebar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  
  if (authSection) authSection.style.display = 'none';
  if (accountSection) {
    accountSection.style.display = 'block';
    accountSection.classList.add('active');
  }
  if (sidebar) sidebar.style.display = 'block';
  if (userName) userName.textContent = userData.name || currentUser.displayName || 'User';
  if (userEmail) userEmail.textContent = currentUser.email;
};

/**
 * Update dashboard stats
 */
const updateDashboardStats = () => {
  const savedCount = document.getElementById('savedCount');
  const inquiryCount = document.getElementById('inquiryCount');
  
  if (savedCount && userData?.savedProperties) {
    savedCount.textContent = userData.savedProperties.length;
  }
  if (inquiryCount && userData?.inquiries) {
    inquiryCount.textContent = userData.inquiries.length;
  }
};

/**
 * Load profile data into form
 */
const loadProfileData = () => {
  if (!userData) return;
  
  const nameInput = document.getElementById('profileName');
  const phoneInput = document.getElementById('profilePhone');
  const locationInput = document.getElementById('profileLocation');
  const preferenceInput = document.getElementById('profilePreference');
  
  if (nameInput) nameInput.value = userData.name || '';
  if (phoneInput) phoneInput.value = userData.phone || '';
  if (locationInput) locationInput.value = userData.location || '';
  if (preferenceInput) preferenceInput.value = userData.preference || '';
};

/**
 * Switch between auth views (login/signup)
 */
const switchAuthView = (view) => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  
  if (view === 'signup') {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (authTitle) authTitle.textContent = 'Create Account';
    if (authSubtitle) authSubtitle.textContent = 'Join Wenamy to access exclusive properties';
    if (switchToSignup) switchToSignup.style.display = 'none';
    if (switchToLogin) switchToLogin.style.display = 'block';
  } else {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Welcome Back';
    if (authSubtitle) authSubtitle.textContent = 'Sign in to access your account';
    if (switchToSignup) switchToSignup.style.display = 'block';
    if (switchToLogin) switchToLogin.style.display = 'none';
  }
};

/**
 * Switch between account tabs
 */
const switchTab = (tabName) => {
  // Update nav items
  document.querySelectorAll('.account-nav-item[data-tab]').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  
  // Show/hide tabs
  document.querySelectorAll('.account-tab').forEach(tab => {
    tab.style.display = tab.id === `tab-${tabName}` ? 'block' : 'none';
  });
  
  // Load tab-specific data
  if (tabName === 'saved') renderSavedProperties();
  if (tabName === 'inquiries') renderInquiries();
  if (tabName === 'profile') loadProfileData();
};

/**
 * Render saved properties
 */
const renderSavedProperties = async () => {
  const container = document.getElementById('savedGrid');
  if (!container || !currentUser) return;
  
  const savedProperties = await getSavedProperties(currentUser.uid);
  
  if (savedProperties.length === 0) {
    container.innerHTML = `
      <div class="saved-properties-empty">
        <p>No saved properties yet</p>
        <a href="projects.html" class="btn-primary-soft">Browse Properties</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = savedProperties.map(property => `
    <div class="saved-property-item">
      <img src="${property.image}" alt="${property.title}">
      <h4>${property.title}</h4>
      <p>${property.location}</p>
    </div>
  `).join('');
};

/**
 * Render inquiries
 */
const renderInquiries = async () => {
  const container = document.getElementById('inquiriesList');
  if (!container || !currentUser) return;
  
  const inquiries = await getInquiries(currentUser.uid);
  
  if (inquiries.length === 0) {
    container.innerHTML = '<p>No inquiries yet</p>';
    return;
  }
  
  container.innerHTML = inquiries.map(inquiry => `
    <div class="inquiry-item">
      <p>${inquiry.message}</p>
      <span>${inquiry.status}</span>
    </div>
  `).join('');
};

/**
 * Show notification
 */
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `account-notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};
