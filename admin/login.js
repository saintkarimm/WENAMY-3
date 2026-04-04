// =========================================
// WENAMY ADMIN LOGIN - FIREBASE AUTH
// =========================================

// Import Firebase Auth functions (loaded via module script in HTML)
import { 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Allowed admin emails (whitelist)
const ALLOWED_ADMIN_EMAILS = [
    'ceo@wenamy.com',
    'admin@wenamy.com'
];

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
    
    try {
        // Check if email is in allowed admin list
        if (!ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
            throw new Error('Unauthorized email address');
        }
        
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;
        
        // Successful login
        handleSuccessfulLogin(user);
    } catch (error) {
        console.error('Login error:', error);
        handleFailedLogin(error);
    } finally {
        // Hide loading state
        setLoading(false);
    }
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
function handleSuccessfulLogin(user) {
    // Create session with Firebase user data
    const session = {
        email: user.email,
        uid: user.uid,
        loginTime: new Date().toISOString(),
        token: user.accessToken || generateToken()
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

function handleFailedLogin(error) {
    // Map Firebase error codes to user-friendly messages
    let errorMessage = 'Invalid login credentials';
    
    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address';
            break;
        case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
        case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password';
            break;
        default:
            if (error.message === 'Unauthorized email address') {
                errorMessage = 'This email is not authorized for admin access';
            }
    }
    
    showError(errorMessage);
    
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
// SESSION MANAGEMENT - FIREBASE
// =========================================
function checkExistingSession() {
    // Check Firebase auth state
    onAuthStateChanged(window.firebaseAuth, (user) => {
        if (user) {
            // User is signed in, check if email is authorized
            if (ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                // Check local session expiry
                const session = localStorage.getItem('wenamyAdminSession');
                if (session) {
                    try {
                        const sessionData = JSON.parse(session);
                        const loginTime = new Date(sessionData.loginTime);
                        const now = new Date();
                        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
                        
                        // Session expires after 24 hours
                        if (hoursSinceLogin < 24 && sessionData.uid === user.uid) {
                            // Auto-redirect to dashboard
                            window.location.href = '/admin';
                            return;
                        }
                    } catch (e) {
                        console.error('Session parse error:', e);
                    }
                }
                
                // Valid Firebase user but no/expired local session - create new session
                handleSuccessfulLogin(user);
            } else {
                // User not authorized - sign them out
                signOut(window.firebaseAuth);
                localStorage.removeItem('wenamyAdminSession');
            }
        }
        // If no user, stay on login page
    });
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
async function sendPasswordReset() {
    const resetEmailInput = forgotModal.querySelector('input[type="email"]');
    const resetEmail = resetEmailInput.value.trim();
    
    if (!resetEmail) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(resetEmail)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Check if email is authorized
    if (!ALLOWED_ADMIN_EMAILS.includes(resetEmail.toLowerCase())) {
        showToast('This email is not authorized for admin access', 'error');
        return;
    }
    
    try {
        await sendPasswordResetEmail(window.firebaseAuth, resetEmail);
        showToast('Password reset email sent! Check your inbox.', 'success');
        closeForgotModal();
        resetEmailInput.value = '';
    } catch (error) {
        console.error('Password reset error:', error);
        let message = 'Failed to send reset email';
        if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email';
        }
        showToast(message, 'error');
    }
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
