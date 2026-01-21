import { auth, db, POPUP_COLLECTION_NAME } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let uploadImageToCloudinary = null;
try {
  const cloudinaryModule = await import('./cloudinary-uploader.js');
  uploadImageToCloudinary = cloudinaryModule.uploadImageToCloudinary;
} catch (err) {
}

const TEXT_COLLECTION = 'essensia_broadway';
const IMAGES_COLLECTION = 'essensia_images';

const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const saveAllBtn = document.getElementById('save-all-btn');
const exportDataBtn = document.getElementById('export-data-btn');
const importDataBtn = document.getElementById('import-data-btn');
const importFileInput = document.getElementById('import-file-input');
const successMessage = document.getElementById('success-message');

let currentUser = null;
let contentData = {};
let imagesData = {};
let uploadedImages = {};
let uploadedDynamicImages = {};
let sliderGroupsProduct = [];
let sliderGroupsPrivilege = [];

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

      { key: 'popup_popuppark_map', label: 'Image Map Desktop', original: 'matbang-park-modal.png' },
      { key: 'popup_popuppark_map_mobile', label: 'Image Map Mobile', original: 'matbang-park-modal.png' },
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
      { key: 'khung_hinh_khach_hoa_title_desktop', label: 'Framedepicting Title Desktop', original: 'slide-khunghinhkhachoa/title.png' },
      { key: 'khung_hinh_khach_hoa_title_mobile', label: 'Framedepicting Title Mobile', original: 'slide-khunghinhkhachoa/title.png' },

      { key: 'khung_hinh_khach_hoa_tong_the_desktop', label: 'Floorplan TỔNG THỂ Desktop', original: 'slide-khunghinhkhachoa/pic-all-view-slide.jpg' },
      { key: 'khung_hinh_khach_hoa_tong_the_mobile', label: 'Floorplan TỔNG THỂ Mobile', original: 'slide-khunghinhkhachoa/pic-all-view-slide.jpg' },

      { key: 'khung_hinh_khach_hoa_shophouse_desktop', label: 'Floorplan SHOPHOUSE Desktop', original: 'slide-khunghinhkhachoa/shophouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_shophouse_mobile', label: 'Floorplan SHOPHOUSE Mobile', original: 'slide-khunghinhkhachoa/shophouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_townhouse_desktop', label: 'Floorplan TOWNHOUSE Desktop', original: 'slide-khunghinhkhachoa/townhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_townhouse_mobile', label: 'Floorplan TOWNHOUSE Mobile', original: 'slide-khunghinhkhachoa/townhouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_clubhouse_desktop', label: 'Floorplan CLUBHOUSE Desktop', original: 'slide-khunghinhkhachoa/clubhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_clubhouse_mobile', label: 'Floorplan CLUBHOUSE Mobile', original: 'slide-khunghinhkhachoa/clubhouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_cong_vien_desktop', label: 'Floorplan CÔNG VIÊN Desktop', original: 'slide-khunghinhkhachoa/park_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_cong_vien_mobile', label: 'Floorplan CÔNG VIÊN Mobile', original: 'slide-khunghinhkhachoa/park_1920x880.jpg' },
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

async function loadAllData() {
  try {
    const textDoc = await getDoc(doc(db, TEXT_COLLECTION, 'content'));
    if (textDoc.exists()) {
      contentData = textDoc.data();
      populateTextForm(contentData);
    } else {
      contentData = {};
    }

    const imagesDoc = await getDoc(doc(db, IMAGES_COLLECTION, 'data'));
    if (imagesDoc.exists()) {
      imagesData = imagesDoc.data();
    } else {
      imagesData = {};
    }

    renderAllImageGroups();

    if (imagesData.sliderGroupsProduct) {
      sliderGroupsProduct = imagesData.sliderGroupsProduct;
    }
    if (imagesData.sliderGroupsPrivilege) {
      sliderGroupsPrivilege = imagesData.sliderGroupsPrivilege;
    }
    renderSliderGroups('product');
    renderSliderGroups('privilege');
  } catch (error) {
  }
}

function populateTextForm(data) {
  if (data.homepage) {
    setValue('homepage-desc1', data.homepage.description1);
    setValue('homepage-desc2', data.homepage.description2);
    setValue('homepage-desc3', data.homepage.description3);
  }

  if (data.location) {
    setValue('location-desc1', data.location.description1);
    setValue('location-desc2', data.location.description2);
  }

  if (data.product) {
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

  if (data.floorplan) {
    setValue('floorplan-desc1', data.floorplan.description1);
    setValue('floorplan-desc2', data.floorplan.description2);
  }

  if (data.news) {
    renderNewsList(data.news.items || []);
  }

  if (data.framedepicting) {
    setValue('framedepicting-tong-the', data.framedepicting.tongthe);
    setValue('framedepicting-shophouse', data.framedepicting.shophouse);
    setValue('framedepicting-townhouse', data.framedepicting.townhouse);
    setValue('framedepicting-clubhouse', data.framedepicting.clubhouse);
    setValue('framedepicting-cong-vien', data.framedepicting.congvien);
  }

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

  if (data.menu) {
    setValue('nav_1', data.menu.nav_1);
    setValue('nav_2', data.menu.nav_2);
    setValue('nav_3', data.menu.nav_3);
    setValue('nav_4', data.menu.nav_4);
    setValue('nav_5', data.menu.nav_5);
    setValue('nav_6', data.menu.nav_6);
  }

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

function collectNewsData() {
  if (!contentData.news) contentData.news = { items: [] };

  const newsCount = document.querySelectorAll('[id^="news-item-title-"]').length;

  for (let i = 0; i < newsCount; i++) {
    const thumbnail = uploadedDynamicImages[`news_thumbnail_${i}`] || (contentData.news?.items?.[i]?.thumbnail || '');
    const orderInput = document.getElementById(`news-item-order-${i}`);
    const order = orderInput ? parseInt(orderInput.value) || (i + 1) : (i + 1);

    if (contentData.news.items[i]) {
      contentData.news.items[i].thumbnail = thumbnail || '';
      contentData.news.items[i].title = getValue(`news-item-title-${i}`) || '';
      contentData.news.items[i].summary = getValue(`news-item-summary-${i}`) || '';
      contentData.news.items[i].link = getValue(`news-item-link-${i}`) || '';
      contentData.news.items[i].order = order;
    }
  }

  contentData.news.items.sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;
    return orderA - orderB;
  });
}

function renderNewsList(items) {
  const container = document.getElementById('news-items-container');
  if (!container) return;

  container.innerHTML = '';
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.style.cssText = 'border: 1px solid #e5e7eb; margin-bottom: 1rem; border-radius: 8px; overflow: hidden;';

    const thumbnailPreview = item.thumbnail
      ? `<img src="${item.thumbnail}" alt="Thumbnail" style="max-width: 200px; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px; cursor: pointer;" onclick="window.showImageModal('news-${index}-thumbnail', 'Thumbnail ${index + 1}', this.src)">`
      : '<p style="color: #9ca3af; font-size: 0.875rem; margin-top: 8px;">Chưa có hình</p>';

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fafb; cursor: pointer;"
           onclick="window.toggleNewsItem(${index})">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span id="toggle-icon-news-${index}" style="font-size: 1.2rem; transition: transform 0.2s;">▼</span>
          <strong>Tin ${index + 1}</strong>
          <small style="color: #6b7280;">(${item.title?.substring(0, 30) || 'chưa có tiêu đề'}...)</small>
          <span style="margin-left: 1rem; color: #6b7280; font-size: 0.875rem;">Thứ tự:</span>
          <input type="number"
                 id="news-item-order-${index}"
                 value="${item.order !== undefined ? item.order : index + 1}"
                 onclick="event.stopPropagation();"
                 style="width: 60px; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                 min="1">
        </div>
        <button class="btn-delete" onclick="event.stopPropagation(); window.deleteNews(${index});" style="padding: 0.5rem 1rem;">🗑️ Xóa</button>
      </div>
      <div id="news-content-${index}" style="display: none; padding: 1rem; background: white;">
        <div class="form-group">
          <label>Thumbnail (hình đại diện)</label>
          <input type="file"
                 id="news-item-thumbnail-input-${index}"
                 accept="image/*"
                 style="display: none"
                 onchange="window.handleNewsThumbnailUpload(event, ${index})">
          <button class="upload-btn" onclick="document.getElementById('news-item-thumbnail-input-${index}').click()">
            📁 Chọn hình
          </button>
          ${thumbnailPreview}
        </div>
        <div class="form-group">
          <label>Tiêu đề</label>
          <input type="text" id="news-item-title-${index}" value="${item.title || ''}" placeholder="Tiêu đề tin tức">
        </div>
        <div class="form-group">
          <label>Tóm tắt</label>
          <textarea id="news-item-summary-${index}" rows="3" placeholder="Tóm tắt ngắn gọn">${item.summary || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Link</label>
          <input type="url" id="news-item-link-${index}" value="${item.link || ''}" placeholder="https://...">
        </div>
      </div>
    `;

    container.appendChild(div);

    const fileInput = document.getElementById(`news-item-thumbnail-input-${index}`);
    if (fileInput) {
      fileInput.addEventListener('change', (e) => handleNewsThumbnailUpload(e, index));
    }
  });
}

window.toggleNewsItem = function (index) {
  const content = document.getElementById(`news-content-${index}`);
  const icon = document.getElementById(`toggle-icon-news-${index}`);

  if (content && icon) {
    const isVisible = content.style.display !== 'none';
    content.style.display = isVisible ? 'none' : 'block';
    icon.style.transform = isVisible ? 'rotate(-90deg)' : 'rotate(0deg)';
  }
};

window.handleNewsThumbnailUpload = async function (event, index) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showErrorNotification('⚠️ Lỗi!', 'Vui lòng chọn file hình ảnh');
    return;
  }

  try {
    let imageUrl;
    const base64 = await fileToBase64(file);

    if (uploadImageToCloudinary) {
      const filename = file.name;
      const imageKey = `news_thumbnail_${index}`;
      imageUrl = await uploadImageToCloudinary(imageKey, base64, filename);
    } else {
      imageUrl = base64;
    }

    uploadedDynamicImages[`news_thumbnail_${index}`] = imageUrl;

    const preview = document.querySelector(`#news-items-container .item-card:nth-child(${index + 1}) img`);
    if (preview) {
      preview.src = imageUrl;
    }

    if (contentData.news && contentData.news.items && contentData.news.items[index]) {
      contentData.news.items[index].thumbnail = imageUrl;

      const sanitizeData = (obj) => {
        return JSON.parse(JSON.stringify(obj, (key, value) => {
          if (value === null || value === undefined) {
            return '';
          }
          return value;
        }));
      };

      const cleanContentData = sanitizeData(contentData);
      await setDoc(doc(db, TEXT_COLLECTION, 'content'), cleanContentData, { merge: true });
    }

    showSuccessNotification('✓ Thành công!', 'Đã upload và lưu hình thumbnail');
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể tải lên hình: ' + error.message);
  }
};

window.deleteNews = function (index) {
  if (confirm('Xóa tin này?')) {
    const newsItems = contentData.news?.items || [];
    newsItems.splice(index, 1);
    contentData.news = { items: newsItems };
    renderNewsList(newsItems);
  }
};

document.getElementById('add-news-btn')?.addEventListener('click', () => {
  collectNewsData();
  if (!contentData.news) contentData.news = { items: [] };
  contentData.news.items.push({
    thumbnail: '',
    title: '',
    summary: '',
    link: ''
  });
  renderNewsList(contentData.news.items);
});

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
  container.className = 'image-list-container';

  group.images.forEach(imageConfig => {
    const imageItem = createImageItem(imageConfig, groupKey);
    container.appendChild(imageItem);
  });
}

function createImageItem(imageConfig, groupKey) {
  const { key, label, original } = imageConfig;
  const div = document.createElement('div');
  div.className = 'image-list-item';

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
                   onchange="window.handleImageUpload(event, '${key}', '${groupKey}')">
            <button class="upload-btn" onclick="document.getElementById('input-${key}').click()">
              ${isUploaded ? '🔄 Thay đổi' : '📁 Upload hình'}
            </button>
            <button class="btn-delete" onclick="window.deleteImageFromFirebase('${key}', '${groupKey}')" style="margin-top: 0.5rem;">
              🗑️ Xóa & Load gốc
            </button>
            ${isUploaded ? '<small style="color: #10b981; display: block; margin-top: 0.5rem;">✓ Đã upload</small>' : ''}
        </div>
    `;

  const fileInput = div.querySelector(`#input-${key}`);
  if (fileInput) {
    fileInput.addEventListener('change', (e) => handleImageUpload(e, key, groupKey));
  }

  return div;
}

window.handleImageUpload = async function (event, imageKey, groupKey) {
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
    const uploadBtn = event.target.nextElementSibling;
    if (uploadBtn) {
      uploadBtn.innerHTML = '<span class="spinner"></span> Đang upload...';
      uploadBtn.disabled = true;
    }

    let imageUrl;
    const base64 = await fileToBase64(file);

    if (uploadImageToCloudinary) {
      const filename = getOriginalFilename(imageKey);
      imageUrl = await uploadImageToCloudinary(imageKey, base64, filename);
    } else {
      imageUrl = base64;
    }

    uploadedImages[imageKey] = imageUrl;
    imagesData[imageKey] = imageUrl;

    const preview = document.getElementById(`preview-${imageKey}`);
    if (preview) {
      preview.src = imageUrl;
    }

    await setDoc(doc(db, IMAGES_COLLECTION, 'data'), imagesData, { merge: true });

    if (uploadBtn) {
      uploadBtn.innerHTML = '🔄 Thay đổi';
      uploadBtn.disabled = false;
      if (uploadBtn.nextElementSibling && uploadBtn.nextElementSibling.tagName === 'SMALL') {
        uploadBtn.nextElementSibling.style.display = 'block';
      } else {
        const checkmark = document.createElement('small');
        checkmark.style.cssText = 'color: #10b981; display: block; margin-top: 0.5rem;';
        checkmark.textContent = '✓ Đã lưu';
        uploadBtn.parentElement.appendChild(checkmark);
      }
    }

    showSuccessNotification('✓ Thành công!', 'Đã upload và lưu hình');
  } catch (error) {
    const uploadBtn = event.target.nextElementSibling;
    if (uploadBtn) {
      uploadBtn.innerHTML = '📁 Upload hình';
      uploadBtn.disabled = false;
    }
    showErrorNotification('❌ Lỗi!', 'Không thể upload hình: ' + error.message);
  }
};

window.deleteImageFromFirebase = async function (imageKey, groupKey) {
  if (!confirm('Xóa hình đã upload và load lại hình gốc?')) {
    return;
  }

  try {
    delete uploadedImages[imageKey];
    delete imagesData[imageKey];

    const updateData = {};
    updateData[imageKey] = deleteField();

    await updateDoc(doc(db, IMAGES_COLLECTION, 'data'), updateData);

    const preview = document.getElementById(`preview-${imageKey}`);
    if (preview) {
      const original = getOriginalFilename(imageKey);
      preview.src = `images/${original}`;
    }

    showSuccessNotification('✓ Thành công!', 'Đã xóa hình và load lại hình gốc');
    renderImageGroup(groupKey);
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể xóa hình: ' + error.message);
  }
};

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getOriginalFilename(imageKey) {
  for (const group of Object.values(IMAGE_GROUPS)) {
    const image = group.images.find(img => img.key === imageKey);
    if (image) {
      return image.original;
    }
  }
  return `${imageKey}.png`;
}

function collectTextData() {
  contentData.homepage = {
    description1: getValue('homepage-desc1') || '',
    description2: getValue('homepage-desc2') || '',
    description3: getValue('homepage-desc3') || ''
  };

  contentData.location = {
    description1: getValue('location-desc1') || '',
    description2: getValue('location-desc2') || ''
  };

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

  contentData.floorplan = {
    description1: getValue('floorplan-desc1') || '',
    description2: getValue('floorplan-desc2') || ''
  };

  contentData.framedepicting = {
    tongthe: getValue('framedepicting-tong-the') || '',
    shophouse: getValue('framedepicting-shophouse') || '',
    townhouse: getValue('framedepicting-townhouse') || '',
    clubhouse: getValue('framedepicting-clubhouse') || '',
    congvien: getValue('framedepicting-cong-vien') || '',
  };

  const newsItems = [];
  const newsCount = document.querySelectorAll('[id^="news-item-title-"]').length;
  for (let i = 0; i < newsCount; i++) {
    const thumbnail = uploadedDynamicImages[`news_thumbnail_${i}`] || (contentData.news?.items?.[i]?.thumbnail || '');
    const orderInput = document.getElementById(`news-item-order-${i}`);
    const order = orderInput ? parseInt(orderInput.value) || (i + 1) : (i + 1);

    newsItems.push({
      thumbnail: thumbnail || '',
      title: getValue(`news-item-title-${i}`) || '',
      summary: getValue(`news-item-summary-${i}`) || '',
      link: getValue(`news-item-link-${i}`) || '',
      order: order
    });
  }

  newsItems.sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;
    return orderA - orderB;
  });

  contentData.news = {
    items: newsItems
  };

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

  contentData.menu = {
    nav_1: getValue('nav_1') || '',
    nav_2: getValue('nav_2') || '',
    nav_3: getValue('nav_3') || '',
    nav_4: getValue('nav_4') || '',
    nav_5: getValue('nav_5') || '',
    nav_6: getValue('nav_6') || '',
  };

  contentData.developer = {
    description: getValue('developer-description') || '',
    partnerstitle: getValue('partners_description_title') || '',
    partnersdescription1: getValue('partners_description_1') || '',
    partnersdescription2: getValue('partners_description_2') || '',
    partnersdescription3: getValue('partners_description_3') || '',
  }

}

window.showImageModal = function (key, label, src) {
  const existingModal = document.getElementById('image-modal');
  if (existingModal) {
    existingModal.remove();
  }

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

  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
};

function showSuccessNotification(title, message) {
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
    const desktopSrc = img.desktop || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EChưa có hình%3C/text%3E%3C/svg%3E';
    const mobileSrc = img.mobile || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EChưa có hình%3C/text%3E%3C/svg%3E';

    return `
      <div class="slider-image-item"
           style="border: 1px solid #e5e7eb; margin-bottom: 1rem; border-radius: 8px; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fafb;"
             onclick="window.toggleSliderImageItem(${groupIndex}, ${imgIndex}, '${type}')">
          <div style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <span id="toggle-icon-${type}-${groupIndex}-${imgIndex}" style="font-size: 1.2rem; transition: transform 0.2s;">▼</span>
            <strong>Hình ${imgIndex + 1}</strong>
            <small style="color: #6b7280;">(${img.tab || 'chưa có tab'})</small>
            <span style="margin-left: 1rem; color: #6b7280; font-size: 0.875rem;">Thứ tự:</span>
            <input type="number"
                   id="slider-${type}-${groupIndex}-${imgIndex}-order"
                   value="${img.order !== undefined ? img.order : imgIndex + 1}"
                   onclick="event.stopPropagation();"
                   style="width: 60px; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                   min="1">
          </div>
          <button class="btn-delete" onclick="event.stopPropagation(); window.deleteSliderImage(${groupIndex}, ${imgIndex}, '${type}')" style="font-size: 0.875rem;">🗑️ Xóa</button>
        </div>

        <div id="slider-content-${type}-${groupIndex}-${imgIndex}" style="display: none; padding: 1rem;">
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
      <h4 style="margin-bottom: 1rem;">Hình trong nhóm (${(group.images || []).length})</h4>

      <div id="slider-group-images-${groupIndex}">
        ${imagesHTML || '<p style="color: #9ca3af; text-align: center; padding: 1rem;">Chưa có hình nào. Nhấn "Thêm hình" ở dưới để bắt đầu.</p>'}
      </div>

      <div style="margin-top: 1rem; text-align: center;">
        <button class="btn-add" onclick="window.addImageToSliderGroup(${groupIndex}, '${type}')" style="font-size: 0.875rem;">
          + Thêm hình
        </button>
      </div>
    </div>
  `;

  return div;
}


window.toggleSliderImageItem = function (groupIndex, imgIndex, type) {
  const contentDiv = document.getElementById(`slider-content-${type}-${groupIndex}-${imgIndex}`);
  const iconSpan = document.getElementById(`toggle-icon-${type}-${groupIndex}-${imgIndex}`);

  if (contentDiv && iconSpan) {
    if (contentDiv.style.display === 'none') {
      contentDiv.style.display = 'block';
      iconSpan.style.transform = 'rotate(180deg)';
    } else {
      contentDiv.style.display = 'none';
      iconSpan.style.transform = 'rotate(0deg)';
    }
  }
};

window.addImageToSliderGroup = function (groupIndex, sliderType = 'product') {
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  if (!groups[groupIndex].images) {
    groups[groupIndex].images = [];
  }

  // Get next order number
  const nextOrder = groups[groupIndex].images.length + 1;

  groups[groupIndex].images.push({
    tab: '',
    alt: '',
    des: '',
    desktop: null,
    mobile: null,
    order: nextOrder
  });

  renderSliderGroups(sliderType);
};

window.deleteSliderImage = function (groupIndex, imgIndex, sliderType = 'product') {
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  if (confirm('Xóa hình này khỏi slider?')) {
    groups[groupIndex].images.splice(imgIndex, 1);
    renderSliderGroups(sliderType);
  }
};

window.deleteSliderGroup = function (groupIndex, sliderType = 'product') {
  collectSliderGroupsData(sliderType);

  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;
  const groupName = groups[groupIndex].name || `Nhóm ${groupIndex + 1}`;

  if (confirm(`Xóa toàn bộ nhóm "${groupName}"?\n\nLưu ý: Tất cả hình trong nhóm này sẽ bị xóa!`)) {
    groups.splice(groupIndex, 1);
    renderSliderGroups(sliderType);
  }
};

window.handleSliderImageUpload = async function (event, groupIndex, imgIndex, imageType, sliderType = 'product') {
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
    let imageUrl;
    const base64 = await fileToBase64(file);

    if (uploadImageToCloudinary) {
      const filename = file.name;
      const imageKey = `slider_${sliderType}_${groupIndex}_${imgIndex}_${imageType}`;
      imageUrl = await uploadImageToCloudinary(imageKey, base64, filename);
    } else {
      imageUrl = base64;
    }

    const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

    if (!groups[groupIndex].images[imgIndex]) {
      groups[groupIndex].images[imgIndex] = {};
    }
    groups[groupIndex].images[imgIndex][imageType] = imageUrl;

    const preview = document.getElementById(`preview-slider-${sliderType}-${groupIndex}-${imgIndex}-${imageType}`);
    if (preview) {
      preview.src = imageUrl;
    }

    collectSliderGroupsData('product');
    collectSliderGroupsData('privilege');
    imagesData.sliderGroupsProduct = sliderGroupsProduct;
    imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;

    await setDoc(doc(db, IMAGES_COLLECTION, 'data'), imagesData, { merge: true });

    showSuccessNotification('✓ Thành công!', 'Đã upload và lưu hình slider');
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể xử lý hình: ' + error.message);
  }
};

document.getElementById('add-slider-group-product-btn')?.addEventListener('click', () => {
  collectSliderGroupsData('product');

  sliderGroupsProduct.push({
    name: `Nhóm Slider Sản phẩm ${sliderGroupsProduct.length + 1}`,
    key: `slider_product_${sliderGroupsProduct.length + 1}`,
    images: []
  });

  renderSliderGroups('product');

  // Scroll to new group
  setTimeout(() => {
    const container = document.getElementById('slider-groups-product-container');
    if (container) {
      container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
});

document.getElementById('add-slider-group-privilege-btn')?.addEventListener('click', () => {
  collectSliderGroupsData('privilege');

  sliderGroupsPrivilege.push({
    name: `Nhóm Slider Đặc quyền ${sliderGroupsPrivilege.length + 1}`,
    key: `slider_privilege_${sliderGroupsPrivilege.length + 1}`,
    images: []
  });

  renderSliderGroups('privilege');

  // Scroll to new group
  setTimeout(() => {
    const container = document.getElementById('slider-groups-privilege-container');
    if (container) {
      container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
});

function collectSliderGroupsData(type = 'product') {
  const groups = type === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  groups.forEach((group, groupIndex) => {
    const nameInput = document.getElementById(`slider-${type}-group-name-${groupIndex}`);
    const keyInput = document.getElementById(`slider-${type}-group-key-${groupIndex}`);

    if (nameInput) group.name = nameInput.value;
    if (keyInput) group.key = keyInput.value;

    if (group.images) {
      group.images.forEach((img, imgIndex) => {
        const tabInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-tab`);
        const altInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-alt`);
        const desInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-description`);
        const orderInput = document.getElementById(`slider-${type}-${groupIndex}-${imgIndex}-order`);

        if (tabInput) img.tab = tabInput.value;
        if (altInput) img.alt = altInput.value;
        if (desInput) img.des = desInput.value;
        if (orderInput) img.order = parseInt(orderInput.value) || (imgIndex + 1);
      });

      // Sort images by order
      group.images.sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
        return orderA - orderB;
      });
    }
  });
}

function collectImagesData() {
  Object.keys(uploadedImages).forEach(key => {
    imagesData[key] = uploadedImages[key];
  });

  collectSliderGroupsData('product');
  collectSliderGroupsData('privilege');

  imagesData.sliderGroupsProduct = sliderGroupsProduct;
  imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;
}

saveAllBtn?.addEventListener('click', async () => {
  if (!currentUser) {
    showErrorNotification('❌ Lỗi!', 'Bạn chưa đăng nhập');
    return;
  }

  saveAllBtn.disabled = true;
  saveAllBtn.innerHTML = '<span class="spinner"></span> Đang lưu...';

  try {
    collectTextData();
    collectImagesData();
    collectNewsData();

    const sanitizeData = (obj) => {
      return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (value === null || value === undefined) {
          return '';
        }
        return value;
      }));
    };

    const cleanContentData = sanitizeData(contentData);
    const cleanImagesData = sanitizeData(imagesData);

    await setDoc(doc(db, TEXT_COLLECTION, 'content'), cleanContentData);
    await setDoc(doc(db, IMAGES_COLLECTION, 'data'), cleanImagesData);

    showSuccessNotification('✓ Thành công!', 'Đã lưu tất cả dữ liệu');
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể lưu dữ liệu: ' + error.message);
  } finally {
    saveAllBtn.disabled = false;
    saveAllBtn.textContent = '💾 Lưu tất cả';
  }
});

exportDataBtn?.addEventListener('click', async () => {
  if (!currentUser) {
    showErrorNotification('❌ Lỗi!', 'Bạn chưa đăng nhập');
    return;
  }

  exportDataBtn.disabled = true;
  exportDataBtn.innerHTML = '<span class="spinner"></span> Đang export...';

  try {
    // Collect latest data from Firebase
    const textDoc = await getDoc(doc(db, TEXT_COLLECTION, 'content'));
    const imagesDoc = await getDoc(doc(db, IMAGES_COLLECTION, 'data'));

    const exportData = {
      text: textDoc.exists() ? textDoc.data() : {},
      images: imagesDoc.exists() ? imagesDoc.data() : {},
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.email
    };

    // Create JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `essensia-broadway-backup-${timestamp}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccessNotification('✓ Thành công!', 'Đã export dữ liệu thành công');
  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể export dữ liệu: ' + error.message);
  } finally {
    exportDataBtn.disabled = false;
    exportDataBtn.textContent = '📥 Export Data (Backup)';
  }
});

importDataBtn?.addEventListener('click', () => {
  if (!currentUser) {
    showErrorNotification('❌ Lỗi!', 'Bạn chưa đăng nhập');
    return;
  }
  importFileInput.click();
});

importFileInput?.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.json')) {
    showErrorNotification('❌ Lỗi!', 'Vui lòng chọn file JSON');
    return;
  }

  if (!confirm('⚠️ CẢNH BÁO!\n\nImport sẽ GHI ĐÈ toàn bộ dữ liệu hiện tại trên Firebase.\n\nBạn có chắc chắn muốn tiếp tục?')) {
    importFileInput.value = '';
    return;
  }

  importDataBtn.disabled = true;
  importDataBtn.innerHTML = '<span class="spinner"></span> Đang import...';

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!importedData.text || !importedData.images) {
          throw new Error('File không đúng định dạng. Cần có cả text và images data.');
        }

        await setDoc(doc(db, TEXT_COLLECTION, 'content'), importedData.text);
        await setDoc(doc(db, IMAGES_COLLECTION, 'data'), importedData.images);

        showSuccessNotification('✓ Thành công!', 'Đã import dữ liệu. Đang reload trang...');

        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (error) {
        showErrorNotification('❌ Lỗi!', 'Không thể import dữ liệu: ' + error.message);
        importDataBtn.disabled = false;
        importDataBtn.textContent = '📤 Import Data (Restore)';
      }
    };

    reader.onerror = () => {
      showErrorNotification('❌ Lỗi!', 'Không thể đọc file');
      importDataBtn.disabled = false;
      importDataBtn.textContent = '📤 Import Data (Restore)';
    };

    reader.readAsText(file);

  } catch (error) {
    showErrorNotification('❌ Lỗi!', 'Không thể import dữ liệu: ' + error.message);
    importDataBtn.disabled = false;
    importDataBtn.textContent = '📤 Import Data (Restore)';
  } finally {
    importFileInput.value = '';
  }
});

// ============================================
// POPUP TYPE MANAGEMENT
// ============================================

// Switch between popup types
document.querySelectorAll('.popup-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.popupType;

    // Update active button
    document.querySelectorAll('.popup-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active form
    document.querySelectorAll('.popup-type-form').forEach(f => f.classList.remove('active'));
    document.querySelector(`[data-popup-type-form="${type}"]`).classList.add('active');
  });
});

// Load popup data from Firestore
async function loadPopupTypeData() {
  try {
    const popupDocRef = doc(db, POPUP_COLLECTION_NAME, 'data');
    const docSnapshot = await getDoc(popupDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      for (let i = 1; i <= 6; i++) {
        const typeData = data[`type${i}`];
        if (typeData) {
          const desktopImg = typeData.imageDesktop || '';
          const mobileImg = typeData.imageMobile || '';

          const desktopInput = document.getElementById(`popup-type${i}-imageDesktop`);
          const mobileInput = document.getElementById(`popup-type${i}-imageMobile`);

          if (desktopInput) {
            desktopInput.value = desktopImg;
            const preview = document.getElementById(`preview-popup-type${i}-imageDesktop`);
            if (preview) {
              preview.src = desktopImg;
              preview.style.display = desktopImg ? 'block' : 'none';
            }
          }

          if (mobileInput) {
            mobileInput.value = mobileImg;
            const preview = document.getElementById(`preview-popup-type${i}-imageMobile`);
            if (preview) {
              preview.src = mobileImg;
              preview.style.display = mobileImg ? 'block' : 'none';
            }
          }

          if (typeData.content) {
            document.getElementById(`popup-type${i}-quantity`).value = typeData.content.quantity || '';
            document.getElementById(`popup-type${i}-floor`).value = typeData.content.floor || '';
            document.getElementById(`popup-type${i}-landArea`).value = typeData.content.landArea || '';
            document.getElementById(`popup-type${i}-bedrooms`).value = typeData.content.bedrooms || '';
            document.getElementById(`popup-type${i}-direction`).value = typeData.content.direction || '';
            document.getElementById(`popup-type${i}-constructionArea`).value = typeData.content.constructionArea || '';
            document.getElementById(`popup-type${i}-density`).value = typeData.content.density || '';
            document.getElementById(`popup-type${i}-totalArea`).value = typeData.content.totalArea || '';
            document.getElementById(`popup-type${i}-frontSpace`).value = typeData.content.frontSpace || '';
            document.getElementById(`popup-type${i}-backSpace`).value = typeData.content.backSpace || '';
            document.getElementById(`popup-type${i}-sideSpace`).value = typeData.content.sideSpace || '';
          }
        }
      }
    }
  } catch (error) {
  }
}

window.savePopupType = async function (type, event) {
  const btn = event?.target || document.querySelector(`[onclick*="savePopupType(${type})"]`);
  const originalText = btn.textContent;

  try {
    btn.disabled = true;
    btn.textContent = '⏳ Đang lưu...';

    const popupData = {
      imageDesktop: document.getElementById(`popup-type${type}-imageDesktop`).value.trim(),
      imageMobile: document.getElementById(`popup-type${type}-imageMobile`).value.trim(),
      content: {
        quantity: document.getElementById(`popup-type${type}-quantity`).value.trim(),
        floor: document.getElementById(`popup-type${type}-floor`).value.trim(),
        landArea: document.getElementById(`popup-type${type}-landArea`).value.trim(),
        bedrooms: document.getElementById(`popup-type${type}-bedrooms`).value.trim(),
        direction: document.getElementById(`popup-type${type}-direction`).value.trim(),
        constructionArea: document.getElementById(`popup-type${type}-constructionArea`).value.trim(),
        density: document.getElementById(`popup-type${type}-density`).value.trim(),
        totalArea: document.getElementById(`popup-type${type}-totalArea`).value.trim(),
        frontSpace: document.getElementById(`popup-type${type}-frontSpace`).value.trim(),
        backSpace: document.getElementById(`popup-type${type}-backSpace`).value.trim(),
        sideSpace: document.getElementById(`popup-type${type}-sideSpace`).value.trim()
      }
    };

    const popupDocRef = doc(db, POPUP_COLLECTION_NAME, 'data');
    await setDoc(popupDocRef, {
      [`type${type}`]: popupData
    }, { merge: true });

    showSuccessNotification('✅ Thành công!', `Đã lưu Type ${type} thành công!`);
  } catch (error) {
    showErrorNotification('❌ Lỗi!', `Không thể lưu Type ${type}: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
};


window.handlePopupTypeImageUpload = async function (event, type, field) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showErrorNotification('⚠️ Lỗi!', 'Vui lòng chọn file hình ảnh');
    return;
  }

  const btnId = `btn-upload-popup-type${type}-${field}`;
  const btn = document.getElementById(btnId);
  const originalText = btn ? btn.innerHTML : '📁 Upload';

  try {
    if (btn) {
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;
    }

    const base64 = await fileToBase64(file);
    let imageUrl = base64;

    if (uploadImageToCloudinary) {
      const filename = `${field}_${type}_${Date.now()}`;
      // Use a consistent key structure if needed, or unique to allow history
      // Here using unique specific to popup types
      const imageKey = `popup_type_${type}_${field}`;
      imageUrl = await uploadImageToCloudinary(imageKey, base64, file.name);
    }

    // Update Input
    const inputId = `popup-type${type}-${field}`;
    const input = document.getElementById(inputId);
    if (input) {
      input.value = imageUrl;
      // Trigger change event if needed
    }

    // Update Preview
    const previewId = `preview-popup-type${type}-${field}`;
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.src = imageUrl;
      preview.style.display = 'block';
    }

    showSuccessNotification('✓ Thành công!', 'Đã upload hình ảnh');
  } catch (error) {
    console.error(error);
    showErrorNotification('❌ Lỗi!', 'Không thể upload hình: ' + error.message);
  } finally {
    if (btn) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
    event.target.value = '';
  }
};

// Add listener for manual input changes to update preview
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 1; i <= 6; i++) {
    ['imageDesktop', 'imageMobile'].forEach(field => {
      const input = document.getElementById(`popup-type${i}-${field}`);
      if (input) {
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          const preview = document.getElementById(`preview-popup-type${i}-${field}`);
          if (preview) {
            preview.src = val;
            preview.style.display = val ? 'block' : 'none';
          }
        });
      }
    });
  }
});

const floorplanSubtabBtn = document.querySelector('[data-subtab="floorplan"]');
if (floorplanSubtabBtn) {
  floorplanSubtabBtn.addEventListener('click', () => {
    setTimeout(() => {
      loadPopupTypeData();
    }, 100);
  });
}