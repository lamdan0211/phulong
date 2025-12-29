# Quick Start - Chạy ngay trong 2 phút

## Bước 1: Cài Pillow

Chạy lệnh này (chọn 1 trong 2):

```bash
# Cách 1: An toàn (khuyến nghị)
pip3 install --user Pillow

# Cách 2: Nhanh hơn (nếu cách 1 không được)
pip3 install --break-system-packages Pillow
```

## Bước 2: Chạy script

```bash
python3 optimize_images.py
```

Nhập `yes` khi được hỏi.

## Xong!

Script sẽ tự động:
- ✅ Nén tất cả images
- ✅ Đổi tên file thành chữ thường
- ✅ Update HTML

**Kết quả:** Images giảm từ 26MB → ~10MB (60-65%)

---

## Nếu gặp lỗi

### Lỗi: "No module named 'PIL'"

```bash
# Cài lại Pillow
pip3 install --user Pillow

# Kiểm tra
python3 -c "from PIL import Image; print('✓ OK')"
```

### Lỗi: "externally-managed-environment"

Đã có trong hướng dẫn Bước 1 ở trên (dùng `--user` hoặc `--break-system-packages`)

### Script chạy nhưng không thấy kết quả

Đảm bảo đang ở đúng thư mục:
```bash
cd /Users/khahan/Downloads/html/phulong
ls images/  # Phải thấy folder images
```

---

## Chi tiết đầy đủ

Xem [SETUP-GUIDE.md](SETUP-GUIDE.md) để biết thêm chi tiết.
