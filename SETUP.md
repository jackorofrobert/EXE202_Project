# EmoCare - Complete Setup Guide

Hướng dẫn cài đặt đầy đủ cho ứng dụng EmoCare với tất cả các dịch vụ cần thiết.

## 📋 Mục lục

1. [Environment Variables](#environment-variables)
2. [Firebase Setup](#firebase-setup)
3. [Firestore Database](#firestore-database)
4. [Cloudinary Setup](#cloudinary-setup)
5. [Gemini AI Setup](#gemini-ai-setup)
6. [Firestore Indexes](#firestore-indexes)
7. [Testing](#testing)

---

## 🔧 Environment Variables

Tạo file `.env` trong thư mục root với các biến sau:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Gemini AI Configuration
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_AI_MODEL=gemini-flash-latest
```

---

## 🔥 Firebase Setup

### 1. Tạo Firebase Project

1. **Truy cập Firebase Console**:
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Enable Authentication và Firestore Database

2. **Lấy Firebase Config**:
   - Vào Project Settings > General
   - Scroll xuống "Your apps" > Web app
   - Copy config object và paste vào file `.env`

### 2. Authentication Setup

1. **Vào Authentication > Sign-in method**
2. **Enable Email/Password provider**
3. **Optional**: Enable Google, Facebook, etc.

### 3. Firestore Database Setup

1. **Vào Firestore Database**
2. **Tạo database** (chọn production mode)
3. **Thiết lập security rules**:

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
    
    // Conversations - users can access their own conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🗄️ Firestore Database

### Collections Structure

#### Users Collection
```javascript
users/{userId} {
  id: string,
  email: string,
  name: string,
  role: "admin" | "user" | "psychologist",
  tier?: "free" | "gold",
  avatar?: string,
  goldExpiresAt?: string,
  createdAt: timestamp
}
```

#### Emotion Entries Collection
```javascript
emotion_entries/{entryId} {
  id: string,
  userId: string,
  level: 1 | 2 | 3 | 4 | 5,
  note?: string,
  createdAt: timestamp
}
```

#### Diary Entries Collection
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

#### Bookings Collection
```javascript
bookings/{bookingId} {
  id: string,
  userId: string,
  psychologistId: string,
  date: string,
  time: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  notes?: string,
  rating?: number,
  ratingComment?: string,
  ratedAt?: timestamp,
  createdAt: timestamp
}
```

#### Psychologists Collection
```javascript
psychologists/{psychologistId} {
  id: string,
  name: string,
  email: string,
  specialization: string,
  experience: number,
  rating: number,
  totalRatings: number,
  avatar: string,
  bio: string,
  available: boolean
}
```

#### Chat Messages Collection
```javascript
chat_messages/{messageId} {
  id: string,
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
  type: "user" | "psychologist",
  createdAt: timestamp,
  read: boolean
}
```

#### Conversations Collection (Gemini AI)
```javascript
conversations/{conversationId} {
  id: string,
  userId: string,
  title: string,
  messages: [
    {
      id: string,
      role: "user" | "assistant",
      content: string,
      timestamp: Date
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## ☁️ Cloudinary Setup

### 1. Tạo tài khoản Cloudinary

1. **Truy cập**: https://cloudinary.com
2. **Đăng ký** tài khoản miễn phí
3. **Lấy thông tin** từ Dashboard

### 2. Cấu hình Upload Preset

1. **Vào Cloudinary Dashboard**
2. **Chọn "Settings" > "Upload"**
3. **Scroll xuống "Upload presets"**
4. **Click "Add upload preset"**
5. **Đặt tên**: `emocare_uploads`
6. **Chọn "Unsigned"** (không cần API key)
7. **Save preset**

### 3. Lấy thông tin từ Dashboard

- **Cloud Name**: Hiển thị ở góc trên Dashboard
- **API Key**: Settings > Security
- **API Secret**: Settings > Security

### 4. Cập nhật .env

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=emocare_uploads
```

### 5. Restart development server

```bash
npm start
```

---

## 🤖 Gemini AI Setup

### 1. Lấy Gemini API Key

1. **Truy cập**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Đăng nhập** với Google account
3. **Click "Create API Key"**
4. **Copy API key** và paste vào file `.env`

### 2. Cập nhật .env

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_AI_MODEL=gemini-flash-latest
```

### 3. Restart ứng dụng

```bash
npm start
```

### 4. Cấu hình AI Model (Tùy chọn)

Các model AI có sẵn:
- `gemini-flash-latest` (Mặc định) - Nhanh nhất, phù hợp cho chat
- `gemini-1.5-flash` - Cân bằng tốc độ và chất lượng
- `gemini-pro` - Chất lượng cao nhất, chậm hơn

Thay đổi model trong file `.env`:
```env
REACT_APP_AI_MODEL=gemini-pro
```

### 5. System Prompts

Ứng dụng sử dụng các system prompts khác nhau tùy theo context:
- **Main**: Tư vấn tâm lý chuyên nghiệp
- **Free**: Gợi ý địa điểm và hoạt động
- **Crisis**: Hỗ trợ khủng hoảng tâm lý
- **Wellness**: Lời khuyên về lối sống lành mạnh

System prompts được tự động chọn dựa trên nội dung tin nhắn và tier người dùng.

---

## 📊 Firestore Indexes

### Lỗi Index và Cách Khắc Phục

#### ❌ Lỗi hiện tại:
```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/freelance-bs/firestore/indexes?create_composite=...
```

**Lỗi Conversations Index:**
```
Error getting user conversations: FirebaseError: The query requires an index
```

**Lỗi Gemini API:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent 404 (Not Found)
```

#### ✅ Giải pháp:

**Cách 1: Code đã được tối ưu (Đã áp dụng)**

Code đã được cập nhật để:
- ✅ Loại bỏ `orderBy` trong query conversations
- ✅ Sort trong JavaScript thay vì Firestore
- ✅ Thêm retry logic cho conversation not found
- ✅ Fallback error handling
- ✅ Vẫn giữ real-time functionality
- ✅ Sửa Gemini API model name từ `gemini-1.5-flash-latest` thành `gemini-1.5-flash`
- ✅ Sử dụng `systemInstruction` đúng cách cho Gemini API

**Cách 2: Tạo Index (Tùy chọn để tối ưu performance)**

1. **Truy cập link tự động**:
   - Click vào link trong error message
   - Firebase sẽ tự động tạo index cần thiết

2. **Tạo manual**:
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Chọn project của bạn
   - Vào **Firestore Database** → **Indexes**
   - Click **Create Index**

**Các Index cần tạo:**

#### 1. Chat Messages - Conversation Index
```json
{
  "collectionGroup": "chat_messages",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "conversationId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "ASCENDING"
    }
  ]
}
```

#### 2. Chat Messages - Receiver Index
```json
{
  "collectionGroup": "chat_messages",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "receiverId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    }
  ]
}
```

#### 3. Conversations - User Index
```json
{
  "collectionGroup": "conversations",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "userId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "updatedAt",
      "order": "DESCENDING"
    }
  ]
}
```

### 🚀 Sau khi tạo Index:

1. **Index sẽ được build** (có thể mất vài phút)
2. **Real-time queries sẽ hoạt động** với `orderBy`
3. **Performance sẽ tốt hơn** cho large datasets

### 💡 Lưu ý:

- **Free tier**: Có giới hạn số index
- **Paid tier**: Không giới hạn index
- **Index cost**: Mỗi index tốn storage và compute
- **Best practice**: Chỉ tạo index khi thực sự cần

### 🔧 **Code đã được tối ưu:**

#### Conversations Query:
```typescript
// Trước (cần index):
const q = query(
  collection(db, 'conversations'),
  where('userId', '==', userId),
  orderBy('updatedAt', 'desc') // ← Cần composite index
)

// Sau (không cần index):
const q = query(
  collection(db, 'conversations'),
  where('userId', '==', userId) // ← Chỉ cần single field index
)

// Sort trong JavaScript:
conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
```

#### Chat Messages Query:
```typescript
// Trước (cần index):
const q = query(
  collection(db, 'chat_messages'),
  where('conversationId', '==', conversationId),
  orderBy('createdAt', 'asc') // ← Cần index
)

// Sau (không cần index):
const q = query(
  collection(db, 'chat_messages'),
  where('conversationId', '==', conversationId) // ← Chỉ cần single field index
)

// Sort trong JavaScript:
messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
```

#### Retry Logic cho Conversations:
```typescript
// Thêm retry logic cho conversation not found
let conversation = await this.getConversation(conversationId);
if (!conversation) {
  // Wait a bit and try again (for newly created conversations)
  await new Promise(resolve => setTimeout(resolve, 500));
  conversation = await this.getConversation(conversationId);
}
```

---

## 🧪 Testing

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

### 3. Test các tính năng

#### Authentication:
- ✅ Register a new user
- ✅ Login with existing user
- ✅ Test role-based access
- ✅ Test password reset
- ✅ Test change password

#### Emotion Tracking:
- ✅ Add emotion entry
- ✅ View emotion history
- ✅ Test emotion skip functionality

#### Chatbot AI:
- ✅ Test free tier chatbot
- ✅ Test gold tier Gemini AI
- ✅ Test conversation management
- ✅ Test create/delete conversations

#### Booking System:
- ✅ View psychologists
- ✅ Create booking
- ✅ Manage appointments

#### File Upload:
- ✅ Upload avatar image
- ✅ Test Cloudinary integration

---

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables for Production

Đảm bảo tất cả biến môi trường được cấu hình đúng trong production environment.

### Firebase Hosting (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **Firebase connection error**:
   - Kiểm tra API key trong `.env`
   - Đảm bảo project ID đúng

2. **Cloudinary upload fails**:
   - Kiểm tra Cloud Name và Upload Preset
   - Đảm bảo preset được set là "Unsigned"

3. **Gemini API error**:
   - Kiểm tra API key có quyền truy cập Gemini
   - Kiểm tra quota và billing

4. **Firestore index error**:
   - Tạo index theo hướng dẫn trên
   - Hoặc sử dụng code đã tối ưu (không cần index)

### Support:

Nếu có vấn đề, vui lòng tạo issue trên GitHub repository với:
- Error message đầy đủ
- Steps to reproduce
- Environment details

---

**EmoCare** - Chăm sóc sức khỏe tâm lý của bạn một cách toàn diện và hiện đại 💚
