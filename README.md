# EmoCare - Ứng dụng Chăm sóc Sức khỏe Tâm lý

Ứng dụng web chăm sóc sức khỏe tâm lý với tích hợp chatbot, hệ thống đặt lịch bác sĩ tâm lý, và theo dõi cảm xúc.

## Công nghệ sử dụng

- **React** (Create React App) - Framework UI
- **TypeScript** - Type safety
- **React Router** - Routing
- **Firebase Authentication** - Xác thực người dùng
- **Cloud Firestore** - Database
- **Recharts** - Biểu đồ và visualization
- **Tailwind CSS** - Styling

## Cài đặt

1. Clone repository:
\`\`\`bash
git clone <repository-url>
cd emocare-mental-health
\`\`\`

2. Cài đặt dependencies:
\`\`\`bash
npm install
\`\`\`

3. Cấu hình Firebase:
   - Tạo project trên [Firebase Console](https://console.firebase.google.com/)
   - Copy Firebase config vào file \`.env\` (xem \`.env.example\`)
   - Xem chi tiết trong \`FIREBASE_SETUP.md\`

4. Chạy ứng dụng:
\`\`\`bash
npm start
\`\`\`

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Scripts

- \`npm start\` - Chạy app ở development mode
- \`npm test\` - Chạy test suite
- \`npm run build\` - Build app cho production
- \`npm run eject\` - Eject từ Create React App (không thể hoàn tác)

## Cấu trúc Project

\`\`\`
src/
├── components/        # React components
│   ├── admin/        # Admin dashboard components
│   ├── auth/         # Authentication components
│   ├── booking/      # Booking system components
│   ├── chatbot/      # Chatbot interface
│   └── user/         # User dashboard components
├── contexts/         # React contexts (Auth, etc.)
├── lib/             # Utilities and services
│   ├── firebase/    # Firebase configuration
│   └── api-client.ts
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── auth/        # Login/Register
│   ├── dashboard/   # User dashboard
│   └── psychologist/ # Psychologist pages
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── index.tsx        # Entry point
\`\`\`

## Tính năng

### 3 Vai trò người dùng:
1. **Admin** - Xem thống kê và phân tích
2. **User** (Free & Gold) - Theo dõi cảm xúc, chatbot, đặt lịch
3. **Psychologist** - Quản lý lịch hẹn và chat với bệnh nhân

### Tính năng chính:
- ✅ Xác thực với Firebase Authentication
- ✅ Theo dõi cảm xúc hàng ngày (slider 1-5)
- ✅ Dashboard với biểu đồ thống kê
- ✅ Chatbot AI (2 tiers: Free & Gold)
- ✅ Hệ thống đặt lịch bác sĩ tâm lý
- ✅ Nhật ký cá nhân
- ✅ Admin analytics dashboard

## License

MIT
\`\`\`
