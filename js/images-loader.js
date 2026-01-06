/**
 * ESSENSIA IMAGES LOADER
 * Load hình ảnh từ Firebase và replace vào index.html
 */

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const IMAGES_COLLECTION = 'essensia_images';

/**
 * Load images khi page ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🖼️ Images Loader: Bắt đầu load...');

  try {
    const imagesData = await loadImagesFromFirebase();
    if (imagesData) {
      // Apply images from admin groups (old structure)
      applyGroupImages(imagesData);

      console.log('✅ Đã apply images!');
    } else {
      console.warn('⚠️ Không có images trong Firebase, dùng hình gốc');
    }
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
});

/**
 * Load images data từ Firestore
 */
async function loadImagesFromFirebase() {
  try {
    const docRef = doc(db, IMAGES_COLLECTION, 'data');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('❌ Firestore error:', error);
    return null;
  }
}

/**
 * Apply images từ admin groups (compatibility với old structure)
 */
function applyGroupImages(imagesData) {
  let appliedCount = 0;

  // Old IMAGE_GROUPS structure mapping
  const oldMappings = {
    // LOGOS
    logo_broadway: ['img[src*="LOGO-BROADWAY.png"]:not([src*="PRELOAD"])'],
    logo_broadway_preload: ['img[src*="LOGO-BROADWAY-PRELOAD"]'],
    logo_phulong: ['img[src*="logo-phulong.png"]'],
    slogan_graphic: ['img[src*="saibuocthoithuong"]'],
    title_lifestyle: ['img[src*="chuansongthuongluu"]'],

    // HERO & BANNERS
    banner_desktop: ['.hero-image.desktop .hero-bg-img'],
    banner_mobile: ['.hero-image.mobile .hero-bg-img'],
    hero_view: ['img[src*="pic-view.png"]'],
    circle_image: ['img[src*="circle-image.png"]'],
    location_map: ['img[src*="map.svg"]'],
    scroll_indicator: ['img[src*="SCROLL.svg"]'],

    // FEATURES
    clubhouse: ['img[src*="clubhouse-pic.png"]'],
    park: ['img[src*="congvien-pic.png"]'],
    privilege_luxury: ['img[src*="dacquyenthuongluu"]'],
    privilege_experience: ['img[src*="dacquyentrainghiem"]'],
    feature_1: ['img[src*="botrikhoahoc"]'],
    feature_2: ['img[src*="vitrichienluoc"]'],
    btn_register: ['img[src*="btn-dangkyngay"]'],
    hotline_img: ['img[src*="HOTLINE.png"]'],
    modal_floor: ['img[src*="floor-clubhouse-modal"]'],
    time_3min: ['img[src*="3phut-image"]'],

    // GALLERY
    gallery_1: ['.gallery-item:nth-child(1) img'],
    gallery_2: ['.gallery-item:nth-child(2) img'],
    gallery_3: ['.gallery-item:nth-child(3) img'],
    gallery_4: ['.gallery-item:nth-child(4) img']
  };

  Object.keys(imagesData).forEach(imageKey => {
    // Skip dynamicImages object
    if (imageKey === 'dynamicImages') return;

    const imageUrl = imagesData[imageKey];

    // Chỉ apply nếu là Base64
    if (!imageUrl || !imageUrl.startsWith('data:')) {
      return;
    }

    const selectors = oldMappings[imageKey];
    if (!selectors) {
      return;
    }

    // Apply vào tất cả selectors
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = imageUrl;
          appliedCount++;
        } else {
          // Background image
          el.style.backgroundImage = `url(${imageUrl})`;
          appliedCount++;
        }
      });
    });
  });

  if (appliedCount > 0) {
    console.log(`✅ Group images applied: ${appliedCount}`);
  }
}

console.log('🖼️ Images Loader initialized');
