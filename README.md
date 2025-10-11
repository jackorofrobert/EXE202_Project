# EmoCare - Ứng dụng Chăm sóc Sức khỏe Tâm lý

Ứng dụng web toàn diện cho chăm sóc sức khỏe tâm lý với tích hợp AI chatbot, hệ thống đặt lịch bác sĩ tâm lý, theo dõi cảm xúc và quản lý tài khoản.

## 🚀 Công nghệ sử dụng

- **React 18** (Create React App) - Framework UI hiện đại
- **TypeScript** - Type safety và developer experience tốt hơn
- **React Router v6** - Client-side routing
- **Firebase Authentication** - Xác thực người dùng an toàn
- **Cloud Firestore** - NoSQL database real-time
- **Recharts** - Biểu đồ và data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Radix UI** - Accessible UI components

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd emocare-mental-health
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
pnpm install
```

### 3. Cấu hình Firebase
- Tạo project trên [Firebase Console](https://console.firebase.google.com/)
- Bật Authentication với Email/Password
- Tạo Firestore database
- Copy Firebase config vào file `.env` (xem `.env.example`)
- Xem chi tiết trong `FIREBASE_SETUP.md`

### 4. Cấu hình Firestore Indexes
- Xem `FIRESTORE_INDEX_SETUP.md` để cấu hình indexes cần thiết

### 5. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts

- `npm start` - Chạy app ở development mode
- `npm test` - Chạy test suite
- `npm run build` - Build app cho production
- `npm run eject` - Eject từ Create React App (không thể hoàn tác)

## 📁 Cấu trúc Project

```
src/
├── components/           # React components
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   ├── booking/         # Booking system components
│   ├── chatbot/         # Chatbot interface
│   ├── layout/          # Layout components
│   ├── psychologist/     # Psychologist components
│   ├── ui/              # Reusable UI components
│   └── user/            # User dashboard components
├── contexts/            # React contexts (Auth, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and services
│   ├── firebase/       # Firebase configuration & services
│   ├── api/            # API client & endpoints
│   └── utils.ts        # Utility functions
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Login/Register/Forgot Password
│   ├── dashboard/      # User dashboard pages
│   ├── psychologist/   # Psychologist dashboard pages
│   └── landing.tsx     # Landing page
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## 👥 Vai trò người dùng

### 1. **User (Người dùng)**
- **Free Tier**: Theo dõi cảm xúc, chatbot cơ bản
- **Gold Tier**: Chatbot AI nâng cao, đặt lịch bác sĩ, chat trực tiếp

### 2. **Psychologist (Bác sĩ tâm lý)**
- Quản lý lịch hẹn với bệnh nhân
- Chat trực tiếp với bệnh nhân
- Quản lý hồ sơ cá nhân và chuyên môn
- Xem đánh giá từ bệnh nhân

### 3. **Admin (Quản trị viên)**
- Dashboard thống kê tổng quan
- Quản lý người dùng và bác sĩ
- Xem analytics và trends
- Quản lý giao dịch và ratings

## ✨ Tính năng chính

### 🔐 Xác thực & Bảo mật
- ✅ Đăng ký/Đăng nhập với Firebase Auth
- ✅ **Quên mật khẩu** - Gửi email reset
- ✅ **Thay đổi mật khẩu** - Cho tất cả vai trò
- ✅ Protected routes theo vai trò
- ✅ Session management

### 📊 Theo dõi Cảm xúc
- ✅ Kiểm tra cảm xúc hàng ngày (1-5 scale)
- ✅ **Bỏ qua thông minh** - Không hiện lại trong ngày
- ✅ Biểu đồ thống kê cảm xúc theo thời gian
- ✅ Tính streak liên tiếp
- ✅ Nhật ký cảm xúc với ghi chú

### 🤖 Chatbot AI với Gemini
- ✅ **Free Tier**: Chatbot cơ bản với gợi ý địa điểm
- ✅ **Gold Tier**: Chatbot AI Gemini với system prompt chuyên nghiệp
- ✅ **Conversation Management**: Lưu và quản lý các cuộc trò chuyện
- ✅ **Tạo cuộc trò chuyện mới**: Mỗi lần hỏi tạo section riêng
- ✅ **Xem và xóa**: Quản lý conversation history
- ✅ **Giới hạn thông minh**: Tự động cleanup conversations cũ
- ✅ Suggestion chips cho câu hỏi thường gặp
- ✅ Upgrade prompt cho free users

### 📅 Hệ thống Đặt lịch
- ✅ Xem danh sách bác sĩ tâm lý
- ✅ Đặt lịch theo khung giờ có sẵn
- ✅ Quản lý lịch hẹn (User & Psychologist)
- ✅ Calendar view và list view
- ✅ Thông báo và reminders

### 💬 Chat trực tiếp
- ✅ Chat real-time giữa User và Psychologist
- ✅ Chỉ dành cho Gold users
- ✅ Quản lý cuộc trò chuyện
- ✅ Unread message count

### 📝 Nhật ký cá nhân
- ✅ Viết và lưu trữ nhật ký
- ✅ Tìm kiếm và filter
- ✅ Privacy và security

### 👤 Quản lý Profile
- ✅ Cập nhật thông tin cá nhân
- ✅ Upload avatar với Cloudinary
- ✅ **Thay đổi mật khẩu** trong profile
- ✅ Quản lý Gold membership

### 📈 Admin Dashboard
- ✅ Analytics tổng quan
- ✅ User growth charts
- ✅ Emotion trends
- ✅ Booking statistics
- ✅ Quản lý users và psychologists
- ✅ Transaction management

### 💳 Thanh toán & Membership
- ✅ Upgrade từ Free lên Gold
- ✅ Payment integration
- ✅ Gold membership benefits
- ✅ Expiration tracking

## 🔧 Tính năng kỹ thuật

### 🎨 UI/UX
- ✅ Responsive design (Mobile-first)
- ✅ Dark/Light theme support
- ✅ Accessible components với Radix UI
- ✅ Smooth animations và transitions
- ✅ Loading states và error handling

### 🔒 Bảo mật
- ✅ Firebase Authentication
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ Input validation và sanitization
- ✅ Secure password management

### 📱 Performance
- ✅ Code splitting và lazy loading
- ✅ Optimized images với Cloudinary
- ✅ Efficient state management
- ✅ Real-time updates với Firestore
- ✅ Caching strategies

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

## 📚 Documentation

- `SETUP.md` - Hướng dẫn cài đặt đầy đủ (Firebase, Cloudinary, Gemini AI, Firestore Indexes)
- `AI_CONFIG_GUIDE.md` - Hướng dẫn cấu hình AI models và system prompts

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**EmoCare** - Chăm sóc sức khỏe tâm lý của bạn một cách toàn diện và hiện đại 💚