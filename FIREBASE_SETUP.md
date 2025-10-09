# Firebase Setup Guide

## Environment Variables

Tạo file `.env.local` trong root directory với các biến sau:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Firebase Project Setup

1. **Tạo Firebase Project**:
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Enable Authentication và Firestore Database

2. **Authentication Setup**:
   - Vào Authentication > Sign-in method
   - Enable Email/Password provider
   - (Optional) Enable Google, Facebook, etc.

3. **Firestore Database Setup**:
   - Vào Firestore Database
   - Tạo database (chọn production mode)
   - Thiết lập security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Emotion entries - users can only access their own
    match /emotion_entries/{entryId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Diary entries - users can only access their own
    match /diary_entries/{entryId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Bookings - users can access their own bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.psychologistId == request.auth.uid);
    }
    
    // Psychologists - public read access
    match /psychologists/{psychologistId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == psychologistId;
    }
    
    // Chat messages - users can access their conversations
    match /chat_messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
    }
  }
}
```

## Firestore Collections Structure

### Users Collection
```javascript
users/{userId} {
  id: string,
  email: string,
  name: string,
  role: "admin" | "user" | "psychologist",
  tier?: "free" | "gold",
  avatar?: string,
  createdAt: timestamp
}
```

### Emotion Entries Collection
```javascript
emotion_entries/{entryId} {
  id: string,
  userId: string,
  level: 1 | 2 | 3 | 4 | 5,
  note?: string,
  createdAt: timestamp
}
```

### Diary Entries Collection
```javascript
diary_entries/{entryId} {
  id: string,
  userId: string,
  title: string,
  content: string,
  mood: 1 | 2 | 3 | 4 | 5,
  createdAt: timestamp
}
```

### Bookings Collection
```javascript
bookings/{bookingId} {
  id: string,
  userId: string,
  psychologistId: string,
  date: string,
  time: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  notes?: string,
  createdAt: timestamp
}
```

### Psychologists Collection
```javascript
psychologists/{psychologistId} {
  id: string,
  name: string,
  email: string,
  specialization: string,
  experience: number,
  rating: number,
  avatar: string,
  bio: string,
  available: boolean
}
```

### Chat Messages Collection
```javascript
chat_messages/{messageId} {
  id: string,
  conversationId: string,
  senderId: string,
  receiverId: string,
  message: string,
  type: "user" | "bot" | "psychologist",
  createdAt: timestamp,
  read: boolean
}
```

## Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Test authentication**:
   - Register a new user
   - Login with existing user
   - Test role-based access

## Migration Notes

- Đã loại bỏ hoàn toàn Supabase dependencies
- Tất cả database operations giờ sử dụng Firestore
- Authentication chỉ sử dụng Firebase Auth
- Không cần SQL migrations vì Firestore là NoSQL
- Data structure đã được tối ưu cho Firestore