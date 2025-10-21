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
  Unsubscribe,
  increment
} from 'firebase/firestore'
import { db } from './firebase/config'
import type { User, EmotionEntry, DiaryEntry, Booking, Psychologist, AnalyticsData, BookingStatus, Transaction, TransactionStatus, ChatMessage, Voucher, VoucherUsage } from '../types'
import type { Conversation } from './conversation-service'

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
      // Query đơn giản hơn - chỉ filter theo userId
      let q = query(
        collection(db, 'emotion_entries'),
        where('userId', '==', userId)
      )
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const snapshot = await getDocs(q)
      
      // Sort trong JavaScript thay vì Firestore
      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as EmotionEntry[]
      
      // Sort by createdAt descending
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
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

  // Get user growth data by month
  static async getUserGrowthData(): Promise<{ date: string; users: number }[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]

      // Group users by month
      const monthlyData: { [key: string]: number } = {}
      
      users.forEach(user => {
        const createdAt = new Date(user.createdAt)
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0
        }
        monthlyData[monthKey]++
      })

      // Convert to array and sort by date
      const result = Object.entries(monthlyData)
        .map(([date, users]) => ({ date, users }))
        .sort((a, b) => a.date.localeCompare(b.date))

      // Fill in missing months with 0
      const startDate = new Date('2024-01-01')
      const endDate = new Date()
      const filledData: { date: string; users: number }[] = []
      
      for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const existingData = result.find(item => item.date === monthKey)
        filledData.push({
          date: monthKey,
          users: existingData ? existingData.users : 0
        })
      }

      return filledData.slice(-6) // Return last 6 months
    } catch (error) {
      console.error('Error getting user growth data:', error)
      return []
    }
  }

  // Get booking statistics by month
  static async getBookingStatsData(): Promise<{ month: string; bookings: number }[]> {
    try {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
      const bookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[]

      // Group bookings by month
      const monthlyData: { [key: string]: number } = {}
      
      bookings.forEach(booking => {
        const createdAt = new Date(booking.createdAt)
        const monthKey = createdAt.toLocaleDateString('en-US', { month: 'short' })
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0
        }
        monthlyData[monthKey]++
      })

      // Convert to array and sort by month order
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const result = monthOrder.map(month => ({
        month,
        bookings: monthlyData[month] || 0
      }))

      return result.slice(-6) // Return last 6 months
    } catch (error) {
      console.error('Error getting booking stats data:', error)
      return []
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
        where('conversationId', '==', conversationId)
      )

      const snapshot = await getDocs(q)
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
      
      // Sort by createdAt ascending on client side
      return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } catch (error) {
      console.error('Error getting chat messages:', error)
      return []
    }
  }

  static async getChatMessagesForPsychologist(psychologistId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, 'chat_messages'),
        where('receiverId', '==', psychologistId)
      )

      const snapshot = await getDocs(q)
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
      
      // Sort by createdAt descending on client side
      return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
    // Simplified query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'chat_messages'),
      where('conversationId', '==', conversationId)
    )

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]
      
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

    return onSnapshot(q, async (snapshot) => {
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[]

      // Sort messages by createdAt in JavaScript
      allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Get unique user IDs
      const userIds = [...new Set(allMessages.map(msg => 
        msg.senderId === psychologistId ? msg.receiverId : msg.senderId
      ).filter(Boolean))]

      // Load user names
      const usersMap = new Map<string, string>()
      try {
        const usersSnapshot = await getDocs(query(
          collection(db, 'users'),
          where('__name__', 'in', userIds)
        ))
        usersSnapshot.docs.forEach(doc => {
          const userData = doc.data()
          usersMap.set(doc.id, userData.name || `User #${doc.id}`)
        })
      } catch (error) {
        console.error('Error loading user names:', error)
      }

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
            userName: usersMap.get(userId || '') || `User #${userId}`,
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
      
      // Clean up undefined values before saving to Firestore
      const cleanTransactionData = {
        ...transactionData,
        createdAt: now,
        updatedAt: now
      }
      
      // Remove undefined fields
      Object.keys(cleanTransactionData).forEach(key => {
        if (cleanTransactionData[key as keyof typeof cleanTransactionData] === undefined) {
          delete cleanTransactionData[key as keyof typeof cleanTransactionData]
        }
      })
      
      const transactionRef = await addDoc(collection(db, 'transactions'), cleanTransactionData)
      
      // If voucher was used, record the usage
      if (transactionData.voucherCode && transactionData.discountAmount && transactionData.discountAmount > 0) {
        const voucher = await this.getVoucherByCode(transactionData.voucherCode)
        if (voucher) {
          await this.useVoucher(voucher.id, transactionData.userId, transactionRef.id, transactionData.discountAmount)
        }
      }
      
      return transactionRef.id
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  static async getTransactions(status?: TransactionStatus): Promise<Transaction[]> {
    try {
      let q = query(collection(db, 'transactions'))
      
      if (status) {
        q = query(collection(db, 'transactions'), where('status', '==', status))
      }

      const snapshot = await getDocs(q)
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction))
      
      // Sort by createdAt descending on client side
      return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error('Error getting transactions:', error)
      throw error
    }
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'), 
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction))
      
      // Sort by createdAt descending on client side
      return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
          // Calculate expiration date based on planType
          const now = new Date()
          let expirationDate: Date
          
          // Handle planType: yearly, monthly, or missing field (default to monthly)
          if (transactionData.planType === 'yearly') {
            // Yearly plan - 365 days
            expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
          } else {
            // Monthly plan, missing planType field, or any other value (default to monthly) - 30 days
            expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          }
          
          await this.updateUser(transactionData.userId, { 
            tier: 'gold',
            goldExpiresAt: expirationDate.toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error updating transaction status:', error)
      throw error
    }
  }

  // Rating methods
  static async updateBookingRating(bookingId: string, rating: number, comment: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        rating,
        ratingComment: comment,
        ratedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating booking rating:', error)
      throw error
    }
  }

  static async getBookingRating(bookingId: string): Promise<{ rating?: number; ratingComment?: string; ratedAt?: string } | null> {
    try {
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId))
      if (bookingDoc.exists()) {
        const data = bookingDoc.data()
        return {
          rating: data.rating,
          ratingComment: data.ratingComment,
          ratedAt: data.ratedAt
        }
      }
      return null
    } catch (error) {
      console.error('Error getting booking rating:', error)
      throw error
    }
  }

  static async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
      return bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking))
    } catch (error) {
      console.error('Error getting all bookings:', error)
      throw error
    }
  }

  // Conversation operations
  static async createConversation(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    try {
      const docRef = await addDoc(collection(db, 'conversations'), {
        ...conversation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  }

  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        messages: doc.data().messages?.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)
        })) || [],
      } as Conversation))
      
      // Sort by updatedAt in JavaScript to avoid index requirement
      return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    } catch (error) {
      console.error('Error getting user conversations:', error)
      throw error
    }
  }

  static async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId))
      if (conversationDoc.exists()) {
        const data = conversationDoc.data()
        return {
          id: conversationDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          messages: data.messages?.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)
          })) || [],
        } as Conversation
      }
      return null
    } catch (error) {
      console.error('Error getting conversation:', error)
      throw error
    }
  }

  static async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId)
      await updateDoc(conversationRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating conversation:', error)
      throw error
    }
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId))
    } catch (error) {
      console.error('Error deleting conversation:', error)
      throw error
    }
  }

  // Voucher operations
  static async createVoucher(voucherData: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<string> {
    try {
      const now = new Date().toISOString()
      const voucherRef = await addDoc(collection(db, 'vouchers'), {
        ...voucherData,
        usedCount: 0,
        createdAt: now,
        updatedAt: now
      })
      return voucherRef.id
    } catch (error) {
      console.error('Error creating voucher:', error)
      throw error
    }
  }

  static async getVouchers(): Promise<Voucher[]> {
    try {
      const snapshot = await getDocs(collection(db, 'vouchers'))
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Voucher))
    } catch (error) {
      console.error('Error getting vouchers:', error)
      return []
    }
  }

  static async getVoucherByCode(code: string): Promise<Voucher | null> {
    try {
      const q = query(
        collection(db, 'vouchers'),
        where('code', '==', code.toUpperCase())
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as Voucher
    } catch (error) {
      console.error('Error getting voucher by code:', error)
      return null
    }
  }

  static async updateVoucher(voucherId: string, updates: Partial<Voucher>): Promise<void> {
    try {
      await updateDoc(doc(db, 'vouchers', voucherId), {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating voucher:', error)
      throw error
    }
  }

  static async deleteVoucher(voucherId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'vouchers', voucherId))
    } catch (error) {
      console.error('Error deleting voucher:', error)
      throw error
    }
  }

  static async validateVoucher(code: string, orderAmount: number): Promise<{
    isValid: boolean
    voucher?: Voucher
    discountAmount?: number
    error?: string
  }> {
    try {
      const voucher = await this.getVoucherByCode(code)
      
      if (!voucher) {
        return { isValid: false, error: 'Mã voucher không tồn tại' }
      }

      const now = new Date()
      const validFrom = new Date(voucher.validFrom)
      const validTo = new Date(voucher.validTo)

      // Check if voucher is active
      if (voucher.status !== 'active') {
        return { isValid: false, error: 'Mã voucher không còn hoạt động' }
      }

      // Check if voucher is within valid date range
      if (now < validFrom || now > validTo) {
        return { isValid: false, error: 'Mã voucher đã hết hạn' }
      }

      // Check usage limit
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        return { isValid: false, error: 'Mã voucher đã hết lượt sử dụng' }
      }

      // Check minimum order amount
      if (voucher.minOrderAmount && orderAmount < voucher.minOrderAmount) {
        return { isValid: false, error: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')} VNĐ` }
      }

      // Calculate discount amount
      let discountAmount = 0
      if (voucher.type === 'percentage') {
        discountAmount = (orderAmount * voucher.value) / 100
        if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
          discountAmount = voucher.maxDiscountAmount
        }
      } else {
        discountAmount = voucher.value
      }

      // Ensure discount doesn't exceed order amount
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount
      }

      return {
        isValid: true,
        voucher,
        discountAmount: Math.round(discountAmount)
      }
    } catch (error) {
      console.error('Error validating voucher:', error)
      return { isValid: false, error: 'Lỗi hệ thống khi kiểm tra voucher' }
    }
  }

  static async useVoucher(voucherId: string, userId: string, transactionId: string, discountAmount: number): Promise<void> {
    try {
      // Update voucher usage count
      const voucherRef = doc(db, 'vouchers', voucherId)
      await updateDoc(voucherRef, {
        usedCount: increment(1),
        updatedAt: new Date().toISOString()
      })

      // Record voucher usage
      await addDoc(collection(db, 'voucher_usage'), {
        voucherId,
        userId,
        transactionId,
        discountAmount,
        usedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error using voucher:', error)
      throw error
    }
  }

  static async getVoucherUsage(voucherId: string): Promise<VoucherUsage[]> {
    try {
      const q = query(
        collection(db, 'voucher_usage'),
        where('voucherId', '==', voucherId)
      )
      const snapshot = await getDocs(q)
      const usage = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VoucherUsage))
      
      // Sort by usedAt descending on client side
      return usage.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
    } catch (error) {
      console.error('Error getting voucher usage:', error)
      return []
    }
  }
}