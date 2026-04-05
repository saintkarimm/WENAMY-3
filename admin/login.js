// =========================================
// WENAMY ADMIN LOGIN
// =========================================

// Admin Credentials (Hardcoded for simple auth)
const ADMIN_CREDENTIALS = {
    email: 'ceo@wenamy.com',
    password: 'CEOWENAMY2026'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');
const forgotModal = document.getElementById('forgotModal');
const signupModal = document.getElementById('signupModal');

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    checkExistingSession();
    
    // Focus email input on load
    setTimeout(() => emailInput.focus(), 500);
});

// =========================================
// PASSWORD TOGGLE
// =========================================
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon
    const icon = togglePasswordBtn.querySelector('i');
    icon.className = type === 'password' ? 'ph ph-eye' : 'ph ph-eye-slash';
});

// =========================================
// FORM SUBMISSION - FIREBASE AUTH
// =========================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get input values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate inputs
    if (!validateInputs(email, password)) {
        return;
    }
    
    // Show loading state
    setLoading(true);
    
    // Simulate network delay for realism
    await simulateDelay(800);
    
    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        handleSuccessfulLogin();
    } else {
        // Failed login
        handleFailedLogin();
    }
    
    // Hide loading state
    setLoading(false);
});

// =========================================
// INPUT VALIDATION
// =========================================
function validateInputs(email, password) {
    // Reset error state
    hideError();
    
    // Check email
    if (!email) {
        showError('Please enter your email address');
        emailInput.focus();
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return false;
    }
    
    // Check password
    if (!password) {
        showError('Please enter your password');
        passwordInput.focus();
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =========================================
// LOGIN HANDLERS - FIREBASE
// =========================================
function handleSuccessfulLogin() {
    // Create session
    const session = {
        email: ADMIN_CREDENTIALS.email,
        loginTime: new Date().toISOString(),
        token: generateToken()
    };
    
    // Store in localStorage
    localStorage.setItem('wenamyAdminSession', JSON.stringify(session));
    
    // Show success animation
    showSuccessAnimation();
    
    // Redirect to dashboard after delay
    setTimeout(() => {
        window.location.href = '/admin';
    }, 1000);
}

function handleFailedLogin() {
    showError('Invalid login credentials');
    
    // Shake animation on inputs
    emailInput.parentElement.classList.add('shake');
    passwordInput.parentElement.classList.add('shake');
    
    setTimeout(() => {
        emailInput.parentElement.classList.remove('shake');
        passwordInput.parentElement.classList.remove('shake');
    }, 500);
    
    // Clear password field
    passwordInput.value = '';
    passwordInput.focus();
}

// =========================================
// SESSION MANAGEMENT
// =========================================
function checkExistingSession() {
    const session = localStorage.getItem('wenamyAdminSession');
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            // Session expires after 24 hours
            if (hoursSinceLogin < 24) {
                // Auto-redirect to dashboard
                window.location.href = '/admin';
            } else {
                // Clear expired session
                localStorage.removeItem('wenamyAdminSession');
            }
        } catch (e) {
            // Invalid session data
            localStorage.removeItem('wenamyAdminSession');
        }
    }
}

function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2, 16) + Date.now();
}

// =========================================
// UI HELPERS
// =========================================
function setLoading(isLoading) {
    if (isLoading) {
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
    }
}

function showError(message) {
    errorMessage.querySelector('span').textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showSuccessAnimation() {
    loginButton.style.background = 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)';
    loginButton.querySelector('.button-text').textContent = 'Success!';
}

function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================================
// FORGOT PASSWORD - FIREBASE
// =========================================
function showForgotPassword() {
    forgotModal.classList.add('active');
}

function closeForgotModal() {
    forgotModal.classList.remove('active');
}

// Handle password reset
function sendPasswordReset() {
    showToast('Please contact the administrator to reset your password.', 'info');
    closeForgotModal();
}

// Toast notification helper
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="ph ${type === 'success' ? 'ph-check-circle' : type === 'error' ? 'ph-warning-circle' : 'ph-info'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSignUp() {
    signupModal.classList.add('active');
}

function closeSignUpModal() {
    signupModal.classList.remove('active');
}

// Close modals on overlay click
forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
        closeForgotModal();
    }
});

signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
        closeSignUpModal();
    }
});

// =========================================
// KEYBOARD SHORTCUTS
// =========================================
document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        closeForgotModal();
        closeSignUpModal();
    }
    
    // Focus email on Ctrl/Cmd + L
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        emailInput.focus();
    }
});

// =========================================
// INPUT EVENTS
// =========================================
emailInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);

// Auto-fill detection
window.addEventListener('load', () => {
    setTimeout(() => {
        if (emailInput.value || passwordInput.value) {
            // Browser auto-filled credentials
            hideError();
        }
    }, 100);
});
