/**
 * CLOUDINARY IMAGE UPLOADER
 * Upload hình lên Cloudinary CDN
 *
 * Ưu điểm:
 * - CDN siêu nhanh toàn cầu
 * - Tự động optimize hình
 * - Free 25GB storage + 25GB bandwidth/tháng
 * - Không cần API key bí mật (dùng upload preset)
 */

// Import config
import { CLOUDINARY_CONFIG } from './cloudinary-config.js';

/**
 * Upload hình lên Cloudinary
 * @param {string} imageKey - Key để identify hình (không dùng, chỉ để tương thích)
 * @param {string} base64Data - Base64 data của hình
 * @param {string} filename - Tên file gốc
 * @returns {Promise<string>} - URL của hình trên Cloudinary
 */
export async function uploadImageToCloudinary(imageKey, base64Data, filename) {
  try {
    console.log(`📤 Uploading ${filename} to Cloudinary...`);

    // Tạo FormData
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const baseName = filename.replace(/\.[^.]+$/, '');
    const safeId = (text) =>
      text
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9/_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-/]+|[-/]+$/g, '');

    // Use unique public_id per upload (filename already includes timestamp)
    formData.append('public_id', safeId(baseName));

    // Optional: Thêm folder để organize
    if (CLOUDINARY_CONFIG.folder) {
      formData.append('folder', CLOUDINARY_CONFIG.folder);
    }

    // Optional: Thêm tags
    if (Array.isArray(CLOUDINARY_CONFIG.tags) && CLOUDINARY_CONFIG.tags.length > 0) {
      formData.append('tags', CLOUDINARY_CONFIG.tags.join(','));
    }

    // Upload lên Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    console.log(`✅ Uploaded to Cloudinary: ${data.secure_url}`);

    // Return secure URL (HTTPS)
    return data.secure_url;

  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete hình từ Cloudinary (optional - cần API key)
 * Không recommend vì cần API Secret
 */
export async function deleteImageFromCloudinary(publicId) {
  console.warn('⚠️ Delete requires API Secret - not implemented for security');
  // Để xóa hình, vào Cloudinary Dashboard
}

/**
 * Get optimized URL với transformations
 * @param {string} imageUrl - URL gốc từ Cloudinary
 * @param {object} options - Transformation options
 * @returns {string} - Transformed URL
 */
export function getOptimizedUrl(imageUrl, options = {}) {
  const {
    width = 'auto',
    quality = 'auto',
    format = 'auto'
  } = options;

  // Extract public_id from URL
  const parts = imageUrl.split('/upload/');
  if (parts.length !== 2) return imageUrl;

  // Build transformation string
  const transformation = `w_${width},q_${quality},f_${format}`;

  // Return transformed URL
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}

console.log('☁️ Cloudinary uploader initialized');
