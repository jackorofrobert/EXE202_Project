# Firebase Setup Guide

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" hoặc "Thêm dự án"
3. Nhập tên project: `emocare-mental-health`
4. Tắt Google Analytics (không bắt buộc)
5. Click "Create project"

## Bước 2: Đăng ký Web App

1. Trong Firebase Console, click vào biểu tượng Web `</>`
2. Nhập tên app: `EmoCare Web`
3. Click "Register app"
4. Copy các thông tin Firebase config

## Bước 3: Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục root của project
2. Copy nội dung từ `.env.example`
3. Điền các giá trị từ Firebase config vào file `.env`:

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=emocare-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=emocare-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=emocare-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
\`\`\`

## Bước 4: Kích hoạt Firebase Authentication

1. Trong Firebase Console, vào **Authentication**
2. Click "Get started"
3. Chọn tab "Sign-in method"
4. Enable **Email/Password**
5. Click "Save"

## Bước 5: Tạo Firestore Database

1. Trong Firebase Console, vào **Firestore Database**
2. Click "Create database"
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần nhất (ví dụ: `asia-southeast1`)
5. Click "Enable"

## Bước 6: Cấu hình Firestore Security Rules

Vào tab **Rules** trong Firestore và thay thế bằng rules sau:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Emotions collection
    match /emotions/{emotionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Diary entries collection
    match /diary/{diaryId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.psychologistId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.psychologistId == request.auth.uid);
    }
    
    // Chat messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      allow create: if request.auth != null;
    }
    
    // Psychologists collection (public read)
    match /psychologists/{psychologistId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
\`\`\`

## Bước 7: Cài đặt Dependencies

\`\`\`bash
npm install
\`\`\`

## Bước 8: Chạy Development Server

\`\`\`bash
npm run dev
\`\`\`

## Cấu trúc Firestore Collections

### users
\`\`\`
{
  id: string (auto-generated)
  email: string
  name: string
  role: "user" | "admin" | "psychologist"
  tier: "free" | "gold"
  createdAt: string
}
\`\`\`

### emotions
\`\`\`
{
  id: string (auto-generated)
  userId: string
  level: number (1-5)
  note?: string
  createdAt: timestamp
}
\`\`\`

### diary
\`\`\`
{
  id: string (auto-generated)
  userId: string
  title: string
  content: string
  mood: string
  createdAt: timestamp
}
\`\`\`

### bookings
\`\`\`
{
  id: string (auto-generated)
  userId: string
  psychologistId: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  createdAt: timestamp
}
\`\`\`

### messages
\`\`\`
{
  id: string (auto-generated)
  senderId: string
  receiverId: string
  content: string
  createdAt: timestamp
  read: boolean
}
\`\`\`

### psychologists
\`\`\`
{
  id: string (auto-generated)
  name: string
  specialty: string
  experience: number
  rating: number
  avatar: string
  bio: string
  price: number
}
\`\`\`

## Lưu ý bảo mật

- **KHÔNG** commit file `.env` vào Git
- File `.env` đã được thêm vào `.gitignore`
- Khi deploy production, thay đổi Firestore rules từ test mode sang production mode
- Sử dụng Firebase App Check để bảo vệ backend resources
