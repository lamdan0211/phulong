

import { CLOUDINARY_CONFIG } from './cloudinary-config.js';

export async function uploadImageToCloudinary(imageKey, base64Data, filename) {
  try {
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const safeId = (text) =>
      text
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9/_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-/]+|[-/]+$/g, '');

    const timestamp = Date.now();
    const publicId = `${safeId(imageKey)}_${timestamp}`;
    formData.append('public_id', publicId);

    if (CLOUDINARY_CONFIG.folder) {
      formData.append('folder', CLOUDINARY_CONFIG.folder);
    }

    if (Array.isArray(CLOUDINARY_CONFIG.tags) && CLOUDINARY_CONFIG.tags.length > 0) {
      formData.append('tags', CLOUDINARY_CONFIG.tags.join(','));
    }

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

    return data.secure_url;

  } catch (error) {
    throw error;
  }
}

