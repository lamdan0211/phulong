/**
 * CLOUDINARY CONFIGURATION
 *
 * Setup instructions:
 * 1. Đăng ký tài khoản miễn phí: https://cloudinary.com/users/register/free
 * 2. Vào Dashboard: https://cloudinary.com/console
 * 3. Tạo Upload Preset:
 *    - Settings → Upload → Upload presets
 *    - Click "Add upload preset"
 *    - Signing Mode: "Unsigned" (QUAN TRỌNG!)
 *    - Upload preset name: vd "phulong_unsigned"
 *    - Save
 * 4. Copy thông tin:
 *    - Cloud name: Từ Dashboard
 *    - Upload preset: Tên preset vừa tạo
 * 5. Đổi tên file này thành: cloudinary-config.js
 */

export const CLOUDINARY_CONFIG = {
  // Cloud name (tìm trong Dashboard)
  cloudName: 'drlpx4bw5',  // ⚠️ Thay bằng cloud name của bạn

  // Upload preset name (unsigned)
  uploadPreset: 'phulong_unsigned',  // ⚠️ Thay bằng preset name

  // Optional: Folder để organize hình
  folder: 'phulong-images',  // Có thể thay đổi hoặc để ''

  // Optional: Tags
  tags: ['website', 'admin-upload']
};

/**
 * LƯU Ý BẢO MẬT:
 *
 * ✅ AN TOÀN:
 * - Cloud name là PUBLIC - có thể commit vào Git
 * - Upload preset (unsigned) là PUBLIC - có thể commit vào Git
 *
 * ❌ KHÔNG AN TOÀN (không dùng):
 * - API Key
 * - API Secret
 *
 * → Upload preset "unsigned" cho phép upload KHÔNG CẦN API secret
 * → An toàn để share với khách hàng!
 */
