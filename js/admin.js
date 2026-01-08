/**
 * ESSENSIA BROADWAY - UNIFIED ADMIN PANEL
 * Quản lý toàn bộ nội dung text và hình ảnh trong 1 file duy nhất
 */

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Import Cloudinary uploader (optional - nếu có config)
let uploadImageToCloudinary = null;
try {
  const cloudinaryModule = await import('./cloudinary-uploader.js');
  uploadImageToCloudinary = cloudinaryModule.uploadImageToCloudinary;
  console.log('✅ Cloudinary uploader enabled');
} catch (err) {
  console.warn('⚠️ Cloudinary uploader not configured, using Base64 mode');
}

// Collections
const TEXT_COLLECTION = 'essensia_broadway';
const IMAGES_COLLECTION = 'essensia_images';

// DOM Elements
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const saveAllBtn = document.getElementById('save-all-btn');
const successMessage = document.getElementById('success-message');

// State
let currentUser = null;
let contentData = {}; // Text content
let imagesData = {}; // Images data
let uploadedImages = {}; // Temporary uploaded images (Base64)
let uploadedDynamicImages = {}; // Temporary uploaded dynamic images (Base64)
let sliderGroupsProduct = []; // Product slider groups data
let sliderGroupsPrivilege = []; // Privilege slider groups data

/**
 * ==============================================
 * IMAGE GROUPS DEFINITION
 * ==============================================
 */
const IMAGE_GROUPS = {
  homepage: {
    title: 'Homepage',
    images: [
      { key: 'homepage_view_image', label: 'Homepage View', original: 'pic-view.png' },
      { key: 'homepage_circle_image', label: 'Circle Overlay', original: 'circle-image.png' },
      { key: 'homepage_title_image', label: 'Homepage Title', original: 'chuansongthuongluu.svg' },
    ]
  },

  location: {
    title: 'Location',
    images: [
      { key: 'location_title_image', label: 'Location Title', original: 'chuansongthuongluu.svg' },
      { key: 'location_travel_time_1', label: 'Location travel time 1', original: '3phut-image.png' },
      { key: 'location_travel_time_2', label: 'Location travel time 2', original: '5phut-img.png' },
      { key: 'location_travel_time_3', label: 'Location travel time 3', original: '7phut-img.png' },
      { key: 'location_travel_time_4', label: 'Location travel time 4', original: '10phut-img.png' },
      { key: 'location_map_image', label: 'Location map', original: 'map.svg' },
    ]
  },

  product: {
    title: 'Product',
    images: [
      { key: 'product_background_desktop', label: 'Background desktop', original: 'middle-img.png' },
      { key: 'product_background_mobile', label: 'Background mobile', original: 'pic-mobile/middle-img-mobile.png' },
      { key: 'product_btn_left_pc', label: 'Button Left desktop', original: 'btn-left.png' },
      { key: 'product_btn_left_mobile', label: 'Button Left mobile', original: 'pic-mobile/btn-left-mobile.png' },
      { key: 'product_btn_right_pc', label: 'Button Right desktop', original: 'btn-right.png' },
      { key: 'product_btn_right_mobile', label: 'Button Right mobile', original: 'pic-mobile/btn-right-mobile.png' },
      { key: 'product_title_image', label: 'Product Title', original: 'dacquyenthuongluu.svg' },
      { key: 'product_clubhouse', label: 'Product clubhouse', original: 'clubhouse-pic.png' },
      { key: 'product_park', label: 'Product Park', original: 'congvien-pic.png' },
    ]
  },

  popupShophouse: {
    title: 'Popup Shophouse',
    images: [
      { key: 'popup_shophouse_title_top_desktop', label: 'Title Image Top desktop', original: 'sankhaukinhdoanh.png' },
      { key: 'popup_shophouse_title_top_mobile', label: 'Title Image Top mobile', original: 'sankhaukinhdoanh-mobile.png' },
      { key: 'popup_shophouse_title_desktop', label: 'Title Image desktop', original: 'matbangtoiuu-modal.svg' },
      { key: 'popup_shophouse_tang_1_group_1_desktop', label: 'shophouse tầng 1 group 1', original: 'floor/left-shophouse-tang1.png' },
      { key: 'popup_shophouse_tang_1_group_1_mobile', label: 'shophouse tầng 1 group 1', original: 'floor/left-shophouse-tang1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_1_desktop', label: 'shophouse tầng 2 group 1', original: 'floor/left-shophouse-tang2.png' },
      { key: 'popup_shophouse_tang_2_group_1_mobile', label: 'shophouse tầng 2 group 1', original: 'floor/left-shophouse-tang2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_1_desktop', label: 'shophouse tầng 3 group 1', original: 'floor/left-shophouse-tang3.png' },
      { key: 'popup_shophouse_tang_3_group_1_mobile', label: 'shophouse tầng 3 group 1', original: 'floor/left-shophouse-tang3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_1_desktop', label: 'shophouse tầng 4 group 1', original: 'floor/left-shophouse-tang4.png' },
      { key: 'popup_shophouse_tang_4_group_1_mobile', label: 'shophouse tầng 4 group 1', original: 'floor/left-shophouse-tang4-mobile.png' },

      { key: 'popup_shophouse_tang_1_group_2_desktop', label: 'shophouse tầng 1 group 2', original: 'floor/right-shophouse-tang1.png' },
      { key: 'popup_shophouse_tang_1_group_2_mobile', label: 'shophouse tầng 1 group 2', original: 'floor/right-shophouse-tang1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_2_desktop', label: 'shophouse tầng 2 group 2', original: 'floor/right-shophouse-tang2.png' },
      { key: 'popup_shophouse_tang_2_group_2_mobile', label: 'shophouse tầng 2 group 2', original: 'floor/right-shophouse-tang2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_2_desktop', label: 'shophouse tầng 3 group 2', original: 'floor/right-shophouse-tang3.png' },
      { key: 'popup_shophouse_tang_3_group_2_mobile', label: 'shophouse tầng 3 group 2', original: 'floor/right-shophouse-tang3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_2_desktop', label: 'shophouse tầng 4 group 2', original: 'floor/right-shophouse-tang4.png' },
      { key: 'popup_shophouse_tang_4_group_2_mobile', label: 'shophouse tầng 4 group 2', original: 'floor/right-shophouse-tang4-mobile.png' },

      { key: 'popup_shophouse_tang_1_group_3_mobile', label: 'shophouse tầng 1 group 3', original: 'floor/text-tang-1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_3_mobile', label: 'shophouse tầng 2 group 3', original: 'floor/text-tang-2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_3_mobile', label: 'shophouse tầng 3 group 3', original: 'floor/text-tang-3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_3_mobile', label: 'shophouse tầng 4 group 3', original: 'floor/text-tang-4-mobile.png' },
    ]
  },
  
  popupRewrittenHouse: {
    title: 'Popup Rewritten House',
    images: [
      { key: 'popup_rewrittenhouse_title_top_desktop', label: 'Title Image Top desktop', original: 'sankhaukinhdoanh.png' },
      { key: 'popup_rewrittenhouse_title_top_mobile', label: 'Title Image Top mobile', original: 'sankhaukinhdoanh-mobile.png' },
      { key: 'popup_rewrittenhouse_title_desktop', label: 'Title Image desktop', original: 'matbangtoiuu-modal.svg' },
      { key: 'popup_rewrittenhouse_tang_1_group_1_desktop', label: 'shophouse tầng 1 group 1', original: 'town/left-town-1.png' },
      { key: 'popup_rewrittenhouse_tang_1_group_1_mobile', label: 'shophouse tầng 1 group 1', original: 'town/left-town-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_1_desktop', label: 'shophouse tầng 2 group 1', original: 'town/left-town-2.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_1_mobile', label: 'shophouse tầng 2 group 1', original: 'town/left-town-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_1_desktop', label: 'shophouse tầng 3 group 1', original: 'town/left-town-3.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_1_mobile', label: 'shophouse tầng 3 group 1', original: 'town/left-town-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_1_desktop', label: 'shophouse tầng 4 group 1', original: 'town/left-town-4.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_1_mobile', label: 'shophouse tầng 4 group 1', original: 'town/left-town-4-mobile.png' },

      { key: 'popup_rewrittenhouse_tang_1_group_2_desktop', label: 'shophouse tầng 1 group 2', original: 'town/right-town-1.png' },
      { key: 'popup_rewrittenhouse_tang_1_group_2_mobile', label: 'shophouse tầng 1 group 2', original: 'town/right-town-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_2_desktop', label: 'shophouse tầng 2 group 2', original: 'town/right-town-2.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_2_mobile', label: 'shophouse tầng 2 group 2', original: 'town/right-town-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_2_desktop', label: 'shophouse tầng 3 group 2', original: 'town/right-town-3.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_2_mobile', label: 'shophouse tầng 3 group 2', original: 'town/right-town-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_2_desktop', label: 'shophouse tầng 4 group 2', original: 'town/right-town-4.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_2_mobile', label: 'shophouse tầng 4 group 2', original: 'town/right-town-4-mobile.png' },

      { key: 'popup_rewrittenhouse_tang_1_group_3_mobile', label: 'shophouse tầng 1 group 3', original: 'town/town-text-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_3_mobile', label: 'shophouse tầng 2 group 3', original: 'town/town-text-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_3_mobile', label: 'shophouse tầng 3 group 3', original: 'town/town-text-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_3_mobile', label: 'shophouse tầng 4 group 3', original: 'town/town-text-4-mobile.png' },
    ]
  },
  
  popupClubhouse: {
    title: 'Popup Club House',
    images: [
      { key: 'popup_clubhouse_title_top', label: 'Title Image Top desktop', original: 'title-modal-clubhouse.png' },
      { key: 'popup_clubhouse_title_desktop', label: 'Title Image desktop', original: 'dacquyentrainghiem.svg' },
      { key: 'popup_clubhouse_title_mobile', label: 'Title Image mobile', original: 'dacquyentrainghiem-mobile.svg' },

      { key: 'popup_clubhouse_floor_1', label: 'Image Floor 1', original: 'floor-clubhouse-modal.png' },
      { key: 'popup_clubhouse_floor_2', label: 'Image Floor 2', original: 'tang2-pic-map.png' },
      { key: 'popup_clubhouse_floor_3', label: 'Image Floor 3', original: 'tang3-pic-map.png' },
      { key: 'popup_clubhouse_floor_4', label: 'Image Floor 4', original: 'rooftop-pic-map.png' },
    ]
  },

  popupPark: {
    title: 'Popup Park',
    images: [
      { key: 'popup_popuppark_title_top', label: 'Title Image Top desktop', original: 'title-modal-park.png' },
      { key: 'popup_popuppark_title_desktop', label: 'Title Image desktop', original: 'tohoptienichthoithuong.svg' },
      { key: 'popup_popuppark_title_mobile', label: 'Title Image mobile', original: 'tohoptienichthoithuong-mobile.svg' },

      { key: 'popup_popuppark_map', label: 'Image Map', original: 'matbang-park-modal.png' },
    ]
  },

  floorplan: {
    title: 'Floorplan',
    images: [
      { key: 'master_plan_title_desktop', label: 'Floorplan Title Desktop', original: 'sapdathoanhao.png' },
      { key: 'master_plan_title_mobile', label: 'Floorplan Title Mobile', original: 'sapdathoanhao-mobile.png' },
    ]
  },

  news: {
    title: 'News',
    images: [
      { key: 'box_news_title', label: 'News Title Desktop', original: 'tamdienthongtin.svg' },
    ]
  },

  contact: {
    title: 'Contact',
    images: [
      { key: 'contact_image_title_desktop', label: 'Contact Title Desktop', original: 'ketnoihomnay.svg' },
      { key: 'contact_image_title_mobile', label: 'Contact Title Mobile', original: 'ketnoihomnay-mobile.svg' },
    ]
  },

  framedepicting: {
    title: 'Framedepicting',
    images: [
      { key: 'khung_hinh_khach_hoa_title', label: 'Framedepicting Title Desktop', original: 'khunghinhkhachoa-title.png' },
      { key: 'khung_hinh_khach_hoa_tong_the', label: 'Floorplan TỔNG THỂ', original: 'slide-khunghinhkhachoa/pic-all-view-slide.jpg' },
      { key: 'khung_hinh_khach_hoa_shophouse', label: 'Floorplan SHOPHOUSE', original: 'slide-khunghinhkhachoa/shophouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_townhouse', label: 'Floorplan TOWNHOUSE', original: 'slide-khunghinhkhachoa/townhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_clubhouse', label: 'Floorplan CLUBHOUSE', original: 'slide-khunghinhkhachoa/clubhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_cong_vien', label: 'Floorplan CÔNG VIÊN', original: 'slide-khunghinhkhachoa/park_1920x880.jpg' },
    ]
  },

  developer: {
    title: 'Developer',
    images: [
      { key: 'partners_image_1', label: 'Partners Logo 1', original: 'logo-parner-1.png' },
      { key: 'partners_image_2', label: 'Partners Logo 2', original: 'logo-parner-2.png' },
      { key: 'partners_image_3', label: 'Partners Logo 3', original: 'logo-parner-3.png' },
    ]
  },

  logos: {
    title: 'Logos & Branding',
    images: [
      { key: 'logo_broadway', label: 'Logo Broadway', original: 'LOGO-BROADWAY.png' },
      { key: 'logo_broadway_preload', label: 'Logo Preloader', original: 'LOGO-BROADWAY-PRELOAD.png' },
      { key: 'logo_phulong', label: 'Logo Phú Long', original: 'logo-phulong.png' },
      { key: 'slogan_graphic', label: 'Slogan Graphic', original: 'saibuocthoithuong.svg' },
    ]
  },
  hero: {
    title: 'Hero & Banners',
    images: [
      { key: 'banner_desktop', label: 'Banner Desktop', original: 'banner-top.png' },
      { key: 'banner_mobile', label: 'Banner Mobile', original: 'banner-top-mobile.png' },
    ]
  },
  gallery: {
    title: 'Gallery & Lifestyle',
    images: [
      { key: 'gallery_1', label: 'Gallery 1', original: 'pic-view.png' },
      { key: 'gallery_2', label: 'Gallery 2', original: 'circle-image.png' },
      { key: 'gallery_3', label: 'Gallery 3', original: 'clubhouse-pic.png' },
      { key: 'gallery_4', label: 'Gallery 4', original: 'congvien-pic.png' }
    ]
  }
};

/**
 * ==============================================
 * AUTHENTICATION
 * ==============================================
 */

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    showAdminPanel();
    loadAllData();
  } else {
    currentUser = null;
    showLoginPanel();
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="spinner"></span> Đang đăng nhập...';
  hideError();

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showError(getErrorMessage(error.code));
    loginBtn.disabled = false;
    loginBtn.textContent = 'Đăng nhập';
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể đăng xuất');
  }
});

function showLoginPanel() {
  loginContainer.style.display = 'flex';
  adminContainer.style.display = 'none';
}

function showAdminPanel() {
  loginContainer.style.display = 'none';
  adminContainer.style.display = 'block';
  userEmailSpan.textContent = currentUser.email;
}

function showError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function hideError() {
  loginError.style.display = 'none';
}

function getErrorMessage(code) {
  const messages = {
    'auth/invalid-credential': 'Email hoặc mật khẩu không đúng'
  };
  return messages[code] || 'Đăng nhập thất bại';
}

/**
 * ==============================================
 * LOAD ALL DATA (TEXT + IMAGES)
 * ==============================================
 */

async function loadAllData() {
  try {
    console.log('📡 Đang tải dữ liệu...');

    // Load text content
    const textDoc = await getDoc(doc(db, TEXT_COLLECTION, 'content'));
    if (textDoc.exists()) {
      contentData = textDoc.data();
      populateTextForm(contentData);
    } else {
      contentData = {};
    }

    // Load images
    const imagesDoc = await getDoc(doc(db, IMAGES_COLLECTION, 'data'));
    if (imagesDoc.exists()) {
      imagesData = imagesDoc.data();
    } else {
      imagesData = {};
    }

    // Render image groups
    renderAllImageGroups();

    // Load slider groups
    if (imagesData.sliderGroupsProduct) {
      sliderGroupsProduct = imagesData.sliderGroupsProduct;
    }
    if (imagesData.sliderGroupsPrivilege) {
      sliderGroupsPrivilege = imagesData.sliderGroupsPrivilege;
    }
    renderSliderGroups('product');
    renderSliderGroups('privilege');

    console.log('✅ Đã tải dữ liệu');
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

/**
 * ==============================================
 * TEXT CONTENT MANAGEMENT
 * ==============================================
 */

function populateTextForm(data) {
  // Homepage
  if (data.homepage) {
    setValue('homepage-desc1', data.homepage.description1);
    setValue('homepage-desc2', data.homepage.description2);
    setValue('homepage-desc3', data.homepage.description3);
  }

  // Location
  if (data.location) {
    setValue('location-desc1', data.location.description1);
    setValue('location-desc2', data.location.description2);
  }

  // Product
  if (data.product) {
    console.log('data.product', data.product);
    
    setValue('product-desc1', data.product.description1);
    setValue('product-desc2', data.product.description2);
    setValue('product-popup1-desc1', data.product.popup1description1);
    setValue('product-popup1-desc2', data.product.popup1description2);
    setValue('product-popup2-desc1', data.product.popup2description1);
    
    setValue('product-popup3-desc1', data.product.popup3description1);
    setValue('product-popup3-desc2', data.product.popup3description2);

    setValue('product-popup3-tang1-tab', data.product.popup3tang1tab);
    setValue('product-popup3-tang2-tab', data.product.popup3tang2tab);
    setValue('product-popup3-tang3-tab', data.product.popup3tang3tab);
    setValue('product-popup3-tang4-tab', data.product.popup3tang4tab);

    setValue('product-popup3-tang1-title', data.product.popup3tang1title);
    setValue('product-popup3-tang2-title', data.product.popup3tang2title);
    setValue('product-popup3-tang3-title', data.product.popup3tang3title);
    setValue('product-popup3-tang4-title', data.product.popup3tang4title);

    setValue('product-popup3-tang1-desc', data.product.popup3tang1desc);
    setValue('product-popup3-tang2-desc', data.product.popup3tang2desc);
    setValue('product-popup3-tang3-desc', data.product.popup3tang3desc);
    setValue('product-popup3-tang4-desc', data.product.popup3tang4desc);

    setValue('product-popup3-tang1-detail', data.product.popup3tang1detail);
    setValue('product-popup3-tang2-detail', data.product.popup3tang2detail);
    setValue('product-popup3-tang3-detail', data.product.popup3tang3detail);
    setValue('product-popup3-tang4-detail', data.product.popup3tang4detail);

    setValue('product-popup4-desc', data.product.popup4desc);
    setValue('product-popup4-detail', data.product.popup4detail);
  }

  // Floorplan
  if (data.floorplan) {
    setValue('floorplan-desc1', data.floorplan.description1);
    setValue('floorplan-desc2', data.floorplan.description2);
  }

  // News
  if (data.news) {
    renderNewsList(data.news.items || []);
  }


  // Floorplan
  if (data.floorplan) {
    setValue('floorplan-desc1', data.floorplan.description1);
    setValue('floorplan-desc2', data.floorplan.description2);
  }

  // Contact
  if (data.framedepicting) {
    setValue('framedepicting-tong-the', data.framedepicting.tongthe);
    setValue('framedepicting-shophouse', data.framedepicting.shophouse);
    setValue('framedepicting-townhouse', data.framedepicting.townhouse);
    setValue('framedepicting-clubhouse', data.framedepicting.clubhouse);
    setValue('framedepicting-cong-vien', data.framedepicting.congvien);
  }

  // Contact
  if (data.contact) {
    setValue('contact-company', data.contact.company);
    setValue('contact-hotline', data.contact.hotline);
    setValue('contact-email', data.contact.email);
    setValue('contact-address', data.contact.address);
    setValue('contact-from-info', data.contact.fromInfo);
    setValue('contact-copyright', data.contact.copyright);
    setValue('social-link-tiktok', data.contact.sociallinktiktok);
    setValue('social-link-facebook', data.contact.sociallinkfacebook);
  }

  // Menu
  if (data.menu) {
    setValue('nav_1', data.menu.nav_1);
    setValue('nav_2', data.menu.nav_2);
    setValue('nav_3', data.menu.nav_3);
    setValue('nav_4', data.menu.nav_4);
    setValue('nav_5', data.menu.nav_5);
    setValue('nav_6', data.menu.nav_6);
  }
  
  // Developer
  if (data.developer) {
    setValue('developer-description', data.developer.description);
    setValue('partners_description_title', data.developer.partnerstitle);
    setValue('partners_description_1', data.developer.partnersdescription1);
    setValue('partners_description_2', data.developer.partnersdescription2);
    setValue('partners_description_3', data.developer.partnersdescription3);
  }

}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) {
    el.value = value;
  }
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

// Helper function to collect news data from form inputs
function collectNewsData() {
  if (!contentData.news) contentData.news = { items: [] };

  const newsCount = document.querySelectorAll('[id^="news-item-title-"]').length;

  for (let i = 0; i < newsCount; i++) {
    // Get thumbnail from temporary storage or existing data
    const thumbnail = uploadedDynamicImages[`news_thumbnail_${i}`] || (contentData.news?.items?.[i]?.thumbnail || null);

    // Update existing item
    if (contentData.news.items[i]) {
      contentData.news.items[i].thumbnail = thumbnail;
      contentData.news.items[i].title = getValue(`news-item-title-${i}`);
      contentData.news.items[i].summary = getValue(`news-item-summary-${i}`);
      contentData.news.items[i].link = getValue(`news-item-link-${i}`);
    }
  }
}

function renderNewsList(items) {
  const container = document.getElementById('news-items-container');
  if (!container) return;

  container.innerHTML = '';
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item-card';

    // Preview thumbnail if exists
    const thumbnailPreview = item.thumbnail
      ? `<img src="${item.thumbnail}" alt="Thumbnail" style="max-width: 200px; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px; cursor: pointer;" onclick="window.showImageModal('news-${index}-thumbnail', 'Thumbnail ${index + 1}', this.src)">`
      : '<p style="color: #9ca3af; font-size: 0.875rem; margin-top: 8px;">Chưa có hình</p>';

    div.innerHTML = `
            <div class="item-card-header">
                <h3>Tin ${index + 1}</h3>
                <button class="btn-delete" onclick="window.deleteNews(${index})">🗑️ Xóa</button>
            </div>
            <div class="form-group">
                <label>Thumbnail (hình đại diện)</label>
                <input type="file"
                       id="news-item-thumbnail-input-${index}"
                       accept="image/*"
                       style="display: none"
                       onchange="window.handleNewsImageUpload(event, ${index})">
                <button class="upload-btn" onclick="document.getElementById('news-item-thumbnail-input-${index}').click()">
                    📁 Chọn hình thumbnail
                </button>
                ${thumbnailPreview}
            </div>
            <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" id="news-item-title-${index}" value="${item.title || ''}" placeholder="Nhập tiêu đề tin tức">
            </div>
            <div class="form-group">
                <label>Tóm tắt (Summary)</label>
                <textarea id="news-item-summary-${index}" rows="3" placeholder="Nhập tóm tắt ngắn gọn về tin tức">${item.summary || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Link bài viết</label>
                <input type="url" id="news-item-link-${index}" value="${item.link || ''}" placeholder="https://...">
            </div>
        `;
    container.appendChild(div);
  });
}

document.getElementById('add-news-btn')?.addEventListener('click', () => {
  if (!contentData.news) contentData.news = { items: [] };
  if (!contentData.news.items) contentData.news.items = [];

  // Collect current data before adding new item
  collectNewsData();

  contentData.news.items.push({
    thumbnail: null,
    title: 'Tin mới',
    summary: '',
    link: ''
  });

  renderNewsList(contentData.news.items);
});

window.deleteNews = (index) => {
  if (confirm('Xóa tin này?')) {
    // Collect current data before deleting
    collectNewsData();

    contentData.news.items.splice(index, 1);
    // Also remove uploaded thumbnail if exists
    delete uploadedDynamicImages[`news_thumbnail_${index}`];
    renderNewsList(contentData.news.items);
  }
};

// Handle news thumbnail upload
window.handleNewsImageUpload = async function (event, newsIndex) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showErrorNotification('⚠️ Lỗi!', 'Vui lòng chọn file hình ảnh');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showErrorNotification('⚠️ Lỗi!', 'Hình quá lớn! Tối đa 2MB. Vui lòng nén hình trước.');
    return;
  }

  try {
    console.log(`📤 Đang convert ${file.name}...`);
    const base64 = await fileToBase64(file);

    // Store temporarily
    uploadedDynamicImages[`news_thumbnail_${newsIndex}`] = base64;

    // Update the current item's thumbnail
    if (contentData.news?.items?.[newsIndex]) {
      contentData.news.items[newsIndex].thumbnail = base64;
    }

    // Re-render to show preview
    renderNewsList(contentData.news.items);

    console.log(`✅ Đã convert thumbnail cho tin ${newsIndex + 1}`);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showErrorNotification('❌ Lỗi!', 'Không thể xử lý hình');
  }
};

/**
 * ==============================================
 * IMAGE MANAGEMENT
 * ==============================================
 */

function renderAllImageGroups() {
  Object.keys(IMAGE_GROUPS).forEach(groupKey => {
    renderImageGroup(groupKey);
  });
}

function renderImageGroup(groupKey) {
  const group = IMAGE_GROUPS[groupKey];
  const container = document.getElementById(`${groupKey}-grid`);
  if (!container) return;

  container.innerHTML = '';
  container.className = 'image-list-container'; // Change from grid to list

  group.images.forEach(imageConfig => {
    const imageItem = createImageItem(imageConfig, groupKey);
    container.appendChild(imageItem);
  });
}

function createImageItem(imageConfig, groupKey) {
  const { key, label, original } = imageConfig;
  const div = document.createElement('div');
  div.className = 'image-list-item';

  // Lấy hình từ imagesData hoặc dùng placeholder
  const currentImage = imagesData[key] || `images/${original}`;
  const isUploaded = imagesData[key] && imagesData[key].startsWith('data:');

  div.innerHTML = `
        <div class="image-list-label">
            <strong>${label}</strong>
            <small style="color: #6b7280; display: block; margin-top: 4px;">ID: ${key}</small>
            <small style="color: #9ca3af;">File gốc: ${original}</small>
        </div>
        <div class="image-list-preview">
            <img src="${currentImage}"
                 alt="${label}"
                 id="preview-${key}"
                 onclick="window.showImageModal('${key}', '${label.replace(/'/g, "\\'")}', this.src)"
                 style="cursor: pointer; transition: transform 0.2s;"
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
        </div>
        <div class="image-list-actions">
            <input type="file"
                   id="input-${key}"
                   accept="image/*"
                   style="display: none"
                   data-key="${key}">
            <button class="upload-btn" onclick="document.getElementById('input-${key}').click()">
                📁 Chọn hình mới
            </button>
            <span class="image-status ${isUploaded ? 'status-uploaded' : 'status-pending'}">
                ${isUploaded ? '✓ Đã upload' : 'Gốc'}
            </span>
        </div>
    `;

  // Setup upload listener
  const input = div.querySelector(`#input-${key}`);
  input.addEventListener('change', (e) => handleImageUpload(e, key));

  return div;
}

async function handleImageUpload(event, imageKey) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showErrorNotification('⚠️ Lỗi!', 'Vui lòng chọn file hình ảnh');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showErrorNotification('⚠️ Lỗi!', 'Hình quá lớn! Tối đa 2MB. Vui lòng nén hình trước.');
    return;
  }

  try {
    console.log(`📤 Đang convert ${file.name}...`);
    const base64 = await fileToBase64(file);

    // Lưu vào temporary state
    uploadedImages[imageKey] = base64;

    // Update preview
    const preview = document.getElementById(`preview-${imageKey}`);
    if (preview) {
      preview.src = base64;
    }

    // Update status
    const status = preview.parentElement.querySelector('.image-status');
    if (status) {
      status.className = 'image-status status-uploaded';
      status.textContent = '✓ Sẵn sàng lưu';
    }

    console.log(`✅ Đã convert ${imageKey}`);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showErrorNotification('❌ Lỗi!', 'Không thể xử lý hình');
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

saveAllBtn.addEventListener('click', async () => {
  try {
    saveAllBtn.disabled = true;
    saveAllBtn.innerHTML = '<span class="spinner"></span> Đang lưu...';

    // Collect text data
    collectTextData();

    // ==========================================
    // CLOUDINARY UPLOAD LOGIC
    // ==========================================
    if (uploadImageToCloudinary && Object.keys(uploadedImages).length > 0) {
      console.log('📤 Uploading images to Cloudinary...');
      saveAllBtn.innerHTML = '<span class="spinner"></span> Đang upload lên Cloudinary...';

      let successCount = 0;
      let failedCount = 0;

      for (const [imageKey, base64Data] of Object.entries(uploadedImages)) {
        const previousUrl = imagesData[imageKey];
        try {
          // Detect extension từ Base64 data
          const mimeType = base64Data.split(';')[0].split(':')[1]; // e.g., "image/png"
          const extension = mimeType.split('/')[1]; // e.g., "png", "svg+xml"
          const cleanExtension = extension.replace('+xml', ''); // svg+xml -> svg

          // Lấy base filename (không có extension)
          const baseFilename = getOriginalFilename(imageKey).replace(/\.[^.]+$/, '');

          // Cache busting: Thêm timestamp vào filename
          const timestamp = Date.now();
          const filename = `${baseFilename}-${timestamp}.${cleanExtension}`;

          // Upload lên Cloudinary
          const cloudinaryURL = await uploadImageToCloudinary(imageKey, base64Data, filename);

          // Lưu Cloudinary URL thay vì Base64
          imagesData[imageKey] = cloudinaryURL;
          successCount++;

          console.log(`✅ Uploaded ${imageKey}: ${cloudinaryURL}`);
        } catch (error) {
          console.error(`❌ Failed to upload ${imageKey}:`, error);
          // Fallback: giữ URL cũ để tránh lưu Base64 lớn vào Firestore
          imagesData[imageKey] = previousUrl;
          failedCount++;
        }
      }

      if (failedCount > 0) {
        showErrorNotification(
          '⚠️ Upload không hoàn toàn',
          `${successCount} ảnh thành công, ${failedCount} ảnh thất bại (dùng Base64 backup)`
        );
      }
    } else if (!uploadImageToCloudinary) {
      // Không có Cloudinary config - dùng Base64 mode
      console.log('📦 Using Base64 mode (Cloudinary not configured)');
      Object.assign(imagesData, uploadedImages);
    }

    // Dynamic images
    imagesData.dynamicImages = imagesData.dynamicImages || {};
    Object.assign(imagesData.dynamicImages, uploadedDynamicImages);

    // Collect slider groups data
    collectSliderGroupsData('product');
    collectSliderGroupsData('privilege');

    // ==========================================
    // UPLOAD SLIDER IMAGES TO CLOUDINARY
    // ==========================================
    if (uploadImageToCloudinary) {
      console.log('📤 Uploading slider images to Cloudinary...');
      saveAllBtn.innerHTML = '<span class="spinner"></span> Đang upload slider images...';

      let sliderSuccessCount = 0;
      let sliderFailedCount = 0;

      // Upload Product slider images
      for (const group of sliderGroupsProduct) {
        if (!group.images) continue;

        for (const image of group.images) {
          // Upload desktop image
          if (image.desktop && image.desktop.startsWith('data:')) {
            try {
              const mimeType = image.desktop.split(';')[0].split(':')[1];
              const extension = mimeType.split('/')[1].replace('+xml', '');
              const timestamp = Date.now();
              const filename = `slider-product-${group.key}-desktop-${timestamp}.${extension}`;

              const cloudinaryURL = await uploadImageToCloudinary(`slider_product_${group.key}_desktop`, image.desktop, filename);
              image.desktop = cloudinaryURL;
              sliderSuccessCount++;
              console.log(`✅ Uploaded product slider desktop: ${cloudinaryURL}`);
            } catch (error) {
              console.error(`❌ Failed to upload product slider desktop:`, error);
              image.desktop = '';
              sliderFailedCount++;
            }
          }

          // Upload mobile image
          if (image.mobile && image.mobile.startsWith('data:')) {
            try {
              const mimeType = image.mobile.split(';')[0].split(':')[1];
              const extension = mimeType.split('/')[1].replace('+xml', '');
              const timestamp = Date.now();
              const filename = `slider-product-${group.key}-mobile-${timestamp}.${extension}`;

              const cloudinaryURL = await uploadImageToCloudinary(`slider_product_${group.key}_mobile`, image.mobile, filename);
              image.mobile = cloudinaryURL;
              sliderSuccessCount++;
              console.log(`✅ Uploaded product slider mobile: ${cloudinaryURL}`);
            } catch (error) {
              console.error(`❌ Failed to upload product slider mobile:`, error);
              image.mobile = '';
              sliderFailedCount++;
            }
          }
        }
      }

      // Upload Privilege slider images
      for (const group of sliderGroupsPrivilege) {
        if (!group.images) continue;

        for (const image of group.images) {
          // Upload desktop image
          if (image.desktop && image.desktop.startsWith('data:')) {
            try {
              const mimeType = image.desktop.split(';')[0].split(':')[1];
              const extension = mimeType.split('/')[1].replace('+xml', '');
              const timestamp = Date.now();
              const filename = `slider-privilege-${group.key}-desktop-${timestamp}.${extension}`;

              const cloudinaryURL = await uploadImageToCloudinary(`slider_privilege_${group.key}_desktop`, image.desktop, filename);
              image.desktop = cloudinaryURL;
              sliderSuccessCount++;
              console.log(`✅ Uploaded privilege slider desktop: ${cloudinaryURL}`);
            } catch (error) {
              console.error(`❌ Failed to upload privilege slider desktop:`, error);
              image.desktop = '';
              sliderFailedCount++;
            }
          }

          // Upload mobile image
          if (image.mobile && image.mobile.startsWith('data:')) {
            try {
              const mimeType = image.mobile.split(';')[0].split(':')[1];
              const extension = mimeType.split('/')[1].replace('+xml', '');
              const timestamp = Date.now();
              const filename = `slider-privilege-${group.key}-mobile-${timestamp}.${extension}`;

              const cloudinaryURL = await uploadImageToCloudinary(`slider_privilege_${group.key}_mobile`, image.mobile, filename);
              image.mobile = cloudinaryURL;
              sliderSuccessCount++;
              console.log(`✅ Uploaded privilege slider mobile: ${cloudinaryURL}`);
            } catch (error) {
              console.error(`❌ Failed to upload privilege slider mobile:`, error);
              image.mobile = '';
              sliderFailedCount++;
            }
          }
        }
      }

      if (sliderFailedCount > 0) {
        showErrorNotification(
          '⚠️ Upload slider không hoàn toàn',
          `${sliderSuccessCount} ảnh thành công, ${sliderFailedCount} ảnh thất bại`
        );
      }

      // ==========================================
      // UPLOAD NEWS THUMBNAILS TO CLOUDINARY
      // ==========================================
      console.log('📤 Uploading news thumbnails to Cloudinary...');
      saveAllBtn.innerHTML = '<span class="spinner"></span> Đang upload news thumbnails...';

      let newsSuccessCount = 0;
      let newsFailedCount = 0;

      for (let i = 0; i < contentData.news.items.length; i++) {
        const newsItem = contentData.news.items[i];
        if (newsItem.thumbnail && newsItem.thumbnail.startsWith('data:')) {
          try {
            const mimeType = newsItem.thumbnail.split(';')[0].split(':')[1];
            const extension = mimeType.split('/')[1].replace('+xml', '');
            const timestamp = Date.now();
            const filename = `news-thumbnail-${i}-${timestamp}.${extension}`;

            const cloudinaryURL = await uploadImageToCloudinary(`news_thumbnail_${i}`, newsItem.thumbnail, filename);
            newsItem.thumbnail = cloudinaryURL;
            newsSuccessCount++;
            console.log(`✅ Uploaded news thumbnail ${i}: ${cloudinaryURL}`);
          } catch (error) {
            console.error(`❌ Failed to upload news thumbnail ${i}:`, error);
            newsItem.thumbnail = '';
            newsFailedCount++;
          }
        }
      }

      if (newsFailedCount > 0) {
        showErrorNotification(
          '⚠️ Upload news thumbnails không hoàn toàn',
          `${newsSuccessCount} ảnh thành công, ${newsFailedCount} ảnh thất bại`
        );
      }
    }

    imagesData.sliderGroupsProduct = sliderGroupsProduct;
    imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;

    // Save both collections to Firestore
    saveAllBtn.innerHTML = '<span class="spinner"></span> Đang lưu vào database...';
    await setDoc(doc(db, TEXT_COLLECTION, 'content'), contentData);
    await setDoc(doc(db, IMAGES_COLLECTION, 'data'), imagesData);

    // Clear uploaded cache
    uploadedImages = {};
    uploadedDynamicImages = {};

    // Show success notification
    showSuccessNotification('🎉 Cập nhật thành công!', 'Tất cả thay đổi đã được lưu vào hệ thống.');

    console.log('✅ Đã lưu thành công!');

    // Re-render để update status
    renderAllImageGroups();
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showErrorNotification('❌ Lỗi!', 'Không thể lưu. Vui lòng thử lại.');
  } finally {
    saveAllBtn.disabled = false;
    saveAllBtn.innerHTML = '💾 Lưu tất cả thay đổi';
  }
});

/**
 * Helper: Lấy original filename từ imageKey
 */
function getOriginalFilename(imageKey) {
  for (const group of Object.values(IMAGE_GROUPS)) {
    const image = group.images.find(img => img.key === imageKey);
    if (image) {
      return image.original;
    }
  }
  // Fallback
  return `${imageKey}.png`;
}

function collectTextData() {
  // Homepage
  contentData.homepage = {
    description1: getValue('homepage-desc1') || '',
    description2: getValue('homepage-desc2') || '',
    description3: getValue('homepage-desc3') || ''
  };

  // Location
  contentData.location = {
    description1: getValue('location-desc1') || '',
    description2: getValue('location-desc2') || ''
  };

  // Product
  contentData.product = {
    description1: getValue('product-desc1') || '',
    description2: getValue('product-desc2') || '',
    popup1description1: getValue('product-popup1-desc1') || '',
    popup1description2: getValue('product-popup1-desc2') || '',
    popup2description1: getValue('product-popup2-desc1') || '',

    popup3description1: getValue('product-popup3-desc1') || '',
    popup3description2: getValue('product-popup3-desc2') || '',

    popup3tang1tab: getValue('product-popup3-tang1-tab') || '',
    popup3tang2tab: getValue('product-popup3-tang2-tab') || '',
    popup3tang3tab: getValue('product-popup3-tang3-tab') || '',
    popup3tang4tab: getValue('product-popup3-tang4-tab') || '',

    popup3tang1title: getValue('product-popup3-tang1-title') || '',
    popup3tang2title: getValue('product-popup3-tang2-title') || '',
    popup3tang3title: getValue('product-popup3-tang3-title') || '',
    popup3tang4title: getValue('product-popup3-tang4-title') || '',

    popup3tang1desc: getValue('product-popup3-tang1-desc') || '',
    popup3tang2desc: getValue('product-popup3-tang2-desc') || '',
    popup3tang3desc: getValue('product-popup3-tang3-desc') || '',
    popup3tang4desc: getValue('product-popup3-tang4-desc') || '',

    popup3tang1detail: getValue('product-popup3-tang1-detail') || '',
    popup3tang2detail: getValue('product-popup3-tang2-detail') || '',
    popup3tang3detail: getValue('product-popup3-tang3-detail') || '',
    popup3tang4detail: getValue('product-popup3-tang4-detail') || '',


    popup4desc: getValue('product-popup4-desc') || '',
    popup4detail: getValue('product-popup4-detail') || '',
  };

  // Floorplan
  contentData.floorplan = {
    description1: getValue('floorplan-desc1') || '',
    description2: getValue('floorplan-desc2') || ''
  };

  // FrameDepicting
  contentData.framedepicting = {
    tongthe: getValue('framedepicting-tong-the') || '',
    shophouse: getValue('framedepicting-shophouse') || '',
    townhouse: getValue('framedepicting-townhouse') || '',
    clubhouse: getValue('framedepicting-clubhouse') || '',
    congvien: getValue('framedepicting-cong-vien') || '',
  };

  // News
  const newsItems = [];
  const newsCount = document.querySelectorAll('[id^="news-item-title-"]').length;
  for (let i = 0; i < newsCount; i++) {
    // Get thumbnail from temporary storage or existing data
    const thumbnail = uploadedDynamicImages[`news_thumbnail_${i}`] || (contentData.news?.items?.[i]?.thumbnail || null);

    newsItems.push({
      thumbnail: thumbnail,
      title: getValue(`news-item-title-${i}`),
      summary: getValue(`news-item-summary-${i}`),
      link: getValue(`news-item-link-${i}`)
    });
  }
  contentData.news = {
    items: newsItems
  };

  // Contact
  contentData.contact = {
    company: getValue('contact-company') || '',
    hotline: getValue('contact-hotline') || '',
    email: getValue('contact-email') || '',
    address: getValue('contact-address') || '',
    copyright: getValue('contact-copyright') || '',
    fromInfo: getValue('contact-from-info') || '',
    sociallinktiktok: getValue('social-link-tiktok') || '',
    sociallinkfacebook: getValue('social-link-facebook') || '',
  };

  // Menu
  contentData.menu = {
    nav_1: getValue('nav_1') || '',
    nav_2: getValue('nav_2') || '',
    nav_3: getValue('nav_3') || '',
    nav_4: getValue('nav_4') || '',
    nav_5: getValue('nav_5') || '',
    nav_6: getValue('nav_6') || '',
  };
  
  // Developer
  contentData.developer = {
    description: getValue('developer-description') || '',
    partnerstitle: getValue('partners_description_title') || '',
    partnersdescription1: getValue('partners_description_1') || '',
    partnersdescription2: getValue('partners_description_2') || '',
    partnersdescription3: getValue('partners_description_3') || '',
  }

  // Dynamic text
  const dynamicText = {};
  document.querySelectorAll('[data-text-key]').forEach(input => {
    const key = input.getAttribute('data-text-key');
    const mode = input.getAttribute('data-text-mode');
    let value = input.value || '';
    if (mode === 'html') {
      value = value.replace(/\n/g, '<br>');
    }
    dynamicText[key] = value;
  });
  contentData.dynamicText = dynamicText;
}

/**
 * ==============================================
 * IMAGE MODAL POPUP
 * ==============================================
 */

window.showImageModal = function(key, label, src) {
  // Remove existing modal if any
  const existingModal = document.getElementById('image-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="image-modal-overlay" onclick="document.getElementById('image-modal').remove()"></div>
    <div class="image-modal-content">
      <div class="image-modal-header">
        <div>
          <h3>${label}</h3>
          <small style="color: #9ca3af;">ID: ${key}</small>
        </div>
        <button class="image-modal-close" onclick="document.getElementById('image-modal').remove()">
          ✕
        </button>
      </div>
      <div class="image-modal-body">
        <img src="${src}" alt="${label}">
      </div>
      <div class="image-modal-footer">
        <button class="btn-secondary" onclick="document.getElementById('image-modal').remove()">
          Đóng
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Trigger animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Close on ESC key
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
};

console.log('🏢 Essensia Admin initialized');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;');
}

function normalizeLineBreaks(value) {
  if (!value) return '';
  return value
    .split('<br />').join('\n')
    .split('<br/>').join('\n')
    .split('<br>').join('\n');
}

/**
 * ==============================================
 * NOTIFICATION SYSTEM
 * ==============================================
 */

function showSuccessNotification(title, message) {
  // Tạo notification element
  const notification = document.createElement('div');
  notification.className = 'custom-notification success';
  
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">✓</div>
      <div class="notification-text">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="notification-progress"></div>
  `;
  
  // Thêm vào body
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Tự động ẩn sau 4 giây
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 4000);
  
  // Animation progress bar
  const progressBar = notification.querySelector('.notification-progress');
  progressBar.style.animation = 'progress 4s linear forwards';
}

function showErrorNotification(title, message) {
  const notification = document.createElement('div');
  notification.className = 'custom-notification error';

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">✕</div>
      <div class="notification-text">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="notification-progress"></div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 4000);

  const progressBar = notification.querySelector('.notification-progress');
  progressBar.style.animation = 'progress 4s linear forwards';
}

/**
 * ==============================================
 * SLIDER GROUPS MANAGEMENT
 * ==============================================
 */

function renderSliderGroups(type = 'product') {
  const containerId = type === 'product' ? 'slider-groups-product-container' : 'slider-groups-privilege-container';
  const container = document.getElementById(containerId);
  if (!container) return;

  const groups = type === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  container.innerHTML = '';

  if (groups.length === 0) {
    container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem;">Chưa có nhóm slider nào. Nhấn nút bên dưới để tạo nhóm mới.</p>';
    return;
  }

  groups.forEach((group, groupIndex) => {
    const groupCard = createSliderGroupCard(group, groupIndex, type);
    container.appendChild(groupCard);
  });
}

function createSliderGroupCard(group, groupIndex, type = 'product') {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.style.border = '2px solid #3b82f6';
  div.style.marginBottom = '2rem';

  const imagesHTML = (group.images || []).map((img, imgIndex) => {
    const desktopSrc = img.desktop || 'images/placeholder.png';
    const mobileSrc = img.mobile || 'images/placeholder.png';

    return `
      <div class="slider-image-item" style="border: 1px solid #e5e7eb; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong>Hình ${imgIndex + 1}</strong>
          <button class="btn-delete" onclick="window.deleteSliderImage(${groupIndex}, ${imgIndex}, '${type}')" style="font-size: 0.875rem;">🗑️ Xóa</button>
        </div>

        <div class="form-group">
          <label>Tab ID (data-tab attribute)</label>
          <input type="text"
                 id="slider-${type}-${groupIndex}-${imgIndex}-tab"
                 value="${img.tab || ''}"
                 placeholder="vd: tong-the, shophouse, townhouse...">
        </div>

        <div class="form-group">
          <label>Alt text</label>
          <input type="text"
                 id="slider-${type}-${groupIndex}-${imgIndex}-alt"
                 value="${img.alt || ''}"
                 placeholder="Mô tả hình">
        </div>

        <div class="form-group">
          <label>Description text</label>
          <textarea id="slider-${type}-${groupIndex}-${imgIndex}-description" rows="5">${img.des || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🖥️ Desktop</label>
            <img src="${desktopSrc}"
                 alt="Desktop preview"
                 id="preview-slider-${type}-${groupIndex}-${imgIndex}-desktop"
                 style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem; cursor: pointer;"
                 onclick="window.showImageModal('slider-${type}-${groupIndex}-${imgIndex}-desktop', 'Desktop ${imgIndex + 1}', this.src)">
            <input type="file"
                   id="input-slider-${type}-${groupIndex}-${imgIndex}-desktop"
                   accept="image/*"
                   style="display: none"
                   onchange="window.handleSliderImageUpload(event, ${groupIndex}, ${imgIndex}, 'desktop', '${type}')">
            <button class="upload-btn"
                    onclick="document.getElementById('input-slider-${type}-${groupIndex}-${imgIndex}-desktop').click()"
                    style="width: 100%; font-size: 0.875rem;">
              📁 Chọn Desktop
            </button>
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">📱 Mobile</label>
            <img src="${mobileSrc}"
                 alt="Mobile preview"
                 id="preview-slider-${type}-${groupIndex}-${imgIndex}-mobile"
                 style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem; cursor: pointer;"
                 onclick="window.showImageModal('slider-${type}-${groupIndex}-${imgIndex}-mobile', 'Mobile ${imgIndex + 1}', this.src)">
            <input type="file"
                   id="input-slider-${type}-${groupIndex}-${imgIndex}-mobile"
                   accept="image/*"
                   style="display: none"
                   onchange="window.handleSliderImageUpload(event, ${groupIndex}, ${imgIndex}, 'mobile', '${type}')">
            <button class="upload-btn"
                    onclick="document.getElementById('input-slider-${type}-${groupIndex}-${imgIndex}-mobile').click()"
                    style="width: 100%; font-size: 0.875rem;">
              📁 Chọn Mobile
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  div.innerHTML = `
    <div class="item-card-header">
      <div>
        <h3 style="margin-bottom: 0.5rem;">📦 ${group.name || `Nhóm ${groupIndex + 1}`}</h3>
        <input type="text"
               id="slider-${type}-group-name-${groupIndex}"
               value="${group.name || ''}"
               placeholder="Tên nhóm (vd: Slider Thương mại)"
               style="width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
    </div>

    <div class="form-group">
      <label>Group Key (sử dụng trong code)</label>
      <input type="text"
             id="slider-${type}-group-key-${groupIndex}"
             value="${group.key || ''}"
             placeholder="vd: popup_slider_1, slider_commercial..."
             style="font-family: monospace; background: #f9fafb;">
      <small style="color: #6b7280; display: block; margin-top: 4px;">
        Key này sẽ dùng để hiển thị slider trong index.html. Không được trùng với nhóm khác.
      </small>
    </div>

    <div style="margin-top: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h4>Hình trong nhóm (${(group.images || []).length})</h4>
        <button class="btn-add" onclick="window.addImageToSliderGroup(${groupIndex}, '${type}')" style="font-size: 0.875rem;">
          + Thêm hình
        </button>
      </div>

      <div id="slider-group-images-${groupIndex}">
        ${imagesHTML || '<p style="color: #9ca3af; text-align: center; padding: 1rem;">Chưa có hình nào. Nhấn "Thêm hình" để bắt đầu.</p>'}
      </div>
    </div>
  `;

  return div;
}

// Global functions for slider management
window.addImageToSliderGroup = function(groupIndex, sliderType = 'product') {
  // Preserve current inputs before re-render
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  if (!groups[groupIndex].images) {
    groups[groupIndex].images = [];
  }

  groups[groupIndex].images.push({
    tab: '',
    alt: '',
    des: '',
    desktop: null,
    mobile: null
  });

  renderSliderGroups(sliderType);
};

window.deleteSliderImage = function(groupIndex, imgIndex, sliderType = 'product') {
  // Preserve current inputs before re-render
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  if (confirm('Xóa hình này khỏi slider?')) {
    groups[groupIndex].images.splice(imgIndex, 1);
    renderSliderGroups(sliderType);
  }
};

window.deleteSliderGroup = function(groupIndex, sliderType = 'product') {
  // Preserve current inputs before re-render
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;
  const groupName = groups[groupIndex].name || `Nhóm ${groupIndex + 1}`;

  if (confirm(`Xóa toàn bộ nhóm "${groupName}"?\n\nLưu ý: Tất cả hình trong nhóm này sẽ bị xóa!`)) {
    groups.splice(groupIndex, 1);
    renderSliderGroups(sliderType);
  }
};

window.handleSliderImageUpload = async function(event, groupIndex, imgIndex, imageType, sliderType = 'product') {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showErrorNotification('⚠️ Lỗi!', 'Vui lòng chọn file hình ảnh');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showErrorNotification('⚠️ Lỗi!', 'Hình quá lớn! Tối đa 2MB. Vui lòng nén hình trước.');
    return;
  }

  try {
    console.log(`📤 Đang convert ${file.name}...`);
    const base64 = await fileToBase64(file);

    const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

    // Update image data
    if (!groups[groupIndex].images[imgIndex]) {
      groups[groupIndex].images[imgIndex] = {};
    }
    groups[groupIndex].images[imgIndex][imageType] = base64;

    // Update preview
    const preview = document.getElementById(`preview-slider-${sliderType}-${groupIndex}-${imgIndex}-${imageType}`);
    if (preview) {
      preview.src = base64;
    }

    console.log(`✅ Đã convert hình ${imageType} cho ${sliderType} nhóm ${groupIndex}, hình ${imgIndex}`);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    showErrorNotification('❌ Lỗi!', 'Không thể xử lý hình');
  }
};

// Add slider group buttons
document.getElementById('add-slider-group-product-btn')?.addEventListener('click', () => {
  // Preserve current inputs before re-render
  collectSliderGroupsData('product');

  sliderGroupsProduct.push({
    name: `Nhóm Slider Sản phẩm ${sliderGroupsProduct.length + 1}`,
    key: `slider_product_${sliderGroupsProduct.length + 1}`,
    images: []
  });

  renderSliderGroups('product');
});

document.getElementById('add-slider-group-privilege-btn')?.addEventListener('click', () => {
  // Preserve current inputs before re-render
  collectSliderGroupsData('privilege');

  sliderGroupsPrivilege.push({
    name: `Nhóm Slider Đặc quyền ${sliderGroupsPrivilege.length + 1}`,
    key: `slider_privilege_${sliderGroupsPrivilege.length + 1}`,
    images: []
  });

  renderSliderGroups('privilege');
});

function collectSliderGroupsData(type = 'product') {
  const groups = type === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  groups.forEach((group, groupIndex) => {
    // Collect group name and key
    const nameInput = document.getElementById(`slider-${type}-group-name-${groupIndex}`);
    const keyInput = document.getElementById(`slider-${type}-group-key-${groupIndex}`);

    if (nameInput) group.name = nameInput.value;
    if (keyInput) group.key = keyInput.value;

    // Collect images data
    if (group.images) {
      group.images.forEach((img, imgIndex) => {
        const tabInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-tab`);
        const altInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-alt`);
        const desInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-description`);

        if (tabInput) img.tab = tabInput.value;
        if (altInput) img.alt = altInput.value;
        if (desInput) img.des = desInput.value;
      });
    }
  });
}
