// ----------------------------
// Firebase Initialization
// ----------------------------
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-D0m7m_atWOnORZ4RXfqHH9JPd1A_Qac",
  authDomain: "litebulb-bfc72.firebaseapp.com",
  projectId: "litebulb-bfc72",
  storageBucket: "litebulb-bfc72.firebasestorage.app",
  messagingSenderId: "1008935496350",
  appId: "1:1008935496350:web:4560d0a31d94998a00298f",
  measurementId: "G-BW42YYJPZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
        await auth.signInWithEmailAndPassword(email, password);
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
        await auth.signOut();
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
auth.onAuthStateChanged(user => {
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