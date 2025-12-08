// ----------------------------
// Firebase Initialization (v9+ modular)
// ----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZIItVRsAwIJgvwe2XTqHSDubuVqTrEdQ",
  authDomain: "litebulb-85531.firebaseapp.com",
  projectId: "litebulb-85531",
  storageBucket: "litebulb-85531.appspot.com", // ✅ fix: should end with .appspot.com
  messagingSenderId: "586023775756",
  appId: "1:586023775756:web:ddbf326c3990e7f3710829",
  measurementId: "G-1N4PJTWP3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth + firestore so other files (tasks.js, index.js) can import them
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// ----------------------------
// AUTH UI + HANDLERS
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  M.Modal.init(document.querySelectorAll('.modal'));

  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const authModal = document.getElementById('authModal');
  const authSubmitBtn = document.getElementById('authSubmitBtn');

  if (signInBtn && authModal) {
    signInBtn.addEventListener('click', () => {
      M.Modal.getInstance(authModal).open();
    });
  }

  if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        M.toast({ html: 'Signed in' });
        if (authModal) M.Modal.getInstance(authModal).close();
      } catch (err) {
        M.toast({ html: 'Auth error: ' + err.message });
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        M.toast({ html: 'Signed out' });
      } catch (err) {
        M.toast({ html: 'Error signing out: ' + err.message });
      }
    });
  }
});

// ----------------------------
// Auth State Listener
// ----------------------------
onAuthStateChanged(auth, user => {
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  if (!signInBtn || !signOutBtn) return;

  if (user) {
    signInBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
  } else {
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
  }
});