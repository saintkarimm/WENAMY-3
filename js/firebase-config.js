/**
 * Firebase Configuration for Wenamy
 * Initialize Firebase app and export services
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDbxcvpNTu2JnRYrgpg3P83Xp6ZuCJGAg",
  authDomain: "wenamy-2026.firebaseapp.com",
  projectId: "wenamy-2026",
  storageBucket: "wenamy-2026.firebasestorage.app",
  messagingSenderId: "1073307031570",
  appId: "1:1073307031570:web:7b3f0fd00c215ad79620cb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence({
  synchronizeTabs: true
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported by browser');
  }
});

// Make available globally
window.firebaseAuth = auth;
window.firebaseDb = db;
