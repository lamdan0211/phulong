# Hướng dẫn Setup và Chạy Script

## ✅ Vấn đề đã được sửa

### 1. SVG mất hiệu ứng ✅
**Vấn đề:** Khi tách SVG ra file riêng với `<object>`, JavaScript không thể access được SVG elements.

**Giải pháp đã áp dụng:**
- SVG được load động bằng `fetch()` và inject vào HTML
- JavaScript vẫn có thể access trực tiếp như SVG inline
- HTML file vẫn nhẹ (111KB thay vì 24MB)
- Tất cả hiệu ứng, tooltip, hover vẫn hoạt động bình thường

**Files đã sửa:**
- [index.html](index.html) - Thêm script load SVG động
- [js/script.js](js/script.js) - Đợi SVG load xong mới init

### 2. Python script không chạy ✅
**Vấn đề:** Script phức tạp và thiếu thư viện

**Giải pháp:**
- Viết lại script đơn giản hơn, dễ hiểu
- Chỉ cần cài Pillow (không cần pillow-heif)
- Thêm error handling và messages rõ ràng
- Tự động check dependencies

## 🚀 Cách chạy Script

### Bước 1: Cài đặt Python (nếu chưa có)

```bash
# Check Python version
python3 --version
```

Python 3.7+ là OK. Nếu chưa có, cài từ https://www.python.org/

### Bước 2: Cài đặt Pillow

**macOS với Homebrew (khuyến nghị):**
```bash
# Cài Pillow qua Homebrew
brew install pillow

# Hoặc cài với --user flag
pip3 install --user Pillow
```

**Nếu gặp lỗi "externally-managed-environment":**
```bash
# Cách 1: Dùng --user flag (KHUYẾN NGHỊ)
pip3 install --user Pillow

# Cách 2: Dùng --break-system-packages (cẩn thận)
pip3 install --break-system-packages Pillow

# Cách 3: Tạo virtual environment
python3 -m venv venv
source venv/bin/activate
pip install Pillow
# Sau đó chạy: python optimize_images.py
```

### Bước 3: Chạy script

```bash
# Di chuyển vào thư mục project
cd /Users/khahan/Downloads/html/phulong

# Chạy script
python3 optimize_images.py
```

### Bước 4: Xác nhận

Script sẽ hỏi:
```
⚠️  This script will:
   1. Compress all images (JPG, PNG, WebP)
   2. Convert all filenames to lowercase
   3. Update references in HTML files

Continue? (yes/no):
```

Nhập `yes` để tiếp tục.

## 📊 Kết quả mong đợi

```
============================================================
Image Optimization Script
============================================================

✓ Pillow library found

⚠️  This script will:
   1. Compress all images (JPG, PNG, WebP)
   2. Convert all filenames to lowercase
   3. Update references in HTML files

Continue? (yes/no): yes

Scanning 'images' directory...
Found 50 images

Step 1: Compressing images...
------------------------------------------------------------

banner-top.png
   Before: 2.4 MB
   After:  892.1 KB
   Saved:  63.7%

LOGO-BROADWAY.png
   Before: 156.8 KB
   After:  68.4 KB
   Saved:  56.4%

...

Step 2: Converting filenames to lowercase...
------------------------------------------------------------

LOGO-BROADWAY.png → logo-broadway.png
LOGO-BROADWAY-PRELOAD.png → logo-broadway-preload.png
...

Step 3: Updating HTML files...
------------------------------------------------------------

index.html
   ✓ Updated 12 references in index.html

============================================================
Optimization Complete!
============================================================
Images compressed: 50
Files renamed: 8

Original size:    26.5 MB
Compressed size:  9.8 MB
Total reduction:  63.0%
Space saved:      16.7 MB
============================================================
```

## ❗ Troubleshooting

### Lỗi: externally-managed-environment (macOS)

Đây là tính năng bảo vệ của macOS Python. Dùng 1 trong 3 cách:

```bash
# Cách 1: --user flag (KHUYẾN NGHỊ)
pip3 install --user Pillow

# Cách 2: --break-system-packages (nhanh)
pip3 install --break-system-packages Pillow

# Cách 3: Virtual environment
python3 -m venv venv
source venv/bin/activate
pip install Pillow
python optimize_images.py
```

### Lỗi: ModuleNotFoundError: No module named 'PIL'

Kiểm tra Pillow đã cài chưa:
```bash
python3 -c "from PIL import Image; print('OK')"
```

Nếu chưa, cài lại:
```bash
pip3 install --user Pillow
```

### Lỗi: Permission denied

```bash
# Thêm quyền execute cho script
chmod +x optimize_images.py

# Hoặc chạy với python3 explicitly
python3 optimize_images.py
```

### Lỗi: Directory 'images' not found

Đảm bảo bạn đang ở đúng thư mục:
```bash
cd /Users/khahan/Downloads/html/phulong
ls -la images/  # Phải thấy folder images
```

### Script chạy nhưng không thấy kết quả

- Kiểm tra có file nào tên VIẾT HOA không: `ls images/ | grep '[A-Z]'`
- Kiểm tra dung lượng trước: `du -sh images/`

## 🧪 Test SVG hiệu ứng

Sau khi deploy hoặc chạy local server:

```bash
# Chạy local server để test
python3 -m http.server 8000

# Mở browser
# http://localhost:8000
```

**Kiểm tra:**
1. Scroll xuống phần "Mặt Bằng Tổng Thể"
2. SVG map phải hiển thị
3. Hover vào các tòa nhà → Tooltip hiện
4. Click vào tòa nhà → Modal mở ra
5. Check console (F12) → Không có error

## 📝 Tóm tắt thay đổi

### File index.html
- ✅ Thêm script load SVG động (dòng ~2113-2141)
- ✅ HTML vẫn giữ 111KB (không inline SVG 24MB)
- ✅ SVG được load và inject vào DOM khi trang ready

### File js/script.js
- ✅ Thêm logic đợi SVG load xong (dòng 41-58)
- ✅ Listen event `svgLoaded` trước khi init
- ✅ Tất cả hiệu ứng hoạt động như cũ

### File optimize_images.py
- ✅ Viết lại đơn giản, dễ hiểu
- ✅ Chỉ cần Pillow (bỏ pillow-heif)
- ✅ Thêm error messages rõ ràng
- ✅ Format output đẹp hơn

## 💡 Tips

1. **Backup trước khi chạy:**
   ```bash
   # Nếu dùng git
   git add .
   git commit -m "Before image optimization"

   # Hoặc backup thủ công
   cp -r images images_backup
   ```

2. **Chạy từng bước:**
   - Sửa script để comment out các step không cần
   - Test compress trước, rename sau

3. **Xem trước kết quả:**
   - Script sẽ hỏi confirmation
   - Đọc kỹ output để chắc chắn

4. **Chỉ chạy 1 lần:**
   - Chạy nhiều lần sẽ nén thêm và giảm quality
   - Nếu cần chạy lại, restore từ backup

## 📚 Next Steps

Sau khi chạy script thành công:

1. ✅ Test website local
2. ✅ Check tất cả images hiển thị đúng
3. ✅ Verify SVG interactions hoạt động
4. ✅ Deploy lên production
5. ✅ Test trên PageSpeed Insights

Expected results:
- Page load: 15-20s → 2-3s
- Page size: ~50MB → ~8MB
- PageSpeed score: ~30 → ~85+

## 🆘 Support

Nếu gặp vấn đề:
1. Check Python version: `python3 --version`
2. Check Pillow: `pip3 show Pillow`
3. Check file permissions: `ls -la optimize_images.py`
4. Read error messages carefully
5. Check console trong browser (F12)

Good luck! 🚀
