# 🔥 Landing Page + Admin Tool với Firebase

Hệ thống quản lý nội dung landing page đơn giản sử dụng Firebase Firestore và Storage.

## 📋 Tính năng

### Landing Page (index.html)
- ✅ Load động toàn bộ text và images từ Firebase Firestore
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Các sections: Hero, About, Services, Portfolio, Contact
- ✅ Tự động cập nhật khi admin thay đổi nội dung

### Admin Tool (admin.html)
- ✅ Đăng nhập với Firebase Authentication
- ✅ Giao diện CRUD để chỉnh sửa text
- ✅ Upload và quản lý hình ảnh lên Firebase Storage
- ✅ Preview realtime trước khi save
- ✅ Lưu trữ dữ liệu vào Firestore

## 🚀 Hướng dẫn Setup

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** hoặc **"Tạo dự án"**
3. Đặt tên project (ví dụ: `my-landing-page`)
4. Bật Google Analytics (tùy chọn)
5. Click **"Create project"**

### Bước 2: Cấu hình Firebase Authentication

1. Trong Firebase Console, chọn **Authentication** từ menu bên trái
2. Click tab **"Sign-in method"**
3. Bật **Email/Password** provider
4. Click **"Save"**
5. Chuyển sang tab **"Users"**
6. Click **"Add user"** để tạo tài khoản admin:
   - Email: `admin@example.com` (hoặc email của bạn)
   - Password: `Admin@123` (hoặc mật khẩu của bạn)
7. Click **"Add user"**

### Bước 3: Cấu hình Firestore Database

1. Trong Firebase Console, chọn **Firestore Database**
2. Click **"Create database"**
3. Chọn **"Start in test mode"** (cho development)
4. Chọn location gần nhất (ví dụ: `asia-southeast1`)
5. Click **"Enable"**

**⚠️ Lưu ý về Rules (Production):**
Sau khi test xong, thay đổi Firestore Rules để bảo mật:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /landing_page/{document=**} {
      allow read: if true; // Ai cũng đọc được
      allow write: if request.auth != null; // Chỉ user đã đăng nhập mới ghi được
    }
  }
}
```

### Bước 4: Cấu hình Firebase Storage

1. Trong Firebase Console, chọn **Storage**
2. Click **"Get started"**
3. Chọn **"Start in test mode"**
4. Chọn location giống Firestore
5. Click **"Done"**

**⚠️ Lưu ý về Rules (Production):**
Sau khi test xong, thay đổi Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /landing_page/{allPaths=**} {
      allow read: if true; // Ai cũng đọc được
      allow write: if request.auth != null; // Chỉ user đã đăng nhập mới upload được
    }
  }
}
```

### Bước 5: Lấy Firebase Config

1. Trong Firebase Console, click vào icon **⚙️ (Settings)** > **Project settings**
2. Scroll xuống phần **"Your apps"**
3. Click vào icon **</>** (Web) để thêm web app
4. Đặt nickname cho app (ví dụ: `Landing Page`)
5. **KHÔNG** check vào "Also set up Firebase Hosting"
6. Click **"Register app"**
7. Copy đoạn code `firebaseConfig` (sẽ trông như này):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Bước 6: Cấu hình Project

1. Mở file `js/firebase-config.js`
2. Thay thế đoạn `firebaseConfig` bằng config bạn vừa copy
3. Save file

### Bước 7: Khởi tạo dữ liệu mẫu

1. Mở file `admin.html` bằng trình duyệt (hoặc dùng Live Server trong VSCode)
2. Đăng nhập với email và password đã tạo ở Bước 2
3. Hệ thống sẽ tự động tạo dữ liệu mẫu nếu chưa có
4. Bạn có thể chỉnh sửa text và upload hình ảnh mới

### Bước 8: Xem Landing Page

1. Mở file `index.html` bằng trình duyệt
2. Landing page sẽ tự động load nội dung từ Firebase

## 📁 Cấu trúc Project

```
/phulong/
├── index.html          # Landing page (public)
├── admin.html          # Admin tool (cần đăng nhập)
├── css/
│   ├── style.css       # CSS cho landing page
│   └── admin.css       # CSS cho admin tool
├── js/
│   ├── firebase-config.js   # Cấu hình Firebase
│   ├── landing.js           # Logic cho landing page
│   └── admin.js             # Logic cho admin tool
├── images/             # Hình ảnh mẫu
└── README.md           # File này
```

## 🔧 Sử dụng

### Landing Page
- Mở `index.html` - Không cần đăng nhập
- Tất cả nội dung được load từ Firebase
- Tự động responsive trên mọi thiết bị

### Admin Tool
1. Mở `admin.html`
2. Đăng nhập với email/password
3. Chỉnh sửa text trong các ô input/textarea
4. Upload hình ảnh mới (nếu muốn)
5. Click **"Save All Changes"** để lưu

## 🔒 Bảo mật

### Môi trường Development (Test mode)
- Rules hiện tại cho phép tất cả mọi người đọc/ghi
- **CHỈ dùng cho development!**

### Môi trường Production
Nhớ cập nhật Firestore và Storage Rules như đã hướng dẫn ở Bước 3 và 4.

## 🐛 Troubleshooting

### Lỗi: "Firebase: Error (auth/...)"
- Kiểm tra lại email/password
- Đảm bảo đã enable Email/Password authentication trong Firebase Console

### Lỗi: "Missing or insufficient permissions"
- Kiểm tra Firestore Rules
- Đảm bảo bạn đã đăng nhập (cho admin.html)

### Lỗi: CORS hoặc "file://"
- Không thể mở trực tiếp file HTML (file://)
- Sử dụng Live Server trong VSCode hoặc `python -m http.server`

### Landing page không hiển thị nội dung
- Kiểm tra Console (F12) xem có lỗi không
- Đảm bảo đã khởi tạo dữ liệu từ admin tool
- Kiểm tra Firebase Config đã đúng chưa

## 📝 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase (Firestore + Storage + Auth)
- **Firebase SDK**: v9+ (modular)

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console log (F12 trong trình duyệt)
2. Firebase Console > Firestore > Data
3. Firebase Console > Storage > Files
4. Network tab để xem request/response

---

**Made with ❤️ using Firebase**
