import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function buildLinkKey(parentEmail, childName) {
  const email = parentEmail.trim().toLowerCase();
  const name = childName.trim().toLowerCase().replace(/\s+/g, ' ');
  return `${email}_${name}`;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(true);

  const linkKey = currentUser && childName ? buildLinkKey(currentUser.email, childName) : null;

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setUserRole(null);
    setUserProfile(null);
    setChildName('');
    localStorage.removeItem('careconnect-role');
    localStorage.removeItem('careconnect-child');
    return signOut(auth);
  }

  function setRole(role) {
    setUserRole(role);
    localStorage.setItem('careconnect-role', role);
  }

  const setChild = useCallback((name) => {
    setChildName(name);
    localStorage.setItem('careconnect-child', name);
  }, []);

  async function updateProfile(data) {
    if (!currentUser) return;
    const ref = doc(db, 'users', currentUser.uid);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    setUserProfile(prev => ({ ...prev, ...data }));
  }

  async function loadProfile(user) {
    if (!user) return;
    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        if (data.role) {
          setUserRole(data.role);
          localStorage.setItem('careconnect-role', data.role);
        }
        if (data.childName) {
          setChildName(data.childName);
          localStorage.setItem('careconnect-child', data.childName);
        }
      }
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
  }

  useEffect(() => {
    const savedRole = localStorage.getItem('careconnect-role');
    const savedChild = localStorage.getItem('careconnect-child');
    if (savedRole) setUserRole(savedRole);
    if (savedChild) setChildName(savedChild);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfile(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userProfile,
    childName,
    linkKey,
    signup,
    login,
    logout,
    setRole,
    setChild,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
