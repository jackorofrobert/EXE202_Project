import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./config"
import type { User } from "../../types"

export const authService = {
  // Register new user
  async register(email: string, password: string, name: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      role: "user",
      tier: "free",
      createdAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "users", firebaseUser.uid), userData)

    return userData
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

    if (!userDoc.exists()) {
      throw new Error("Không tìm thấy thông tin người dùng")
    }

    return userDoc.data() as User
  },

  // Logout user
  async logout(): Promise<void> {
    await signOut(auth)
  },

  // Get current Firebase user
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser
  },

  // Get current user data from Firestore
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

    if (!userDoc.exists()) {
      return null
    }

    return userDoc.data() as User
  },

  // Change password for current user
  async changePassword(newPassword: string): Promise<void> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error("Không có người dùng đang đăng nhập")
    }
    
    await updatePassword(firebaseUser, newPassword)
  },

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getCurrentUser(firebaseUser)
        callback(userData)
      } else {
        callback(null)
      }
    })
  },
}
