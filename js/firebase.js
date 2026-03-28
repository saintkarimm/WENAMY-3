/**
 * Firebase Core Setup
 * Initializes Firebase app and exports auth and db instances
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDbxcvpNTu2JnRYrgpg3P83Xp6ZuCJGAg",
  authDomain: "wenamy-2026.firebaseapp.com",
  projectId: "wenamy-2026",
  storageBucket: "wenamy-2026.firebasestorage.app",
  messagingSenderId: "1073307031570",
  appId: "1:1073307031570:web:7b3f0fd00c215ad79620cb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
