# Báo cáo Tối ưu Performance - Essensia Broadway

## Kết quả Tối ưu hóa

### File HTML
- **Trước:** 24.2 MB
- **Sau:** 111 KB
- **Giảm:** 99.54% (218x nhẹ hơn!)

## Các Tối ưu Đã Thực hiện

### 1. Tách SVG Inline (Tối ưu quan trọng nhất)
- **Vấn đề:** SVG mặt bằng căn hộ được nhúng trực tiếp vào HTML (~2600 dòng, 24MB)
- **Giải pháp:** Tách ra file riêng `images/floor-plan.svg`
- **Lợi ích:**
  - File HTML giảm từ 24MB xuống 111KB
  - Browser có thể cache SVG riêng biệt
  - Trang load nhanh hơn đáng kể

### 2. Lazy Loading Images
- **Đã thêm:** `loading="lazy"` cho 40+ images
- **Giữ nguyên (critical):** Logo preloader, hero images
- **Lợi ích:**
  - Chỉ load images khi user scroll đến
  - Giảm bandwidth ban đầu
  - Cải thiện First Contentful Paint (FCP)

### 3. Script Loading Optimization
- **Thêm `defer`:** Cho tất cả JS files (main.js, script.js, data.js)
- **Lợi ích:**
  - HTML parse không bị block
  - Scripts execute sau khi DOM ready
  - Cải thiện Time to Interactive (TTI)

### 4. Resource Preloading
- **Preload critical resources:**
  - `css/style.css` (critical CSS)
  - `images/LOGO-BROADWAY-PRELOAD.png` (preloader logo)
  - `images/banner-top.png` (hero image)
- **Lợi ích:** Browser ưu tiên tải những resources quan trọng nhất

## Tối ưu Tiếp theo (Khuyến nghị)

### 1. Nén Images (ƯU TIÊN CAO)
Folder images hiện tại: **26MB** - CẦN TỐI ƯU!

#### Công cụ nén recommended:

**Online Tools:**
- TinyPNG (https://tinypng.com/) - PNG/JPG
- Squoosh (https://squoosh.app/) - Google's image optimizer
- SVGOMG (https://jakearchibald.github.io/svgomg/) - SVG optimizer

**Command Line Tools:**
```bash
# Cài đặt ImageMagick
brew install imagemagick

# Nén JPG (quality 85%)
find images -name "*.jpg" -exec magick mogrify -quality 85 -strip {} \;

# Nén PNG
find images -name "*.png" -exec magick mogrify -strip -quality 85 {} \;

# Hoặc sử dụng pngquant
brew install pngquant
find images -name "*.png" -exec pngquant --quality=65-80 --ext .png --force {} \;
```

**Expected results:**
- JPG: giảm 40-60% (quality 85)
- PNG: giảm 50-70% (với pngquant)
- SVG: giảm 10-30% (với SVGOMG)

### 2. WebP/AVIF Format
Chuyển đổi sang format hiện đại:

```bash
# Convert to WebP
brew install webp
find images -name "*.jpg" -o -name "*.png" | while read img; do
  cwebp -q 85 "$img" -o "${img%.*}.webp"
done
```

**HTML implementation:**
```html
<picture>
  <source srcset="images/banner-top.webp" type="image/webp">
  <img src="images/banner-top.png" alt="Banner">
</picture>
```

### 3. Responsive Images
Tạo nhiều kích thước cho mobile/tablet/desktop:

```bash
# Tạo responsive versions
magick images/banner-top.png -resize 640x banner-top-sm.png
magick images/banner-top.png -resize 1024x banner-top-md.png
magick images/banner-top.png -resize 1920x banner-top-lg.png
```

**HTML implementation:**
```html
<img
  srcset="images/banner-top-sm.png 640w,
          images/banner-top-md.png 1024w,
          images/banner-top-lg.png 1920w"
  sizes="(max-width: 640px) 640px,
         (max-width: 1024px) 1024px,
         1920px"
  src="images/banner-top.png"
  alt="Banner">
```

### 4. CSS Optimization

```bash
# Minify CSS
npm install -g csso-cli
csso css/style.css -o css/style.min.css

# Update HTML to use minified version
```

**Expected reduction:** 133KB → ~40-50KB

### 5. JavaScript Optimization

```bash
# Minify JS
npm install -g terser
terser js/main.js -o js/main.min.js -c -m
terser js/script.js -o js/script.min.js -c -m
terser js/data.js -o js/data.min.js -c -m
```

**Expected reduction:** 144KB → ~50-60KB

### 6. Enable Compression (Server-side)

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript image/svg+xml
</IfModule>
```

**Nginx:**
```nginx
gzip on;
gzip_types text/css application/javascript image/svg+xml;
gzip_min_length 1000;
```

### 7. Browser Caching (Server-side)

**Apache (.htaccess):**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 8. CDN (Content Delivery Network)
Khuyến nghị sử dụng CDN miễn phí:
- Cloudflare (free plan)
- jsDelivr (cho static assets)
- Vercel/Netlify (cho hosting + CDN)

## Performance Metrics Expected

### Trước tối ưu:
- First Contentful Paint: ~8-12s
- Largest Contentful Paint: ~15-20s
- Time to Interactive: ~20-25s
- Total Page Size: ~50MB

### Sau tối ưu (với image compression):
- First Contentful Paint: ~0.8-1.5s
- Largest Contentful Paint: ~2-3s
- Time to Interactive: ~3-4s
- Total Page Size: ~5-8MB

## Công cụ Kiểm tra Performance

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Phân tích và đề xuất cải thiện

2. **WebPageTest**
   - https://www.webpagetest.org/
   - Test từ nhiều location và device

3. **Chrome DevTools**
   - Lighthouse audit (F12 → Lighthouse tab)
   - Network tab để check file sizes
   - Performance tab để profile loading

## Files Backup

- `index-backup-original.html` - File gốc 24MB (để backup)
- `index.html` - File đã tối ưu 111KB (đang sử dụng)
- `images/floor-plan.svg` - SVG đã tách ra

## Lưu ý Khi Deploy

1. Kiểm tra SVG loading hoạt động đúng
2. Test lazy loading trên mobile/desktop
3. Verify tất cả scripts load đúng với `defer`
4. Nén images trước khi deploy lên production
5. Bật gzip compression trên server
6. Setup browser caching headers

## Tổng kết

Đã giảm **99.54%** dung lượng HTML, từ 24MB xuống 111KB. Với việc nén images và áp dụng các khuyến nghị trên, tổng dung lượng trang có thể giảm từ ~50MB xuống ~5-8MB, cải thiện tốc độ tải trang gấp 5-10 lần.
