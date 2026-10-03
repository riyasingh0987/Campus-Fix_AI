import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../services/firebase.js'
import { AuthContext } from './auth-context.js'

function getFirebaseSetupError() {
  return new Error('Firebase is not configured yet. Add your Firebase values to .env.local and restart the app.')
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(firebaseConfigured)

  useEffect(() => {
    if (!firebaseConfigured || !auth || !db) return undefined

    let isActive = true
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (isActive) {
          setCurrentUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (isActive) {
          setCurrentUser(userSnapshot.exists() ? userSnapshot.data() : null)
          setLoading(false)
        }
      } catch {
        if (isActive) {
          setCurrentUser(null)
          setLoading(false)
        }
      }
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  async function signup({ name, email, password, requestedRole, adminCode }) {
    if (!firebaseConfigured || !auth || !db) throw getFirebaseSetupError()

    const roleIsAuthorized = requestedRole === 'admin' && Boolean(import.meta.env.VITE_ADMIN_INVITE_CODE) && adminCode === import.meta.env.VITE_ADMIN_INVITE_CODE
    const role = roleIsAuthorized ? 'admin' : 'student'
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    const profile = {
      uid: credential.user.uid,
      name,
      email: credential.user.email,
      role,
      createdAt: serverTimestamp(),
    }

    try {
      await setDoc(doc(db, 'users', credential.user.uid), profile)
    } catch (error) {
      await signOut(auth)
      throw error
    }

    setCurrentUser(profile)
    return { profile, roleIsAuthorized }
  }

  async function login(email, password) {
    if (!firebaseConfigured || !auth || !db) throw getFirebaseSetupError()
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid))
    if (!userSnapshot.exists()) {
      await signOut(auth)
      throw new Error('This account has no CampusFix profile. Please contact an administrator.')
    }
    const profile = userSnapshot.data()
    setCurrentUser(profile)
    return profile
  }

  async function logout() {
    if (auth) await signOut(auth)
    setCurrentUser(null)
  }

  const value = { currentUser, role: currentUser?.role ?? null, loading, signup, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}