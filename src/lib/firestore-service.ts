import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase/config'
import type { User, EmotionEntry, DiaryEntry, Booking, Psychologist, AnalyticsData, EmotionLevel, BookingStatus } from '../types'

export class FirestoreService {
  // User operations
  static async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User
      }
      return null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  static async isGoldUser(userId: string): Promise<boolean> {
    try {
      const user = await this.getUser(userId)
      return user?.tier === 'gold'
    } catch (error) {
      console.error('Error checking gold user:', error)
      return false
    }
  }

  // Emotion entries operations
  static async addEmotionEntry(userId: string, emotionData: Omit<EmotionEntry, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'emotion_entries'), {
        ...emotionData,
        userId,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding emotion entry:', error)
      throw error
    }
  }

  static async getEmotionEntries(userId: string, limitCount?: number): Promise<EmotionEntry[]> {
    try {
      console.log('FirestoreService: Getting emotion entries for user:', userId);
      
      // Query đơn giản hơn - chỉ filter theo userId
      let q = query(
        collection(db, 'emotion_entries'),
        where('userId', '==', userId)
      )
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const snapshot = await getDocs(q)
      console.log('FirestoreService: Query result:', snapshot.docs.length, 'documents');
      
      // Sort trong JavaScript thay vì Firestore
      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as EmotionEntry[]
      
      // Sort by createdAt descending
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      console.log('FirestoreService: Processed result:', result);
      return result
    } catch (error) {
      console.error('Error getting emotion entries:', error)
      return []
    }
  }

  // Diary entries operations
  static async addDiaryEntry(userId: string, diaryData: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'diary_entries'), {
        ...diaryData,
        userId,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding diary entry:', error)
      throw error
    }
  }

  static async getDiaryEntries(userId: string): Promise<DiaryEntry[]> {
    try {
      const q = query(
        collection(db, 'diary_entries'),
        where('userId', '==', userId)
      )

      const snapshot = await getDocs(q)
      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as DiaryEntry[]
      
      // Sort by createdAt descending
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return result
    } catch (error) {
      console.error('Error getting diary entries:', error)
      return []
    }
  }

  static async deleteDiaryEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'diary_entries', entryId))
    } catch (error) {
      console.error('Error deleting diary entry:', error)
      throw error
    }
  }

  // Psychologist operations
  static async getPsychologists(): Promise<Psychologist[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'psychologist')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Psychologist[]
    } catch (error) {
      console.error('Error getting psychologists:', error)
      return []
    }
  }

  // Booking operations
  static async addBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding booking:', error)
      throw error
    }
  }

  static async getBookings(userId: string, type: 'user' | 'psychologist'): Promise<Booking[]> {
    try {
      const field = type === 'user' ? 'userId' : 'psychologistId'
      const q = query(
        collection(db, 'bookings'),
        where(field, '==', userId)
      )

      const snapshot = await getDocs(q)
      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Booking[]
      
      // Sort by createdAt descending
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return result
    } catch (error) {
      console.error('Error getting bookings:', error)
      return []
    }
  }

  static async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  // Analytics operations
  static async getAdminAnalytics(): Promise<AnalyticsData> {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const totalUsers = usersSnapshot.size
      const activeUsers = usersSnapshot.docs.filter(doc => {
        const data = doc.data()
        return data.role === 'user' && data.tier === 'gold'
      }).length

      // Get total psychologists
      const psychologistsSnapshot = await getDocs(query(
        collection(db, 'users'),
        where('role', '==', 'psychologist')
      ))
      const totalPsychologists = psychologistsSnapshot.size

      // Get total bookings
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
      const totalBookings = bookingsSnapshot.size

      // Get emotion distribution
      const emotionsSnapshot = await getDocs(collection(db, 'emotion_entries'))
      const emotionDistribution = [1, 2, 3, 4, 5].map(level => ({
        level,
        count: emotionsSnapshot.docs.filter(doc => doc.data().level === level).length
      }))

      // Mock data for charts (you can implement real data later)
      const userGrowth = [
        { date: '2024-01', users: 10 },
        { date: '2024-02', users: 15 },
        { date: '2024-03', users: 20 },
        { date: '2024-04', users: 25 },
        { date: '2024-05', users: 30 },
        { date: '2024-06', users: 35 }
      ]

      const bookingStats = [
        { month: 'Jan', bookings: 5 },
        { month: 'Feb', bookings: 8 },
        { month: 'Mar', bookings: 12 },
        { month: 'Apr', bookings: 15 },
        { month: 'May', bookings: 18 },
        { month: 'Jun', bookings: 22 }
      ]

      return {
        totalUsers,
        activeUsers,
        totalPsychologists,
        totalBookings,
        emotionDistribution,
        userGrowth,
        bookingStats
      }
    } catch (error) {
      console.error('Error getting admin analytics:', error)
      throw error
    }
  }

  // Chat operations
  static async addChatMessage(conversationId: string, messageData: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chat_messages'), {
        ...messageData,
        conversationId,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding chat message:', error)
      throw error
    }
  }

  static async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, 'chat_messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      })) as ChatMessage[]
    } catch (error) {
      console.error('Error getting chat messages:', error)
      return []
    }
  }
}

// Add ChatMessage type
interface ChatMessage {
  id: string
  senderId: string
  content: string
  type: 'user' | 'bot'
  createdAt: Date
}