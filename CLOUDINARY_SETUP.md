# Cloudinary Setup Guide

## 1. Tạo tài khoản Cloudinary
- Truy cập https://cloudinary.com
- Đăng ký tài khoản miễn phí
- Lấy thông tin từ Dashboard

## 2. Tạo file .env trong root project
```bash
# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
REACT_APP_CLOUDINARY_UPLOAD_PRESET=emocare_uploads
REACT_APP_CLOUDINARY_API_KEY=your_api_key_here
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret_here
```

## 3. Cấu hình Upload Preset
1. Vào Cloudinary Dashboard
2. Chọn "Settings" > "Upload"
3. Scroll xuống "Upload presets"
4. Click "Add upload preset"
5. Đặt tên: `emocare_uploads`
6. Chọn "Unsigned" (không cần API key)
7. Save preset

## 4. Lấy thông tin từ Dashboard
- **Cloud Name**: Hiển thị ở góc trên Dashboard
- **API Key**: Settings > Security
- **API Secret**: Settings > Security

## 5. Cập nhật .env với thông tin thực
```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=emocare_uploads
REACT_APP_CLOUDINARY_API_KEY=your_actual_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 6. Restart development server
```bash
npm start
```

## Lưu ý:
- File .env không được commit vào git
- Upload preset phải được set là "Unsigned" để upload không cần API key
- Chỉ cần Cloud Name và Upload Preset cho upload từ frontend
