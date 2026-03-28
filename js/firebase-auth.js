/**
 * Firebase Authentication Service for Wenamy
 * Handles user authentication with Firebase Auth and Firestore
 */

class FirebaseAuthManager {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.listeners = [];
    this.init();
  }
  
  // Wait for Firebase to be ready
  waitForFirebase() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.firebaseAuth && window.firebaseDb) {
          this.auth = window.firebaseAuth;
          this.db = window.firebaseDb;
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  // Initialize auth state listener
  async init() {
    await this.waitForFirebase();
    
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, fetch additional data from Firestore
        this.fetchUserData(user.uid).then((userData) => {
          this.currentUser = {
            id: user.uid,
            email: user.email,
            name: userData?.name || user.displayName || user.email.split('@')[0],
            phone: userData?.phone || '',
            location: userData?.location || '',
            preference: userData?.preference || '',
            savedProperties: userData?.savedProperties || [],
            inquiries: userData?.inquiries || [],
            joinedAt: userData?.joinedAt || user.metadata.creationTime,
            ...userData
          };
          this.notifyListeners();
          this.updateNavbar();
        });
      } else {
        // User is signed out
        this.currentUser = null;
        this.notifyListeners();
        this.updateNavbar();
      }
    });
  }

  // Fetch user data from Firestore
  async fetchUserData(userId) {
    try {
      const doc = await this.db.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Sign up with email and password
  async signup(email, password, userData = {}) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userDoc = {
        id: user.uid,
        email: user.email,
        name: userData.name || email.split('@')[0],
        phone: userData.phone || '',
        location: '',
        preference: '',
        savedProperties: [],
        inquiries: [],
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.db.collection('users').doc(user.uid).set(userDoc);

      // Update current user
      this.currentUser = userDoc;
      this.notifyListeners();
      this.updateNavbar();

      return { success: true, user: userDoc };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userData = await this.fetchUserData(user.uid);
      
      this.currentUser = {
        id: user.uid,
        email: user.email,
        name: userData?.name || user.displayName || email.split('@')[0],
        phone: userData?.phone || '',
        location: userData?.location || '',
        preference: userData?.preference || '',
        savedProperties: userData?.savedProperties || [],
        inquiries: userData?.inquiries || [],
        joinedAt: userData?.joinedAt || user.metadata.creationTime,
        ...userData
      };

      this.notifyListeners();
      this.updateNavbar();

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async logout() {
    try {
      await this.auth.signOut();
      this.currentUser = null;
      this.notifyListeners();
      this.updateNavbar();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    if (!this.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      await this.db.collection('users').doc(this.currentUser.id).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Update local user data
      this.currentUser = { ...this.currentUser, ...updates };
      this.notifyListeners();

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Save property to user's saved properties
  async saveProperty(property) {
    if (!this.currentUser) {
      return { success: false, error: 'Please sign in to save properties' };
    }

    try {
      const savedProperties = this.currentUser.savedProperties || [];
      const exists = savedProperties.find(p => p.id === property.id);

      if (exists) {
        return { success: false, error: 'Property already saved' };
      }

      const newProperty = {
        ...property,
        savedAt: new Date().toISOString()
      };

      savedProperties.push(newProperty);

      await this.db.collection('users').doc(this.currentUser.id).update({
        savedProperties: savedProperties,
        updatedAt: new Date().toISOString()
      });

      this.currentUser.savedProperties = savedProperties;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Save property error:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove property from saved properties
  async removeSavedProperty(propertyId) {
    if (!this.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const savedProperties = (this.currentUser.savedProperties || []).filter(
        p => p.id !== propertyId
      );

      await this.db.collection('users').doc(this.currentUser.id).update({
        savedProperties: savedProperties,
        updatedAt: new Date().toISOString()
      });

      this.currentUser.savedProperties = savedProperties;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Remove property error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add inquiry
  async addInquiry(inquiry) {
    if (!this.currentUser) {
      return { success: false, error: 'Please sign in to track inquiries' };
    }

    try {
      const inquiries = this.currentUser.inquiries || [];
      
      inquiries.push({
        ...inquiry,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      await this.db.collection('users').doc(this.currentUser.id).update({
        inquiries: inquiries,
        updatedAt: new Date().toISOString()
      });

      this.currentUser.inquiries = inquiries;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Add inquiry error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Subscribe to auth state changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.currentUser);
    });
  }

  // Update navbar UI (reuses existing auth.js logic)
  updateNavbar() {
    // Dispatch event for auth.js to handle navbar updates
    window.dispatchEvent(new CustomEvent('firebaseAuthStateChanged', {
      detail: { user: this.currentUser, isAuthenticated: this.isAuthenticated() }
    }));
  }

  // Get user-friendly error message
  getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email already registered. Please sign in.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.'
    };
    return messages[code] || 'An error occurred. Please try again.';
  }
}

// Create global instance
const firebaseAuthManager = new FirebaseAuthManager();
window.firebaseAuthManager = firebaseAuthManager;
