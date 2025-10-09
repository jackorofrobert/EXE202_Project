// Database service layer for common operations
import { FirestoreService } from './firestore-service'
import { auth } from './firebase/config'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'

export class DatabaseService {
  // Get current user with role
  static async getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        unsubscribe()
        if (!firebaseUser) {
          resolve(null)
          return
        }
        
        try {
          const userData = await FirestoreService.getUser(firebaseUser.uid)
          resolve(userData)
        } catch (error) {
          console.error('Error getting current user:', error)
          resolve(null)
        }
      })
    })
  }

  // Check if user is Gold member
  static async isGoldUser(userId: string): Promise<boolean> {
    return await FirestoreService.isGoldUser(userId)
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    return await FirestoreService.getUserStats(userId)
  }

  // Get admin analytics
  static async getAdminAnalytics() {
    return await FirestoreService.getAdminAnalytics()
  }
}
