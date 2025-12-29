# Hướng dẫn sử dụng Script Tối ưu Images

## Script: `optimize_images.py`

Script này sẽ tự động:
1. ✅ Nén tất cả images (JPG, PNG, WebP) với quality 85%
2. ✅ Chuyển tên file từ VIẾT HOA → viết thường
3. ✅ Tự động update tất cả references trong HTML
4. ✅ Hiển thị báo cáo chi tiết

## Cài đặt

### Bước 1: Cài đặt Python dependencies

```bash
# Cài đặt thư viện cần thiết
pip install -r requirements.txt
```

Hoặc cài riêng lẻ:
```bash
pip install Pillow pillow-heif
```

### Bước 2: Chạy script

```bash
# Di chuyển vào thư mục project
cd /Users/khahan/Downloads/html/phulong

# Chạy script
python3 optimize_images.py
```

## Script sẽ hỏi xác nhận trước khi chạy

```
⚠️  This script will:
   1. Compress all images (JPG, PNG, WebP)
   2. Convert all filenames to lowercase
   3. Update references in HTML files

Continue? (yes/no):
```

Nhập `yes` hoặc `y` để tiếp tục.

## Kết quả mong đợi

### Ví dụ output:

```
============================================================
Starting Image Optimization
============================================================

Found 50 images to process

Step 1: Compressing images...
------------------------------------------------------------
Processing: banner-top.png
   Before: 2458.3 KB
   After:  892.1 KB
   Saved:  63.7%

Processing: LOGO-BROADWAY.png
   Before: 156.8 KB
   After:  68.4 KB
   Saved:  56.4%

...

Step 2: Converting filenames to lowercase...
------------------------------------------------------------
Renamed: LOGO-BROADWAY.png → logo-broadway.png
Renamed: LOGO-BROADWAY-PRELOAD.png → logo-broadway-preload.png
...

Step 3: Updating HTML files...
------------------------------------------------------------
Updating: index.html
   ✓ Updated 12 references in index.html

============================================================
Optimization Complete!
============================================================
Images compressed: 50
Files renamed: 8
Total original size: 26.45 MB
Total compressed size: 9.82 MB
Total reduction: 62.9%
Space saved: 16.63 MB
============================================================
```

## Tùy chỉnh

Mở file `optimize_images.py` và chỉnh sửa:

```python
# Chất lượng nén (0-100, default: 85)
QUALITY_JPG = 85  # Giảm xuống 75-80 để nén nhiều hơn
QUALITY_PNG = 85
QUALITY_WEBP = 85

# Thư mục images
IMAGES_DIR = "images"

# HTML files cần update
HTML_FILES = ["index.html"]
```

## Lưu ý quan trọng

1. **Backup tự động:** Script không tạo backup, đảm bảo bạn đã commit code lên git hoặc backup thủ công
2. **SVG files:** Script tự động bỏ qua SVG (không cần nén thêm)
3. **File đã tồn tại:** Nếu file lowercase đã tồn tại, script sẽ skip
4. **Chạy 1 lần:** Chỉ nên chạy script 1 lần, chạy nhiều lần sẽ nén thêm và giảm quality

## Troubleshooting

### Lỗi: "Pillow library not found"
```bash
pip install Pillow pillow-heif
```

### Lỗi: "Permission denied"
```bash
chmod +x optimize_images.py
```

### Muốn undo thay đổi
Sử dụng git:
```bash
git checkout images/
git checkout index.html
```

## Alternative: Nén thủ công

Nếu không muốn dùng Python, dùng ImageMagick:

### Cài ImageMagick (macOS):
```bash
brew install imagemagick
```

### Nén JPG:
```bash
cd images
find . -name "*.jpg" -o -name "*.JPG" | while read img; do
  magick mogrify -quality 85 -strip "$img"
done
```

### Nén PNG:
```bash
find . -name "*.png" -o -name "*.PNG" | while read img; do
  magick mogrify -quality 85 -strip "$img"
done
```

### Đổi tên lowercase:
```bash
# Cài rename tool
brew install rename

# Đổi tên tất cả files
find images -depth -name "*" | while read file; do
  newname=$(echo "$file" | tr '[:upper:]' '[:lower:]')
  if [ "$file" != "$newname" ]; then
    mv "$file" "$newname"
  fi
done
```

### Update HTML references:
```bash
# Tìm và thay thế trong HTML (cẩn thận!)
sed -i '' 's/LOGO-BROADWAY/logo-broadway/g' index.html
sed -i '' 's/\.PNG/.png/g' index.html
sed -i '' 's/\.JPG/.jpg/g' index.html
```

## Support

Nếu gặp vấn đề, kiểm tra:
1. Python version >= 3.7: `python3 --version`
2. Pillow đã cài: `pip show Pillow`
3. Quyền ghi file: `ls -la images/`

Happy optimizing! 🚀
