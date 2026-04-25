import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const perf = getPerformance(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ── AUTH FUNCTIONS ──────────────────────────────────────────

/**
 * Signs in user with Google Popup
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create record
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        gameData: {
          ip: 100,
          level: 0,
          inventory: {}
        }
      });
    }
    
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

/**
 * Logout
 */
export const logout = () => signOut(auth);

// ── DATABASE FUNCTIONS ──────────────────────────────────────

/**
 * Save game progress to Firestore
 */
export const saveGameProgress = async (uid, data) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, {
      "name": data.playerName || "Anonymous",
      "gameData.ip": data.ip,
      "gameData.level": data.currentLevel || data.level,
      "gameData.inventory": data.inventory || {},
      lastUpdated: new Date()
    });
    // Log analytics event
    logEvent(analytics, 'save_progress', { level: data.currentLevel || data.level, ip: data.ip });
  } catch (error) {
    console.error("Save Progress Error:", error);
  }
};

/**
 * Fetch leaderboard data
 */
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export const getLeaderboard = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("gameData.ip", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: doc.id,
        name: data.name || "Anonymous",
        ip: data.gameData?.ip || 0,
        level: data.gameData?.level || 0,
        photoURL: data.photoURL,
        certificate: data.certificate
      });
    });
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

/**
 * Save final certificate data
 */
export const saveCertificateData = async (uid, data) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, {
      "certificate.issued": true,
      "certificate.score": data.ip,
      "certificate.profile": data.profile,
      "certificate.date": new Date(),
      lastUpdated: new Date()
    });
    // Log completion event
    logEvent(analytics, 'certificate_issued', { score: data.ip, profile: data.profile });
  } catch (error) {
    console.error("Save Certificate Error:", error);
  }
};

/**
 * Load game progress from Firestore
 */
export const loadGameProgress = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data().gameData : null;
};
