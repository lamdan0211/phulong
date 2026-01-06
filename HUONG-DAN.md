# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG CMS ESSENSIA BROADWAY

## 📋 TỔNG QUAN

Hệ thống cho phép quản lý **TOÀN BỘ** nội dung text và hình ảnh của website Essensia Broadway qua giao diện admin đơn giản, không cần code.

### ✨ Tính năng chính:
- ✅ Quản lý text: Tiêu đề, mô tả, thông tin liên hệ, tin tức...
- ✅ Quản lý hình ảnh: Logo, banner, gallery, features... (tổng 150+ hình)
- ✅ Firebase Firestore (hoàn toàn miễn phí)
- ✅ Base64 image storage (không cần Firebase Storage)
- ✅ Tự động load và hiển thị trên website

---

## 🚀 BƯỚC 1: CẤU HÌNH FIREBASE (LẦN ĐẦU)

### 1.1. Tạo tài khoản Firebase
1. Truy cập: https://console.firebase.google.com
2. Đăng nhập bằng Google
3. Dự án đã có sẵn: **phulong-54b1a**

### 1.2. Tạo user admin đầu tiên
1. Vào Firebase Console → **Authentication**
2. Click tab **Users** → **Add user**
3. Nhập:
   - Email: `admin@phulong.com` (hoặc email bất kỳ)
   - Password: `yourpassword123` (tự chọn)
4. Click **Add user**

### 1.3. Thiết lập Firestore Rules (BẢO MẬT)

1. Vào **Firestore Database** → **Rules**
2. Dán rules sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chỉ user đã đăng nhập mới được đọc/ghi
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

---

## 📝 BƯỚC 2: SỬ DỤNG ADMIN PANEL

### 2.1. Mở admin panel
1. Upload tất cả file lên hosting/server
2. Truy cập: `https://your-domain.com/admin.html`
3. Đăng nhập bằng email/password đã tạo ở bước 1.2

### 2.2. Cấu trúc giao diện

Admin có **2 TAB CHÍNH**:

#### ✏️ TAB 1: NỘI DUNG TEXT

Gồm 6 sub-tabs:

1. **🏠 Hero** - Tiêu đề, phụ đề, mô tả trang chủ (3 đoạn)
2. **📍 Vị trí** - Tiêu đề và mô tả vị trí dự án
3. **🏗️ Sản phẩm** - Tiêu đề và mô tả sản phẩm
4. **📰 Tin tức** - Quản lý các bài tin (thêm/xóa/sửa)
5. **📞 Liên hệ** - Hotline, email, địa chỉ
6. **🧩 Tất cả sections** - Chỉnh sửa TOÀN BỘ text theo từng section
   - Tự động map 300+ text elements
   - Hiển thị theo section: head, nav, hero, news, footer...
   - Mỗi field có ghi chú selector để dễ tìm

#### 🖼️ TAB 2: QUẢN LÝ HÌNH ẢNH

Gồm 5 sub-tabs:

1. **🏢 Logos (5)** - Logo Broadway, Phú Long, graphics
2. **🎨 Hero/Banners (6)** - Banner desktop/mobile, hero images
3. **⭐ Features (10)** - Hình tiện ích, đặc quyền, clubhouse
4. **📸 Gallery (20)** - Gallery hình dự án
5. **🧩 Tất cả hình** - Quản lý 150+ hình theo từng section
   - Tự động map theo IMAGE_MAPPINGS
   - Hiển thị preview trước khi upload
   - Giới hạn: **Max 1MB mỗi hình**

### 2.3. Quy trình chỉnh sửa

1. **Đăng nhập** vào admin panel
2. **Chọn tab** tương ứng (Text hoặc Hình ảnh)
3. **Chỉnh sửa** nội dung:
   - Text: Gõ trực tiếp vào ô input/textarea
   - Hình: Click "📁 Chọn hình mới" → Browse file (max 1MB)
4. **Lưu** bằng nút **💾 Lưu tất cả thay đổi**
5. **Kiểm tra** website để xem thay đổi

---

## 🖼️ BƯỚC 3: UPLOAD HÌNH ẢNH

### 3.1. Yêu cầu hình ảnh

- ✅ Định dạng: JPG, PNG, GIF, SVG, WEBP
- ✅ Kích thước: **Tối đa 1MB**
- ⚠️ Nếu hình > 1MB: Nén trước khi upload

### 3.2. Cách nén hình (khuyến nghị)

**Online (miễn phí):**
- https://tinypng.com (PNG, JPG)
- https://compressor.io (tất cả định dạng)
- https://squoosh.app (Google, nhiều tùy chọn)

**Desktop:**
- Photoshop: Save for Web
- GIMP: Export với quality 80-85%

### 3.3. Quy trình upload

1. Vào tab **🖼️ Quản lý Hình ảnh**
2. Chọn sub-tab phù hợp (Logos/Hero/Features/Gallery/Tất cả hình)
3. Tìm hình cần thay (xem label và preview)
4. Click **📁 Chọn hình mới**
5. Chọn file (sẽ auto preview)
6. Status hiển thị "✓ Sẵn sàng lưu"
7. Click **💾 Lưu tất cả thay đổi**

**Lưu ý:** Có thể upload nhiều hình cùng lúc rồi mới Save!

---

## 🔧 BƯỚC 4: XỬ LÝ SỰ CỐ

### 4.1. Không đăng nhập được

**Nguyên nhân:**
- Sai email/password
- Chưa tạo user trong Firebase Authentication

**Giải pháp:**
1. Vào Firebase Console → Authentication → Users
2. Kiểm tra user có tồn tại không
3. Nếu quên password: Delete user → Tạo lại với password mới

### 4.2. Lưu thành công nhưng website không thay đổi

**Nguyên nhân:**
- Browser cache
- Firestore rules chặn đọc dữ liệu

**Giải pháp:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. Kiểm tra Firestore Rules (xem bước 1.3)
3. Mở Console (F12) → Check có lỗi gì không

### 4.3. Upload hình bị báo lỗi "Hình quá lớn"

**Giải pháp:**
- Nén hình xuống < 1MB (xem bước 3.2)
- Hoặc resize hình nhỏ lại

### 4.4. Text bị hiển thị sai / thiếu

**Nguyên nhân:**
- HTML tags trong text
- Selector không match đúng element

**Giải pháp:**
1. Vào tab **🧩 Tất cả sections**
2. Tìm field tương ứng (có ghi selector)
3. Kiểm tra nội dung
4. Nếu cần xuống dòng: Nhấn Enter (tự động convert thành `<br>`)

### 4.5. Hình bị lỗi / không hiển thị

**Nguyên nhân:**
- File không phải hình ảnh
- Hình > 1MB
- Base64 bị corrupt

**Giải pháp:**
1. Upload lại hình (đảm bảo đúng format và < 1MB)
2. Clear browser cache
3. Kiểm tra console có lỗi gì không

---

## 📚 BƯỚC 5: CẤU TRÚC DỮ LIỆU

### 5.1. Firestore Collections

Hệ thống dùng **2 collections**:

#### 1️⃣ `essensia_broadway` (Text content)

```
essensia_broadway/
  └── content/
      ├── hero: { title, subtitle, description1, description2, description3 }
      ├── location: { title, description }
      ├── product: { title, description }
      ├── news: { title, items: [...] }
      ├── contact: { hotline, email, address, projectAddress }
      └── dynamicText: { text_0001: "...", text_0002: "...", ... }
```

#### 2️⃣ `essensia_images` (Image data - Base64)

```
essensia_images/
  └── data/
      ├── logo_broadway: "data:image/png;base64,..."
      ├── banner_desktop: "data:image/png;base64,..."
      ├── clubhouse: "data:image/png;base64,..."
      └── dynamicImages: {
          img_0001: "data:image/...",
          img_0002: "data:image/...",
          ...
      }
```

### 5.2. File mappings

**`js/content-mappings.js`** - Tự động map giữa Firebase và HTML:
- `TEXT_MAPPINGS`: Array 300+ text elements
- `IMAGE_MAPPINGS`: Array 150+ image elements

Mỗi mapping có:
- `key`: ID duy nhất
- `selector`: CSS selector
- `index`: Thứ tự element (nếu có nhiều)
- `section`: Nhóm (head/nav/hero/news...)
- `label`: Mô tả
- `defaultValue`: Giá trị mặc định
- `mode`: Cách apply (text/html/attr/src/background)

---

## 🛠️ CẤU TRÚC FILE

```
phulong/
├── index.html              # Website chính
├── admin.html              # Admin panel (UNIFIED)
├── css/
│   └── admin.css          # Styles cho admin
├── js/
│   ├── firebase-config.js       # Cấu hình Firebase
│   ├── content-mappings.js      # Mappings (auto-generated)
│   ├── admin.js                 # Logic admin panel
│   ├── essensia-loader.js       # Text loader cho index.html
│   └── images-loader.js         # Images loader cho index.html
├── images/                      # Hình gốc
│   ├── LOGO-BROADWAY.png
│   ├── banner-top.png
│   └── ... (148 hình khác)
└── HUONG-DAN.md            # File này
```

---

## ⚙️ CẤU HÌNH NÂNG CAO

### Thêm user admin mới

1. Vào Firebase Console → Authentication → Add user
2. Nhập email + password mới
3. User mới có thể login vào admin.html

### Thay đổi thông tin Firebase

Nếu muốn dùng project Firebase khác:

1. Mở `js/firebase-config.js`
2. Thay đổi `firebaseConfig`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Backup dữ liệu

**Cách 1: Export từ Firestore**
1. Firebase Console → Firestore → Export/Import
2. Chọn collections → Export

**Cách 2: Dùng Firebase CLI**
```bash
firebase firestore:export backup-folder
```

---

## 📞 HỖ TRỢ

### Firestore giới hạn miễn phí

Firebase Free plan:
- ✅ 1GB storage
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ Hoàn toàn đủ cho website này

### Các file quan trọng KHÔNG được xóa

- ⚠️ `js/firebase-config.js`
- ⚠️ `js/content-mappings.js`
- ⚠️ `js/admin.js`
- ⚠️ `js/essensia-loader.js`
- ⚠️ `js/images-loader.js`
- ⚠️ `admin.html`

### Console log để debug

Mở Console (F12) để xem:
- `🔥 Essensia Loader: Bắt đầu load content...`
- `🖼️ Images Loader: Bắt đầu load...`
- `✅ Đã load và apply content thành công!`
- `✅ Group images applied: X`
- `✅ Dynamic images applied: Y`

Nếu có lỗi sẽ hiển thị: `❌ Lỗi: ...`

---

## 🎯 CHECKLIST HOÀN THÀNH

- [ ] Đã tạo user admin trong Firebase Authentication
- [ ] Đã setup Firestore Rules
- [ ] Đã login thành công vào admin.html
- [ ] Đã test chỉnh sửa text và lưu thành công
- [ ] Đã test upload hình và lưu thành công
- [ ] Đã kiểm tra website hiển thị đúng nội dung mới
- [ ] Đã hướng dẫn khách hàng cách sử dụng

---

**🎉 Chúc bạn sử dụng hệ thống thành công!**

Nếu cần hỗ trợ kỹ thuật, vui lòng liên hệ developer.
