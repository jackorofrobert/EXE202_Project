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
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase/config'
import type { User, EmotionEntry, DiaryEntry, Booking, Psychologist, AnalyticsData, BookingStatus, Transaction, TransactionStatus, ChatMessage } from '../types'

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

  static async updateBookingStatus(bookingId: string, status: BookingStatus, notes?: string): Promise<void> {
    try {
      const updateData: any = { status }
      if (notes !== undefined) {
        updateData.notes = notes
      }
      await updateDoc(doc(db, 'bookings', bookingId), updateData)
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  static async getBookingsForPsychologist(psychologistId: string): Promise<Booking[]> {
    try {
      const snapshot = await getDocs(query(
        collection(db, 'bookings'),
        where('psychologistId', '==', psychologistId)
      ))
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Booking[]
    } catch (error) {
      console.error('Error getting bookings for psychologist:', error)
      return []
    }
  }

  // Admin operations
  static async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as User[]
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  static async updatePsychologist(psychologistId: string, psychologistData: Partial<Psychologist>): Promise<void> {
    try {
      // Filter out undefined values to prevent Firebase errors
      const cleanData = Object.fromEntries(
        Object.entries(psychologistData).filter(([_, value]) => value !== undefined)
      )
      
      await updateDoc(doc(db, 'users', psychologistId), {
        ...cleanData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating psychologist:', error)
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

      console.log("Real Firestore data:")
      console.log("- Total users:", totalUsers)
      console.log("- Active users:", activeUsers)
      console.log("- Total psychologists:", totalPsychologists)
      console.log("- Total bookings:", totalBookings)
      console.log("- Emotion distribution:", emotionDistribution)

      return {
        totalUsers,
        activeUsers,
        totalPsychologists,
        totalBookings,
        emotionDistribution
      }
    } catch (error) {
      console.error('Error getting admin analytics:', error)
      throw error
    }
  }

  // Get analytics trends (for percentage calculations)
  static async getAnalyticsTrends(): Promise<{
    userGrowth: number
    activeUserGrowth: number
    psychologistGrowth: number
    bookingGrowth: number
  }> {
    // For now, return 0% growth since we don't have historical data
    // In a real app, you would store daily/weekly snapshots and compare
    return {
      userGrowth: 0,
      activeUserGrowth: 0,
      psychologistGrowth: 0,
      bookingGrowth: 0
    }
  }

  // Chat operations
  static async addChatMessage(conversationId: string, messageData: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<string> {
    try {
      console.log('FirestoreService - addChatMessage called with:', { conversationId, messageData })
      
      const docRef = await addDoc(collection(db, 'chat_messages'), {
        ...messageData,
        conversationId,
        createdAt: serverTimestamp()
      })
      
      console.log('FirestoreService - Message added with ID:', docRef.id)
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
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
    } catch (error) {
      console.error('Error getting chat messages:', error)
      return []
    }
  }

  static async getChatMessagesForPsychologist(psychologistId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, 'chat_messages'),
        where('receiverId', '==', psychologistId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
    } catch (error) {
      console.error('Error getting chat messages for psychologist:', error)
      return []
    }
  }

  // Real-time chat listeners
  static subscribeToChatMessages(
    conversationId: string, 
    callback: (messages: ChatMessage[]) => void
  ): Unsubscribe {
    console.log('FirestoreService - subscribeToChatMessages for conversationId:', conversationId)
    
    // Simplified query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'chat_messages'),
      where('conversationId', '==', conversationId)
    )

    return onSnapshot(q, (snapshot) => {
      console.log('FirestoreService - onSnapshot triggered, docs count:', snapshot.docs.length)
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
      
      console.log('FirestoreService - Processed messages:', messages)
      
      // Sort messages by createdAt in JavaScript
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      
      callback(messages)
    }, (error) => {
      console.error('Error listening to chat messages:', error)
      // Fallback: try to load messages without real-time
      this.getChatMessages(conversationId).then(callback).catch(console.error)
    })
  }

  static subscribeToPsychologistChatSessions(
    psychologistId: string,
    callback: (sessions: Array<{
      id: string
      userId: string
      userName: string
      lastMessage?: string
      lastMessageTime?: string
      unreadCount: number
    }>) => void
  ): Unsubscribe {
    // Simplified query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'chat_messages'),
      where('receiverId', '==', psychologistId)
    )

    return onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]

      // Sort messages by createdAt in JavaScript
      allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Group messages by conversation
      const sessionMap = new Map<string, {
        id: string
        userId: string
        userName: string
        lastMessage?: string
        lastMessageTime?: string
        unreadCount: number
      }>()
      
      allMessages.forEach((message) => {
        const conversationId = message.conversationId || `${message.senderId}_${psychologistId}`
        const userId = message.senderId === psychologistId ? message.receiverId : message.senderId
        
        if (!sessionMap.has(conversationId)) {
          sessionMap.set(conversationId, {
            id: conversationId,
            userId: userId || '',
            userName: `User #${userId}`,
            unreadCount: 0
          })
        }
        
        const session = sessionMap.get(conversationId)!
        
        // Update last message info
        if (!session.lastMessageTime || new Date(message.createdAt) > new Date(session.lastMessageTime)) {
          session.lastMessage = message.content
          session.lastMessageTime = message.createdAt
          
          // Count unread messages (messages not from psychologist)
          if (message.senderId !== psychologistId) {
            session.unreadCount++
          }
        }
      })
      
      // Convert to array and sort by last message time
      const sessions = Array.from(sessionMap.values())
        .sort((a, b) => {
          if (!a.lastMessageTime || !b.lastMessageTime) return 0
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        })
      
      callback(sessions)
    }, (error) => {
      console.error('Error listening to psychologist chat sessions:', error)
      // Fallback: try to load sessions without real-time
      this.getChatMessagesForPsychologist(psychologistId).then((messages) => {
        // Process messages into sessions
        const sessionMap = new Map<string, {
          id: string
          userId: string
          userName: string
          lastMessage?: string
          lastMessageTime?: string
          unreadCount: number
        }>()
        
        messages.forEach((message) => {
          const conversationId = message.conversationId || `${message.senderId}_${psychologistId}`
          const userId = message.senderId === psychologistId ? message.receiverId : message.senderId
          
          if (!sessionMap.has(conversationId)) {
            sessionMap.set(conversationId, {
              id: conversationId,
              userId: userId || '',
              userName: `User #${userId}`,
              unreadCount: 0
            })
          }
          
          const session = sessionMap.get(conversationId)!
          
          if (!session.lastMessageTime || new Date(message.createdAt) > new Date(session.lastMessageTime)) {
            session.lastMessage = message.content
            session.lastMessageTime = message.createdAt
            
            if (message.senderId !== psychologistId) {
              session.unreadCount++
            }
          }
        })
        
        const sessions = Array.from(sessionMap.values())
          .sort((a, b) => {
            if (!a.lastMessageTime || !b.lastMessageTime) return 0
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
          })
        
        callback(sessions)
      }).catch(console.error)
    })
  }
  static async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString()
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: now,
        updatedAt: now
      })
      return transactionRef.id
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  static async getTransactions(status?: TransactionStatus): Promise<Transaction[]> {
    try {
      let q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
      
      if (status) {
        q = query(collection(db, 'transactions'), where('status', '==', status), orderBy('createdAt', 'desc'))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction))
    } catch (error) {
      console.error('Error getting transactions:', error)
      throw error
    }
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction))
    } catch (error) {
      console.error('Error getting user transactions:', error)
      throw error
    }
  }

  static async updateTransactionStatus(transactionId: string, status: TransactionStatus, adminNotes?: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId)
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      }
      
      if (adminNotes) {
        updateData.adminNotes = adminNotes
      }

      await updateDoc(transactionRef, updateData)

      // If approved, upgrade user to gold
      if (status === 'approved') {
        const transactionDoc = await getDoc(transactionRef)
        const transactionData = transactionDoc.data() as Transaction
        
        if (transactionData.type === 'upgrade_to_gold') {
          await this.updateUser(transactionData.userId, { tier: 'gold' })
        }
      }
    } catch (error) {
      console.error('Error updating transaction status:', error)
      throw error
    }
  }
}