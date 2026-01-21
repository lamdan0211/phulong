
let contentData = {};
let imagesData = {};
let popupsData = {};
let sliderGroupsProduct = [];
let sliderGroupsPrivilege = [];
let usersData = [];

const IMAGE_GROUPS = {
  homepage: {
    title: 'Homepage',
    images: [
      { key: 'homepage_view_image', label: 'Homepage View', original: '/images/pic-view.png' },
      { key: 'homepage_circle_image', label: 'Circle Overlay', original: '/images/circle-image.png' },
      { key: 'homepage_title_image', label: 'Homepage Title', original: '/images/chuansongthuongluu.svg' },
    ]
  },

  location: {
    title: 'Location',
    images: [
      { key: 'location_title_image', label: 'Location Title', original: '/images/chuansongthuongluu.svg' },
      { key: 'location_travel_time_1', label: 'Location travel time 1', original: '/images/3phut-image.png' },
      { key: 'location_travel_time_2', label: 'Location travel time 2', original: '/images/5phut-img.png' },
      { key: 'location_travel_time_3', label: 'Location travel time 3', original: '/images/7phut-img.png' },
      { key: 'location_travel_time_4', label: 'Location travel time 4', original: '/images/10phut-img.png' },
      { key: 'location_map_image', label: 'Location map', original: '/images/map.svg' },
    ]
  },

  product: {
    title: 'Product',
    images: [
      { key: 'product_background_desktop', label: 'Background desktop', original: '/images/middle-img.png' },
      { key: 'product_background_mobile', label: 'Background mobile', original: '/images/pic-mobile/middle-img-mobile.png' },
      { key: 'product_btn_left_pc', label: 'Button Left desktop', original: '/images/btn-left.png' },
      { key: 'product_btn_left_mobile', label: 'Button Left mobile', original: '/images/pic-mobile/btn-left-mobile.png' },
      { key: 'product_btn_right_pc', label: 'Button Right desktop', original: '/images/btn-right.png' },
      { key: 'product_btn_right_mobile', label: 'Button Right mobile', original: '/images/pic-mobile/btn-right-mobile.png' },
      { key: 'product_title_image', label: 'Product Title', original: '/images/dacquyenthuongluu.svg' },
      { key: 'product_clubhouse', label: 'Product clubhouse', original: '/images/clubhouse-pic.png' },
      { key: 'product_park', label: 'Product Park', original: '/images/congvien-pic.png' },
    ]
  },

  popupShophouse: {
    title: 'Popup Shophouse',
    images: [
      { key: 'popup_shophouse_title_top_desktop', label: 'Title Image Top desktop', original: '/images/sankhaukinhdoanh.png' },
      { key: 'popup_shophouse_title_top_mobile', label: 'Title Image Top mobile', original: '/images/sankhaukinhdoanh-mobile.png' },
      { key: 'popup_shophouse_title_desktop', label: 'Title Image desktop', original: '/images/matbangtoiuu-modal.svg' },
      { key: 'popup_shophouse_tang_1_group_1_desktop', label: 'shophouse tầng 1 group 1', original: '/images/floor/left-shophouse-tang1.png' },
      { key: 'popup_shophouse_tang_1_group_1_mobile', label: 'shophouse tầng 1 group 1', original: '/images/floor/left-shophouse-tang1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_1_desktop', label: 'shophouse tầng 2 group 1', original: '/images/floor/left-shophouse-tang2.png' },
      { key: 'popup_shophouse_tang_2_group_1_mobile', label: 'shophouse tầng 2 group 1', original: '/images/floor/left-shophouse-tang2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_1_desktop', label: 'shophouse tầng 3 group 1', original: '/images/floor/left-shophouse-tang3.png' },
      { key: 'popup_shophouse_tang_3_group_1_mobile', label: 'shophouse tầng 3 group 1', original: '/images/floor/left-shophouse-tang3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_1_desktop', label: 'shophouse tầng 4 group 1', original: '/images/floor/left-shophouse-tang4.png' },
      { key: 'popup_shophouse_tang_4_group_1_mobile', label: 'shophouse tầng 4 group 1', original: '/images/floor/left-shophouse-tang4-mobile.png' },

      { key: 'popup_shophouse_tang_1_group_2_desktop', label: 'shophouse tầng 1 group 2', original: '/images/floor/right-shophouse-tang1.png' },
      { key: 'popup_shophouse_tang_1_group_2_mobile', label: 'shophouse tầng 1 group 2', original: '/images/floor/right-shophouse-tang1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_2_desktop', label: 'shophouse tầng 2 group 2', original: '/images/floor/right-shophouse-tang2.png' },
      { key: 'popup_shophouse_tang_2_group_2_mobile', label: 'shophouse tầng 2 group 2', original: '/images/floor/right-shophouse-tang2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_2_desktop', label: 'shophouse tầng 3 group 2', original: '/images/floor/right-shophouse-tang3.png' },
      { key: 'popup_shophouse_tang_3_group_2_mobile', label: 'shophouse tầng 3 group 2', original: '/images/floor/right-shophouse-tang3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_2_desktop', label: 'shophouse tầng 4 group 2', original: '/images/floor/right-shophouse-tang4.png' },
      { key: 'popup_shophouse_tang_4_group_2_mobile', label: 'shophouse tầng 4 group 2', original: '/images/floor/right-shophouse-tang4-mobile.png' },

      { key: 'popup_shophouse_tang_1_group_3_mobile', label: 'shophouse tầng 1 group 3', original: '/images/floor/text-tang-1-mobile.png' },
      { key: 'popup_shophouse_tang_2_group_3_mobile', label: 'shophouse tầng 2 group 3', original: '/images/floor/text-tang-2-mobile.png' },
      { key: 'popup_shophouse_tang_3_group_3_mobile', label: 'shophouse tầng 3 group 3', original: '/images/floor/text-tang-3-mobile.png' },
      { key: 'popup_shophouse_tang_4_group_3_mobile', label: 'shophouse tầng 4 group 3', original: '/images/floor/text-tang-4-mobile.png' },
    ]
  },

  popupRewrittenHouse: {
    title: 'Popup Rewritten House',
    images: [
      { key: 'popup_rewrittenhouse_title_top_desktop', label: 'Title Image Top desktop', original: '/images/sankhaukinhdoanh.png' },
      { key: 'popup_rewrittenhouse_title_top_mobile', label: 'Title Image Top mobile', original: '/images/sankhaukinhdoanh-mobile.png' },
      { key: 'popup_rewrittenhouse_title_desktop', label: 'Title Image desktop', original: '/images/matbangtoiuu-modal.svg' },
      { key: 'popup_rewrittenhouse_tang_1_group_1_desktop', label: 'shophouse tầng 1 group 1', original: '/images/town/left-town-1.png' },
      { key: 'popup_rewrittenhouse_tang_1_group_1_mobile', label: 'shophouse tầng 1 group 1', original: '/images/town/left-town-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_1_desktop', label: 'shophouse tầng 2 group 1', original: '/images/town/left-town-2.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_1_mobile', label: 'shophouse tầng 2 group 1', original: '/images/town/left-town-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_1_desktop', label: 'shophouse tầng 3 group 1', original: '/images/town/left-town-3.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_1_mobile', label: 'shophouse tầng 3 group 1', original: '/images/town/left-town-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_1_desktop', label: 'shophouse tầng 4 group 1', original: '/images/town/left-town-4.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_1_mobile', label: 'shophouse tầng 4 group 1', original: '/images/town/left-town-4-mobile.png' },

      { key: 'popup_rewrittenhouse_tang_1_group_2_desktop', label: 'shophouse tầng 1 group 2', original: '/images/town/right-town-1.png' },
      { key: 'popup_rewrittenhouse_tang_1_group_2_mobile', label: 'shophouse tầng 1 group 2', original: '/images/town/right-town-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_2_desktop', label: 'shophouse tầng 2 group 2', original: '/images/town/right-town-2.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_2_mobile', label: 'shophouse tầng 2 group 2', original: '/images/town/right-town-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_2_desktop', label: 'shophouse tầng 3 group 2', original: '/images/town/right-town-3.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_2_mobile', label: 'shophouse tầng 3 group 2', original: '/images/town/right-town-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_2_desktop', label: 'shophouse tầng 4 group 2', original: '/images/town/right-town-4.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_2_mobile', label: 'shophouse tầng 4 group 2', original: '/images/town/right-town-4-mobile.png' },

      { key: 'popup_rewrittenhouse_tang_1_group_3_mobile', label: 'shophouse tầng 1 group 3', original: '/images/town/town-text-1-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_2_group_3_mobile', label: 'shophouse tầng 2 group 3', original: '/images/town/town-text-2-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_3_group_3_mobile', label: 'shophouse tầng 3 group 3', original: '/images/town/town-text-3-mobile.png' },
      { key: 'popup_rewrittenhouse_tang_4_group_3_mobile', label: 'shophouse tầng 4 group 3', original: '/images/town/town-text-4-mobile.png' },
    ]
  },

  popupClubhouse: {
    title: 'Popup Club House',
    images: [
      { key: 'popup_clubhouse_title_top', label: 'Title Image Top desktop', original: '/images/title-modal-clubhouse.png' },
      { key: 'popup_clubhouse_title_desktop', label: 'Title Image desktop', original: '/images/dacquyentrainghiem.svg' },
      { key: 'popup_clubhouse_title_mobile', label: 'Title Image mobile', original: '/images/dacquyentrainghiem-mobile.svg' },

      { key: 'popup_clubhouse_floor_1', label: 'Image Floor 1', original: '/images/floor-clubhouse-modal.png' },
      { key: 'popup_clubhouse_floor_2', label: 'Image Floor 2', original: '/images/tang2-pic-map.png' },
      { key: 'popup_clubhouse_floor_3', label: 'Image Floor 3', original: '/images/tang3-pic-map.png' },
      { key: 'popup_clubhouse_floor_4', label: 'Image Floor 4', original: '/images/rooftop-pic-map.png' },
    ]
  },

  popupPark: {
    title: 'Popup Park',
    images: [
      { key: 'popup_popuppark_title_top', label: 'Title Image Top desktop', original: '/images/title-modal-park.png' },
      { key: 'popup_popuppark_title_desktop', label: 'Title Image desktop', original: '/images/tohoptienichthoithuong.svg' },
      { key: 'popup_popuppark_title_mobile', label: 'Title Image mobile', original: '/images/tohoptienichthoithuong-mobile.svg' },

      { key: 'popup_popuppark_map', label: 'Image Map Desktop', original: '/images/matbang-park-modal.png' },
      { key: 'popup_popuppark_map_mobile', label: 'Image Map Mobile', original: '/images/matbang-park-modal.png' },
    ]
  },

  floorplan: {
    title: 'Floorplan',
    images: [
      { key: 'master_plan_title_desktop', label: 'Floorplan Title Desktop', original: '/images/sapdathoanhao.png' },
      { key: 'master_plan_title_mobile', label: 'Floorplan Title Mobile', original: '/images/sapdathoanhao-mobile.png' },
    ]
  },

  news: {
    title: 'News',
    images: [
      { key: 'box_news_title', label: 'News Title Desktop', original: '/images/tamdienthongtin.svg' },
    ]
  },

  contact: {
    title: 'Contact',
    images: [
      { key: 'contact_image_title_desktop', label: 'Contact Title Desktop', original: '/images/ketnoihomnay.svg' },
      { key: 'contact_image_title_mobile', label: 'Contact Title Mobile', original: '/images/ketnoihomnay-mobile.svg' },
    ]
  },

  framedepicting: {
    title: 'Framedepicting',
    images: [
      { key: 'khung_hinh_khach_hoa_title_desktop', label: 'Framedepicting Title Desktop', original: '/images/slide-khunghinhkhachoa/title.png' },
      { key: 'khung_hinh_khach_hoa_title_mobile', label: 'Framedepicting Title Mobile', original: '/images/slide-khunghinhkhachoa/title.png' },

      { key: 'khung_hinh_khach_hoa_tong_the_desktop', label: 'Floorplan TỔNG THỂ Desktop', original: '/images/slide-khunghinhkhachoa/pic-all-view-slide.jpg' },
      { key: 'khung_hinh_khach_hoa_tong_the_mobile', label: 'Floorplan TỔNG THỂ Mobile', original: '/images/slide-khunghinhkhachoa/pic-all-view-slide.jpg' },

      { key: 'khung_hinh_khach_hoa_shophouse_desktop', label: 'Floorplan SHOPHOUSE Desktop', original: '/images/slide-khunghinhkhachoa/shophouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_shophouse_mobile', label: 'Floorplan SHOPHOUSE Mobile', original: '/images/slide-khunghinhkhachoa/shophouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_townhouse_desktop', label: 'Floorplan TOWNHOUSE Desktop', original: '/images/slide-khunghinhkhachoa/townhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_townhouse_mobile', label: 'Floorplan TOWNHOUSE Mobile', original: '/images/slide-khunghinhkhachoa/townhouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_clubhouse_desktop', label: 'Floorplan CLUBHOUSE Desktop', original: '/images/slide-khunghinhkhachoa/clubhouse_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_clubhouse_mobile', label: 'Floorplan CLUBHOUSE Mobile', original: '/images/slide-khunghinhkhachoa/clubhouse_1920x880.jpg' },

      { key: 'khung_hinh_khach_hoa_cong_vien_desktop', label: 'Floorplan CÔNG VIÊN Desktop', original: '/images/slide-khunghinhkhachoa/park_1920x880.jpg' },
      { key: 'khung_hinh_khach_hoa_cong_vien_mobile', label: 'Floorplan CÔNG VIÊN Mobile', original: '/images/slide-khunghinhkhachoa/park_1920x880.jpg' },
    ]
  },

  developer: {
    title: 'Developer',
    images: [
      { key: 'partners_image_1', label: 'Partners Logo 1', original: '/images/logo-parner-1.png' },
      { key: 'partners_image_2', label: 'Partners Logo 2', original: '/images/logo-parner-2.png' },
      { key: 'partners_image_3', label: 'Partners Logo 3', original: '/images/logo-parner-3.png' },
    ]
  },

  logos: {
    title: 'Logos & Branding',
    images: [
      { key: 'logo_broadway', label: 'Logo Broadway', original: '/images/LOGO-BROADWAY.png' },
      { key: 'logo_broadway_preload', label: 'Logo Preloader', original: '/images/LOGO-BROADWAY-PRELOAD.png' },
      { key: 'logo_phulong', label: 'Logo Phú Long', original: '/images/logo-phulong.png' },
      { key: 'slogan_graphic', label: 'Slogan Graphic', original: '/images/saibuocthoithuong.svg' },
    ]
  },
  hero: {
    title: 'Hero & Banners',
    images: [
      { key: 'banner_desktop', label: 'Banner Desktop', original: '/images/banner-top.png' },
      { key: 'banner_mobile', label: 'Banner Mobile', original: '/images/banner-top-mobile.png' },
    ]
  },
  gallery: {
    title: 'Gallery & Lifestyle',
    images: [
      { key: 'gallery_1', label: 'Gallery 1', original: '/images/pic-view.png' },
      { key: 'gallery_2', label: 'Gallery 2', original: '/images/circle-image.png' },
      { key: 'gallery_3', label: 'Gallery 3', original: '/images/clubhouse-pic.png' },
      { key: 'gallery_4', label: 'Gallery 4', original: '/images/congvien-pic.png' }
    ]
  }
};


// Tab Handling
function initTabs() {
  const tabBtns = document.querySelectorAll('.tabs > .tab-btn');
  const tabContents = document.querySelectorAll('#admin-container > .tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentTab = btn.closest('.tab-content');
      if (!parentTab) return;

      const subtabBtns = parentTab.querySelectorAll('.subtab-btn');
      const subtabContents = parentTab.querySelectorAll('.subtab-content');

      subtabBtns.forEach(b => b.classList.remove('active'));
      subtabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const subtabId = btn.getAttribute('data-subtab');
      const targetSubtab = parentTab.querySelector(`#subtab-${subtabId}`);
      if (targetSubtab) {
        targetSubtab.classList.add('active');
      }
    });
  });
}

// Data Loading
async function loadAllData() {
  try {
    const [contentRes, imagesRes, popupsRes, usersRes] = await Promise.all([
      fetch(`/api/Data/content?t=${Date.now()}`),
      fetch(`/api/Data/images?t=${Date.now()}`),
      fetch(`/api/Data/popups?t=${Date.now()}`),
      fetch(`/api/Data/users?t=${Date.now()}`)
    ]);

    if (contentRes.ok) contentData = await contentRes.json() || {};
    if (imagesRes.ok) imagesData = await imagesRes.json() || {};
    if (popupsRes.ok) popupsData = await popupsRes.json() || {};
    if (usersRes.ok) {
      const usersRaw = (await usersRes.json()) || [];
      // Normalize to PascalCase
      usersData = usersRaw.map(u => ({
        Username: u.Username || u.username || '',
        Password: u.Password || u.password || ''
      }));
    }

    // Load slider groups from imagesData
    if (imagesData.sliderGroupsProduct) {
      sliderGroupsProduct = imagesData.sliderGroupsProduct;
    }
    if (imagesData.sliderGroupsPrivilege) {
      sliderGroupsPrivilege = imagesData.sliderGroupsPrivilege;
    }

    populateTextForm(contentData);
    populatePopupsForm(popupsData);
    populateImagesForm();
    renderSliderGroups('product');
    renderSliderGroups('privilege');
    renderNewsList(); // Render News
    renderUsersTable();

    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function populateTextForm(data) {
  // Map JSON structure to form IDs
  const mapping = {
    'homepage-desc1': 'homepage.description1',
    'homepage-desc2': 'homepage.description2',
    'homepage-desc3': 'homepage.description3',
    'location-desc1': 'location.description1',
    'location-desc2': 'location.description2',
    'product-desc1': 'product.description1',
    'product-desc2': 'product.description2',
    'product-popup1-desc1': 'product.popup1description1',
    'product-popup1-desc2': 'product.popup1description2',
    'product-popup2-desc1': 'product.popup2description1',
    'product-popup3-desc1': 'product.popup3description1',
    'product-popup3-desc2': 'product.popup3description2',
    'product-popup3-tang1-tab': 'product.popup3tang1tab',
    'product-popup3-tang1-title': 'product.popup3tang1title',
    'product-popup3-tang1-desc': 'product.popup3tang1desc',
    'product-popup3-tang1-detail': 'product.popup3tang1detail',
    'product-popup3-tang2-tab': 'product.popup3tang2tab',
    'product-popup3-tang2-title': 'product.popup3tang2title',
    'product-popup3-tang2-desc': 'product.popup3tang2desc',
    'product-popup3-tang2-detail': 'product.popup3tang2detail',
    'product-popup3-tang3-tab': 'product.popup3tang3tab',
    'product-popup3-tang3-title': 'product.popup3tang3title',
    'product-popup3-tang3-desc': 'product.popup3tang3desc',
    'product-popup3-tang3-detail': 'product.popup3tang3detail',
    'product-popup3-tang4-tab': 'product.popup3tang4tab',
    'product-popup3-tang4-title': 'product.popup3tang4title',
    'product-popup3-tang4-desc': 'product.popup3tang4desc',
    'product-popup3-tang4-detail': 'product.popup3tang4detail',
    'product-popup4-desc': 'product.popup4desc',
    'product-popup4-detail': 'product.popup4detail',
    'floorplan-desc1': 'floorplan.description1',
    'floorplan-desc2': 'floorplan.description2',
    'framedepicting-tong-the': 'framedepicting.tongthe',
    'framedepicting-shophouse': 'framedepicting.shophouse',
    'framedepicting-townhouse': 'framedepicting.townhouse',
    'framedepicting-clubhouse': 'framedepicting.clubhouse',
    'framedepicting-cong-vien': 'framedepicting.congvien',
    'contact-company': 'contact.company',
    'contact-hotline': 'contact.hotline',
    'contact-email': 'contact.email',
    'contact-address': 'contact.address',
    'contact-from-info': 'contact.fromInfo',
    'contact-copyright': 'contact.copyright',
    'social-link-tiktok': 'contact.sociallinktiktok',
    'social-link-facebook': 'contact.sociallinkfacebook',
    'nav_1': 'menu.nav_1',
    'nav_2': 'menu.nav_2',
    'nav_3': 'menu.nav_3',
    'nav_4': 'menu.nav_4',
    'nav_5': 'menu.nav_5',
    'nav_6': 'menu.nav_6'
  };

  for (const [id, path] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      const value = getValueByPath(data, path);
      el.value = value || '';
    }
  }
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function setValueByPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

// Saving Data
async function saveAllData() {
  collectNewsData(); // Collect News data from DOM
  // Collect text data
  const newContentData = {};
  const mapping = {
    'homepage-desc1': 'homepage.description1',
    'homepage-desc2': 'homepage.description2',
    'homepage-desc3': 'homepage.description3',
    'location-desc1': 'location.description1',
    'location-desc2': 'location.description2',
    'product-desc1': 'product.description1',
    'product-desc2': 'product.description2',
    'product-popup1-desc1': 'product.popup1description1',
    'product-popup1-desc2': 'product.popup1description2',
    'product-popup2-desc1': 'product.popup2description1',
    'product-popup3-desc1': 'product.popup3description1',
    'product-popup3-desc2': 'product.popup3description2',
    'product-popup3-tang1-tab': 'product.popup3tang1tab',
    'product-popup3-tang1-title': 'product.popup3tang1title',
    'product-popup3-tang1-desc': 'product.popup3tang1desc',
    'product-popup3-tang1-detail': 'product.popup3tang1detail',
    'product-popup3-tang2-tab': 'product.popup3tang2tab',
    'product-popup3-tang2-title': 'product.popup3tang2title',
    'product-popup3-tang2-desc': 'product.popup3tang2desc',
    'product-popup3-tang2-detail': 'product.popup3tang2detail',
    'product-popup3-tang3-tab': 'product.popup3tang3tab',
    'product-popup3-tang3-title': 'product.popup3tang3title',
    'product-popup3-tang3-desc': 'product.popup3tang3desc',
    'product-popup3-tang3-detail': 'product.popup3tang3detail',
    'product-popup3-tang4-tab': 'product.popup3tang4tab',
    'product-popup3-tang4-title': 'product.popup3tang4title',
    'product-popup3-tang4-desc': 'product.popup3tang4desc',
    'product-popup3-tang4-detail': 'product.popup3tang4detail',
    'product-popup4-desc': 'product.popup4desc',
    'product-popup4-detail': 'product.popup4detail',
    'floorplan-desc1': 'floorplan.description1',
    'floorplan-desc2': 'floorplan.description2',
    'framedepicting-tong-the': 'framedepicting.tongthe',
    'framedepicting-shophouse': 'framedepicting.shophouse',
    'framedepicting-townhouse': 'framedepicting.townhouse',
    'framedepicting-clubhouse': 'framedepicting.clubhouse',
    'framedepicting-cong-vien': 'framedepicting.congvien',
    'contact-company': 'contact.company',
    'contact-hotline': 'contact.hotline',
    'contact-email': 'contact.email',
    'contact-address': 'contact.address',
    'contact-from-info': 'contact.fromInfo',
    'contact-copyright': 'contact.copyright',
    'social-link-tiktok': 'contact.sociallinktiktok',
    'social-link-facebook': 'contact.sociallinkfacebook',
    'nav_1': 'menu.nav_1',
    'nav_2': 'menu.nav_2',
    'nav_3': 'menu.nav_3',
    'nav_4': 'menu.nav_4',
    'nav_5': 'menu.nav_5',
    'nav_6': 'menu.nav_6'
  };

  // Update global contentData with latest values from text form mapping
  for (const [id, path] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      setValueByPath(contentData, path, el.value);
    }
  }

  try {
    await Promise.all([
      fetch('/api/Data/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData) // Send the fully updated contentData
      }),
      fetch('/api/Data/popups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popupsData)
      }),
      fetch('/api/Data/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usersData)
      })
    ]);


    window.showToast('Đã lưu tất cả thay đổi!', 'success');
  } catch (error) {
    console.error('Error saving data:', error);
    window.showToast('Có lỗi xảy ra khi lưu dữ liệu!', 'error');
  }

  try {
    // Collect slider groups data before saving
    collectSliderGroupsData('product');
    collectSliderGroupsData('privilege');
    imagesData.sliderGroupsProduct = sliderGroupsProduct;
    imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;

    await fetch('/api/Data/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imagesData)
    });
  } catch (error) {
    console.error('Error saving images:', error);
  }
}

function populateImagesForm() {
  renderAllImageGroups();
}

function renderAllImageGroups() {
  const allImagesGrid = document.getElementById('all-images-grid');
  if (allImagesGrid) allImagesGrid.innerHTML = '';

  Object.keys(IMAGE_GROUPS).forEach(groupId => {
    const group = IMAGE_GROUPS[groupId];

    // Render to specific grids if they exist
    const specificGrid = document.getElementById(`${groupId}-grid`);
    if (specificGrid) {
      specificGrid.innerHTML = '';
      group.images.forEach(img => {
        const item = createImageItem(img, groupId);
        specificGrid.appendChild(item);
      });
    }

    // Also render to 'all-images-grid' if it exists (optional, or just specific ones)
    if (allImagesGrid) {
      group.images.forEach(img => {
        const item = createImageItem(img, groupId);
        allImagesGrid.appendChild(item);
      });
    }
  });
}

function createImageItem(imageConfig, groupId) {
  const { key, label, original } = imageConfig;
  const currentUrl = imagesData[key] || '';
  const isDefault = !currentUrl || currentUrl === original;

  const div = document.createElement('div');
  div.className = 'image-list-item'; // Use the list-item class we added in CSS
  div.innerHTML = `
        <div class="image-list-info">
            <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #111;">${label}</h4>
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 2px;">ID: <span style="font-family: monospace;">${key}</span></div>
            <div style="font-size: 0.8rem; color: #999;">File gốc: ${original}</div>
        </div>
        
        <div class="image-list-visual" style="display: flex; align-items: center; gap: 15px;">
            <div class="image-preview-box" style="width: 120px; height: 70px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #eee;">
                <img src="${currentUrl || original}" alt="${label}" id="preview-${key}" 
                     class="clickable-image"
                     style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer;">
            </div>
            
            <div class="image-actions" style="display: flex; flex-direction: column; gap: 5px;">
                <input type="file" id="file-${key}" accept="image/*" style="display: none;">
                
                <button type="button" class="btn-action btn-upload" onclick="document.getElementById('file-${key}').click()" 
                        style="display: flex; align-items: center; gap: 5px; padding: 6px 12px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 0.85rem; width: 130px; justify-content: center;">
                    📁 Upload hình
                </button>
                
                <button type="button" class="btn-action btn-reset" 
                        style="display: flex; align-items: center; gap: 5px; padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; width: 130px; justify-content: center;">
                    🗑️ Xóa & Load gốc
                </button>

                <input type="text" value="${currentUrl}" id="url-${key}" placeholder="URL..." 
                       style="display: none;"> <!-- Hidden URL input, handled via upload -->
            </div>
        </div>
    `;

  // Event listeners
  // 1. File Upload
  const fileInput = div.querySelector(`#file-${key}`);
  if (fileInput) fileInput.addEventListener('change', (e) => handleImageUpload(e, key));

  // 2. Image Click (Modal)
  const imgPreview = div.querySelector(`#preview-${key}`);
  if (imgPreview) {
    imgPreview.addEventListener('click', () => {
      window.showImageModal(key, label, imgPreview.src);
    });
  }

  // 3. Reset Button
  const resetBtn = div.querySelector('.btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Use setTimeout to ensure the confirm dialog appears after all event processing
      setTimeout(() => {
        window.resetImage(key, original);
      }, 0);
    });
  }

  return div;
}

// Add reset helper
window.resetImage = function (key, original) {
  window.showConfirmDialog({
    title: '⚠️ Xác nhận reset',
    message: 'Bạn có chắc chắn muốn reset về hình gốc?',
    confirmText: 'Đồng ý',
    cancelText: 'Hủy',
    onConfirm: () => {
      imagesData[key] = ''; // Clear custom URL
      document.querySelectorAll(`[id="preview-${key}"]`).forEach(img => {
        img.src = original;
      });
      document.querySelectorAll(`[id="url-${key}"]`).forEach(input => {
        input.value = '';
      });
      setTimeout(() => { saveAllData(); }, 100);
    }
  });
}


/**
 * Unified Confirmation Dialog
 * @param {Object} options - { title, message, confirmText, cancelText, onConfirm }
 */
window.showConfirmDialog = function (options) {
  let modal = document.getElementById('global-confirm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-confirm-modal';
    modal.className = 'reset-confirm-modal';
    modal.innerHTML = `
      <div class="reset-confirm-overlay"></div>
      <div class="reset-confirm-content">
        <div class="reset-confirm-header">
          <h3 id="confirm-title">⚠️ Xác nhận</h3>
        </div>
        <div class="reset-confirm-body">
          <p id="confirm-message">Bạn có chắc chắn muốn thực hiện hành động này?</p>
        </div>
        <div class="reset-confirm-footer">
          <button class="btn-cancel" type="button" id="confirm-cancel-btn">Hủy</button>
          <button class="btn-confirm" type="button" id="confirm-ok-btn">Đồng ý</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Update content
  modal.querySelector('#confirm-title').textContent = options.title || '⚠️ Xác nhận';
  modal.querySelector('#confirm-message').textContent = options.message || '';
  const okBtn = modal.querySelector('#confirm-ok-btn');
  const cancelBtn = modal.querySelector('#confirm-cancel-btn');
  okBtn.textContent = options.confirmText || 'Đồng ý';
  cancelBtn.textContent = options.cancelText || 'Hủy';

  // Show
  modal.classList.add('show');

  // Clone buttons to clear listeners
  const newOkBtn = okBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOkBtn, okBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  const closeModal = () => modal.classList.remove('show');

  newCancelBtn.onclick = closeModal;
  modal.querySelector('.reset-confirm-overlay').onclick = closeModal;

  newOkBtn.onclick = () => {
    closeModal();
    if (typeof options.onConfirm === 'function') options.onConfirm();
  };
};

/**
 * Toast Notification System
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info'
 */
window.showToast = function (message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after animation completes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
};

// Override native alert for a more premium experience (optional, but better to use showToast directly)
// window.alert = function(msg) { window.showToast(msg, 'info'); };

async function handleImageUpload(event, key) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/Data/upload-image', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      imagesData[key] = result.url;

      // Update UI (ALL matching elements)
      document.querySelectorAll(`[id = "url-${key}"]`).forEach(el => el.value = result.url);
      document.querySelectorAll(`[id = "preview-${key}"]`).forEach(el => el.src = result.url);

    } else {
      window.showToast('Upload thất bại!', 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    window.showToast('Lỗi upload file!', 'error');
  }
}


// Popup Form Handling
function populatePopupsForm(data) {
  for (let i = 1; i <= 6; i++) {
    const typeData = data[`type${i} `] || {};
    const content = typeData.content || {};

    setInputValue(`popup - type${i} -imageDesktop`, typeData.imageDesktop || '');
    setInputValue(`popup - type${i} -imageMobile`, typeData.imageMobile || '');

    // Populate preview images
    if (typeData.imageDesktop) {
      const img = document.getElementById(`preview - popup - type${i} -imageDesktop`);
      if (img) { img.src = typeData.imageDesktop; img.style.display = 'block'; }
    }
    if (typeData.imageMobile) {
      const img = document.getElementById(`preview - popup - type${i} -imageMobile`);
      if (img) { img.src = typeData.imageMobile; img.style.display = 'block'; }
    }

    const fields = [
      'quantity', 'floor', 'landArea', 'bedrooms', 'direction',
      'constructionArea', 'density', 'totalArea', 'frontSpace',
      'backSpace', 'sideSpace'
    ];

    fields.forEach(field => {
      setInputValue(`popup - type${i} -${field} `, content[field] || '');
    });
  }
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

window.savePopupType = function (typeIndex, event) {
  event.preventDefault();
  if (!popupsData[`type${typeIndex} `]) popupsData[`type${typeIndex} `] = {};
  if (!popupsData[`type${typeIndex} `].content) popupsData[`type${typeIndex} `].content = {};

  popupsData[`type${typeIndex} `].imageDesktop = document.getElementById(`popup - type${typeIndex} -imageDesktop`).value;
  popupsData[`type${typeIndex} `].imageMobile = document.getElementById(`popup - type${typeIndex} -imageMobile`).value;

  const fields = [
    'quantity', 'floor', 'landArea', 'bedrooms', 'direction',
    'constructionArea', 'density', 'totalArea', 'frontSpace',
    'backSpace', 'sideSpace'
  ];

  fields.forEach(field => {
    const val = document.getElementById(`popup - type${typeIndex} -${field} `).value;
    popupsData[`type${typeIndex} `].content[field] = val;
  });

  saveAllData();
}

// Image Upload
window.handlePopupTypeImageUpload = async function (event, typeIndex, fieldName) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/Data/upload-image', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      const inputId = `popup - type${typeIndex} -${fieldName} `;
      document.getElementById(inputId).value = result.url;

      // Update preview
      const previewId = `preview - ${inputId} `;
      const img = document.getElementById(previewId);
      if (img) {
        img.src = result.url;
        img.style.display = 'block';
      }

    } else {
      window.showToast('Upload thất bại!', 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    window.showToast('Lỗi upload file!', 'error');
  }
}

// Data Export/Import
async function exportData() {
  const exportObj = {
    text: contentData,
    images: imagesData,
    popups: popupsData, // Include popups in export
    exportedAt: new Date().toISOString(),
    exportedBy: document.getElementById('user-email')?.innerText || 'admin'
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `essensia_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      console.log('Importing data:', importedData);

      // Handle legacy Firebase structure or new structure
      if (importedData.text) {
        contentData = importedData.text;
      } else {
        // Assume it might be contentData directly if not wrapped
        // But safer to assume structure matches export
        if (importedData.homepage) contentData = importedData; // Fallback
      }

      if (importedData.images) {
        imagesData = importedData.images;
      }

      // Legacy Firebase structure might not have 'popups' key in root, usually handled differently or inside text
      // Providing support for the user's specific legacy file if popups data is missing:
      // The user's provided JSON shows 'text', 'images' (with sliderGroups inside).
      // Popups data seems to vary. Let's try to map what we can.

      if (importedData.popups) {
        popupsData = importedData.popups;
      }

      // Save to server
      await Promise.all([
        fetch('/api/Data/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contentData)
        }),
        fetch('/api/Data/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imagesData)
        }),
        fetch('/api/Data/popups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(popupsData)
        })
      ]);

      window.showToast('Import dữ liệu thành công!', 'success');
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error('Import Error:', error);
      window.showToast('File import không hợp lệ hoặc lỗi cấu trúc!', 'error');
    }
  };
  reader.readAsText(file);
}

// Attach listeners for Export/Import
// ==========================================
// FIREBASE SYNC FUNCTIONS
// ==========================================

async function syncFromFirebase() {
  window.showConfirmDialog({
    title: '🔥 Xác nhận đồng bộ Firebase',
    message: 'Bạn có chắc chắn muốn lấy dữ liệu từ Firebase về? Hành động này sẽ ghi đè dữ liệu Slider và Tin tức hiện tại.',
    confirmText: 'Đồng ý đồng bộ',
    onConfirm: async () => {
      const btn = document.getElementById('sync-firebase-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '⏳ Đang tải...';
      btn.disabled = true;

      try {
        // Dynamic import to avoid hard dependency
        const { db } = await import('./firebase-config.js');
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        const IMAGES_COLLECTION = 'essensia_images'; // Hardcoded based on admin.js
        const TEXT_COLLECTION = 'essensia_broadway';

        console.log('Fetching from Firebase...');

        // Fetch Images Data (Slider Groups)
        const imagesDoc = await getDoc(doc(db, IMAGES_COLLECTION, 'data'));
        if (imagesDoc.exists()) {
          const remoteImagesData = imagesDoc.data();

          if (remoteImagesData.sliderGroupsProduct) {
            sliderGroupsProduct = remoteImagesData.sliderGroupsProduct;
            imagesData.sliderGroupsProduct = sliderGroupsProduct;
            console.log('Synced sliderGroupsProduct:', sliderGroupsProduct.length);
          }

          if (remoteImagesData.sliderGroupsPrivilege) {
            sliderGroupsPrivilege = remoteImagesData.sliderGroupsPrivilege;
            imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;
            console.log('Synced sliderGroupsPrivilege:', sliderGroupsPrivilege.length);
          }
        }

        // Fetch News Data
        const textDoc = await getDoc(doc(db, TEXT_COLLECTION, 'content'));
        if (textDoc.exists()) {
          const remoteContent = textDoc.data();
          if (remoteContent.news) {
            contentData.news = remoteContent.news;
            console.log('Synced News:', contentData.news);
          }
        }

        // Render updates
        renderSliderGroups('product');
        renderSliderGroups('privilege');
        renderNewsList();

        // Save to local JSON
        await saveAllData();

        window.showToast('Đồng bộ từ Firebase thành công!', 'success');

      } catch (error) {
        console.error('Firebase Sync Error:', error);
        window.showToast('Lỗi khi đồng bộ từ Firebase: ' + error.message, 'error');
      } finally {
        if (btn) {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      }
    }
  });
}

function attachGlobalListeners() {
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportData);

  const importBtn = document.getElementById('import-data-btn');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      const fileInput = document.getElementById('import-file-input');
      if (fileInput) fileInput.click();
    });
  }

  const importInput = document.getElementById('import-file-input');
  if (importInput) importInput.addEventListener('change', importData);

  const saveAllBtn = document.getElementById('save-all-btn');
  if (saveAllBtn) saveAllBtn.addEventListener('click', saveAllData);

  const syncBtn = document.getElementById('sync-firebase-btn');
  if (syncBtn) syncBtn.addEventListener('click', syncFromFirebase);
}



// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadAllData();
  attachGlobalListeners();

  // Attach save button listeners if they exist globally, or rely on individual save buttons calling functions
  document.querySelectorAll('.btn-save-all').forEach(btn => {
    btn.addEventListener('click', saveAllData);
  });

  // Make individual save buttons calls saveAllData (which saves everything)
  // In a real app we might want to save only sections, but for simplicity:
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.innerText.includes('Lưu') && !btn.id.includes('login')) {
      btn.addEventListener('click', (e) => {
        // For buttons that are not onclick="savePopupType..."
        if (!btn.getAttribute('onclick')) {
          saveAllData();
        }
      });
    }
  });

  // Popup type tabs logic
  const popupTypeBtns = document.querySelectorAll('.popup-type-btn');
  const popupTypeForms = document.querySelectorAll('.popup-type-form');

  popupTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      popupTypeBtns.forEach(b => b.classList.remove('active'));
      popupTypeForms.forEach(f => f.classList.remove('active'));

      btn.classList.add('active');
      const type = btn.getAttribute('data-popup-type');
      document.querySelector(`.popup - type - form[data - popup - type - form="${type}"]`).classList.add('active');
    });
  });
});

// ==========================================
// IMAGE MODAL FUNCTIONS
// ==========================================
window.showImageModal = function (key, label, src) {
  console.log("Opening modal for:", label);
  const modal = document.getElementById('image-modal');
  const modalTitle = document.getElementById('image-modal-title');
  const modalImg = document.getElementById('image-modal-preview');

  if (modal && modalImg) {
    if (modalTitle) modalTitle.textContent = label || key;
    modalImg.src = src;

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  } else {
    console.error("Image Modal elements not found! Make sure they are in Admin.cshtml");
  }
};

window.closeImageModal = function () {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      const modalImg = document.getElementById('image-modal-preview');
      if (modalImg) modalImg.src = '';
    }, 300);
  }
};

// Close on Escape by key
document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    window.closeImageModal();
  }
});

// ==========================================
// SLIDER GROUPS FUNCTIONS
// ==========================================

function renderSliderGroups(type = 'product') {
  const containerId = type === 'product' ? 'slider-groups-product-container' : 'slider-groups-privilege-container';
  const container = document.getElementById(containerId);
  if (!container) return;

  const groups = type === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

  container.innerHTML = '';

  if (!groups || groups.length === 0) {
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
  div.style.borderRadius = '8px';
  div.style.overflow = 'hidden';

  const imagesHTML = (group.images || []).map((img, imgIndex) => {
    const desktopSrc = img.desktop || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EChưa có hình%3C/text%3E%3C/svg%3E';
    const mobileSrc = img.mobile || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EChưa có hình%3C/text%3E%3C/svg%3E';

    return `
      <div class="slider-image-item" style="border: 1px solid #e5e7eb; margin-bottom: 1rem; border-radius: 8px; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fafb; cursor: pointer;"
             onclick="window.toggleSliderImageItem(${groupIndex}, ${imgIndex}, '${type}')">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
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
          <button class="btn-delete" onclick="event.stopPropagation(); window.deleteSliderImage(${groupIndex}, ${imgIndex}, '${type}')" style="font-size: 0.875rem; padding: 0.5rem 1rem;">🗑️ Xóa</button>
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
                     style="display: none">
              <button class="btn-action btn-upload"
                      onclick="document.getElementById('input-slider-${type}-${groupIndex}-${imgIndex}-desktop').click()"
                      style="width: 100%; font-size: 0.875rem; padding: 8px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
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
                     style="display: none">
              <button class="btn-action btn-upload"
                      onclick="document.getElementById('input-slider-${type}-${groupIndex}-${imgIndex}-mobile').click()"
                      style="width: 100%; font-size: 0.875rem; padding: 8px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                📁 Chọn Mobile
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #eff6ff;">
      <div style="flex: 1;">
        <h3 style="margin-bottom: 0.5rem; color: #1e40af;">📦 ${group.name || `Nhóm ${groupIndex + 1}`}</h3>
        <input type="text"
               id="slider-${type}-group-name-${groupIndex}"
               value="${group.name || ''}"
               placeholder="Tên nhóm (vd: Slider Thương mại)"
               style="width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
      </div>
      <button class="btn-delete" onclick="window.deleteSliderGroup(${groupIndex}, '${type}')" style="padding: 0.5rem 1rem;">🗑️ Xóa nhóm</button>
    </div>

    <div style="padding: 1rem;">
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

        <div id="slider-group-images-${type}-${groupIndex}">
          ${imagesHTML || '<p style="color: #9ca3af; text-align: center; padding: 1rem;">Chưa có hình nào. Nhấn "Thêm hình" ở dưới để bắt đầu.</p>'}
        </div>

        <div style="margin-top: 1rem; text-align: center;">
          <button class="btn-add" onclick="window.addImageToSliderGroup(${groupIndex}, '${type}')" style="font-size: 0.875rem;">
            + Thêm hình
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach file upload listeners after DOM is updated
  setTimeout(() => {
    (group.images || []).forEach((img, imgIndex) => {
      ['desktop', 'mobile'].forEach(imageType => {
        const fileInput = document.getElementById(`input-slider-${type}-${groupIndex}-${imgIndex}-${imageType}`);
        if (fileInput) {
          fileInput.addEventListener('change', (e) => handleSliderImageUpload(e, groupIndex, imgIndex, imageType, type));
        }
      });
    });
  }, 0);

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

  window.showConfirmDialog({
    title: '⚠️ Xác nhận xóa hình',
    message: 'Bạn có chắc chắn muốn xóa hình này khỏi slider?',
    onConfirm: () => {
      groups[groupIndex].images.splice(imgIndex, 1);
      renderSliderGroups(sliderType);
      saveAllData(); // Auto save for better UX
    }
  });
};

window.deleteSliderGroup = function (groupIndex, sliderType = 'product') {
  collectSliderGroupsData(sliderType);
  const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;
  const groupName = groups[groupIndex].name || `Nhóm ${groupIndex + 1}`;

  window.showConfirmDialog({
    title: '⚠️ Xác nhận xóa nhóm',
    message: `Bạn có chắc chắn muốn xóa nhóm "${groupName}" và tất cả hình ảnh bên trong? Thao tác này sẽ ghi đè dữ liệu hiện tại.`,
    confirmText: 'Đồng ý xóa',
    onConfirm: () => {
      groups.splice(groupIndex, 1);
      renderSliderGroups(sliderType);
      saveAllData();
    }
  });
};


async function handleSliderImageUpload(event, groupIndex, imgIndex, imageType, sliderType = 'product') {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    window.showToast('Vui lòng chọn file hình ảnh', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/Data/upload-image', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      const imageUrl = result.url;

      const groups = sliderType === 'product' ? sliderGroupsProduct : sliderGroupsPrivilege;

      if (!groups[groupIndex].images[imgIndex]) {
        groups[groupIndex].images[imgIndex] = {};
      }
      groups[groupIndex].images[imgIndex][imageType] = imageUrl;

      const preview = document.getElementById(`preview-slider-${sliderType}-${groupIndex}-${imgIndex}-${imageType}`);
      if (preview) {
        preview.src = imageUrl;
      }

      // Auto save
      collectSliderGroupsData('product');
      collectSliderGroupsData('privilege');
      imagesData.sliderGroupsProduct = sliderGroupsProduct;
      imagesData.sliderGroupsPrivilege = sliderGroupsPrivilege;

      await fetch('/api/Data/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imagesData)
      });

      console.log('Slider image uploaded and saved');
    } else {
      window.showToast('Upload thất bại!', 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    window.showToast('Lỗi upload file!', 'error');
  }
}

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

// Add slider group button handlers
document.getElementById('add-slider-group-product-btn')?.addEventListener('click', () => {
  collectSliderGroupsData('product');

  sliderGroupsProduct.push({
    name: `Nhóm Slider Sản phẩm ${sliderGroupsProduct.length + 1}`,
    key: `slider_product_${sliderGroupsProduct.length + 1}`,
    images: []
  });

  renderSliderGroups('product');

  setTimeout(() => {
    const container = document.getElementById('slider-groups-product-container');
    if (container && container.lastElementChild) {
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

  setTimeout(() => {
    const container = document.getElementById('slider-groups-privilege-container');
    if (container && container.lastElementChild) {
      container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
});

// ==========================================
// USER MANAGEMENT FUNCTIONS
// ==========================================

function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  usersData.forEach((user, index) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #e5e7eb';

    tr.innerHTML = `
      <td style="padding: 12px;">${user.Username || ''}</td>
      <td style="padding: 12px;">${user.Password || ''}</td>
      <td style="padding: 12px; text-align: center;">
        <button class="btn-reset btn-delete-user" data-index="${index}" 
                style="padding: 4px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;" type="button">
          🗑️ Xóa
        </button>
      </td>
    `;

    // Attach event listener for delete button with timeout pattern
    const deleteBtn = tr.querySelector('.btn-delete-user');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        setTimeout(() => {
          window.deleteUser(index);
        }, 0);
      });
    }

    tbody.appendChild(tr);
  });
}

window.addUser = function () {
  const usernameInput = document.getElementById('new-username');
  const passwordInput = document.getElementById('new-password');

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    window.showToast('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!', 'error');
    return;
  }

  // Check duplicate
  if (usersData.some(u => u.Username === username)) {
    window.showToast('Tên đăng nhập đã tồn tại!', 'error');
    return;
  }

  usersData.push({ Username: username, Password: password });

  // Clear inputs
  usernameInput.value = '';
  passwordInput.value = '';

  renderUsersTable();
  saveAllData(); // Auto save
}

window.deleteUser = function (index) {
  window.showConfirmDialog({
    title: '⚠️ Xác nhận xóa tài khoản',
    message: 'Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này không thể hoàn tác.',
    confirmText: 'Đồng ý xóa',
    onConfirm: () => {
      usersData.splice(index, 1);
      renderUsersTable();
      saveAllData();
    }
  });
}

// ==========================================
// NEWS MANAGEMENT FUNCTIONS
// ==========================================

function renderNewsList() {
  const container = document.getElementById('news-items-container');
  if (!container) return;

  const newsItems = (contentData.news && contentData.news.items) ? contentData.news.items : [];

  // Sort by order
  newsItems.sort((a, b) => (a.order || 999) - (b.order || 999));

  container.innerHTML = '';

  if (newsItems.length === 0) {
    container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem;">Chưa có tin tức nào.</p>';
    return;
  }

  newsItems.forEach((item, index) => {
    const card = createNewsItemCard(item, index);
    container.appendChild(card);
  });
}

function createNewsItemCard(item, index) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.style.border = '1px solid #e5e7eb';
  div.style.marginBottom = '1.5rem';
  div.style.borderRadius = '8px';
  div.style.background = '#fff';
  div.style.overflow = 'hidden';

  const thumbnailSrc = item.thumbnail || '';

  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; cursor: pointer;"
         onclick="window.toggleNewsItem(${index})">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span id="toggle-icon-news-${index}" style="font-size: 1.2rem; transition: transform 0.2s;">▼</span>
        <strong>Tin ${index + 1}:</strong> <span>${item.title || '(Chưa có tiêu đề)'}</span>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
         <span style="font-size: 0.85rem; color: #666;">Thứ tự:</span>
         <input type="number" class="news-order-input" data-index="${index}" value="${item.order || index + 1}" 
                onclick="event.stopPropagation()" style="width: 50px; padding: 4px;">
         <button class="btn-delete-news" data-index="${index}" style="padding: 0.25rem 0.75rem; font-size: 0.85rem;" type="button">🗑️ Xóa</button>
      </div>
    </div>

    <div id="news-content-${index}" style="padding: 1.5rem; display: none;">
      <div class="form-group">
        <label>Tiêu đề</label>
        <input type="text" class="news-title-input" data-index="${index}" value="${item.title || ''}" placeholder="Nhập tiêu đề tin tức">
      </div>
      
      <div class="form-group">
        <label>Link bài viết</label>
        <input type="text" class="news-link-input" data-index="${index}" value="${item.link || ''}" placeholder="https://...">
      </div>

      <div class="form-group">
        <label>Tóm tắt</label>
        <textarea class="news-summary-input" data-index="${index}" rows="3" placeholder="Nội dung tóm tắt...">${item.summary || ''}</textarea>
      </div>

      <div class="form-group">
        <label>Hình thumbnail</label>
        <div style="display: flex; gap: 15px; align-items: start;">
          <div style="width: 150px; height: 100px; background: #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px;">
             <img src="${thumbnailSrc}" id="preview-news-${index}" style="max-width: 100%; max-height: 100%; object-fit: cover; display: ${thumbnailSrc ? 'block' : 'none'};">
             <span style="color: #999; font-size: 0.8rem; display: ${thumbnailSrc ? 'none' : 'block'};">No Image</span>
          </div>
          <div style="flex: 1;">
             <input type="text" class="news-thumbnail-input" id="news-thumbnail-${index}" data-index="${index}" value="${thumbnailSrc}" placeholder="URL hình ảnh hoặc upload..." style="margin-bottom: 10px;">
             <input type="file" id="file-news-${index}" accept="image/*" style="display: none;" onchange="window.handleNewsImageUpload(event, ${index})">
             <button class="btn-action btn-upload" onclick="document.getElementById('file-news-${index}').click()" style="width: auto; padding: 6px 15px;">📁 Upload Thumbnail</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event listener for delete button with timeout pattern
  const deleteBtn = div.querySelector('.btn-delete-news');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      setTimeout(() => {
        window.deleteNewsItem(index);
      }, 0);
    });
  }

  return div;
}

window.toggleNewsItem = function (index) {
  const content = document.getElementById(`news-content-${index}`);
  const icon = document.getElementById(`toggle-icon-news-${index}`);
  if (content && icon) {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      icon.style.transform = 'rotate(180deg)';
    } else {
      content.style.display = 'none';
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

window.deleteNewsItem = function (index) {
  collectNewsData(); // Save current state of inputs
  window.showConfirmDialog({
    title: '⚠️ Xác nhận xóa tin tức',
    message: 'Bạn có chắc chắn muốn xóa tin tức này?',
    confirmText: 'Đồng ý xóa',
    onConfirm: () => {
      contentData.news.items.splice(index, 1);
      renderNewsList();
      saveAllData();
    }
  });
}

window.handleNewsImageUpload = async function (event, index) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/Data/upload-image', { method: 'POST', body: formData });
    if (response.ok) {
      const result = await response.json();
      document.getElementById(`news-thumbnail-${index}`).value = result.url;
      const preview = document.getElementById(`preview-news-${index}`);
      preview.src = result.url;
      preview.style.display = 'block';
      preview.nextElementSibling.style.display = 'none'; // Hide "No Image" text

      // Auto save or just update memory? Let's just update memory lazily via collect
      // But update the input value is enough for collect to pick it up later.
    } else {
      window.showToast('Upload thất bại', 'error');
    }
  } catch (err) {
    console.error(err);
    window.showToast('Lỗi upload', 'error');
  }
}

document.getElementById('add-news-btn')?.addEventListener('click', () => {
  collectNewsData(); // Capture current edits
  if (!contentData.news) contentData.news = {};
  if (!contentData.news.items) contentData.news.items = [];

  contentData.news.items.push({
    title: 'Tin tức mới',
    link: '#',
    summary: '',
    thumbnail: '',
    order: contentData.news.items.length + 1
  });

  renderNewsList();

  // Scroll to bottom
  setTimeout(() => {
    const container = document.getElementById('news-items-container');
    if (container && container.lastElementChild) container.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  }, 100);
});

function collectNewsData() {
  if (!contentData.news || !contentData.news.items) return;

  const container = document.getElementById('news-items-container');
  if (!container) return;

  // We iterate through the EXISTING array and update values from DOM if they exist
  // Caution: If the DOM order matches contentData.news.items order (which it should if we didn't reorder in DOM dynamically without re-rendering)

  // A safer way is to map based on data-index, assuming render wasn't changed
  const count = contentData.news.items.length;
  for (let i = 0; i < count; i++) {
    const titleInput = container.querySelector(`.news-title-input[data-index="${i}"]`);
    const linkInput = container.querySelector(`.news-link-input[data-index="${i}"]`);
    const summaryInput = container.querySelector(`.news-summary-input[data-index="${i}"]`);
    const thumbnailInput = container.querySelector(`.news-thumbnail-input[data-index="${i}"]`);
    const orderInput = container.querySelector(`.news-order-input[data-index="${i}"]`);

    if (titleInput) contentData.news.items[i].title = titleInput.value;
    if (linkInput) contentData.news.items[i].link = linkInput.value;
    if (summaryInput) contentData.news.items[i].summary = summaryInput.value;
    if (thumbnailInput) contentData.news.items[i].thumbnail = thumbnailInput.value;
    if (orderInput) contentData.news.items[i].order = parseInt(orderInput.value) || 999;
  }
}
