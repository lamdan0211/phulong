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

  try {
    const imagesData = await loadImagesFromFirebase();
    if (imagesData) {
      // Apply images from admin groups (old structure)
      applyGroupImages(imagesData);

      // Apply slider groups (new structure)
      if (imagesData.sliderGroups) {
        applySliderGroups(imagesData.sliderGroups);
        applyClubhouseSlider(imagesData.sliderGroups);
        applyParkSlider(imagesData.sliderGroups);
        refreshDynamicSliders();
      }
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

function refreshDynamicSliders() {
  // Re-init sliders after DOM updates from Firebase
  const reinit = [
    'initFrameSlider',
    'initSliderGroup1',
    'initRoleFrameSlider',
    'initRoleSecondSlider',
    'initRoleSecondModalFirstSlider',
    'initRoleSecondModalSecondSlider',
    'initParkSlider'
  ];

  setTimeout(() => {
    reinit.forEach((fn) => {
      if (typeof window[fn] === 'function') {
        window[fn]();
      }
    });
  }, 0);
}

/**
 * Apply images từ admin groups (compatibility với old structure)
 * OPTIMIZED: Chỉ load responsive images phù hợp với device
 */
function applyGroupImages(imagesData) {
  let appliedCount = 0;

  // Detect device type
  const isMobile = window.innerWidth <= 768;

  // Old IMAGE_GROUPS structure mapping
  const oldMappings = {
    // LOGOS
    logo_broadway: ['img[src*="LOGO-BROADWAY.png"]:not([src*="PRELOAD"])'],
    logo_broadway_preload: ['img[src*="LOGO-BROADWAY-PRELOAD"]'],
    logo_phulong: ['img[src*="logo-phulong.png"]'],
    slogan_graphic: ['img[src*="saibuocthoithuong"]'],
    title_lifestyle: ['img[src*="chuansongthuongluu"]'],


    // HERO & BANNERS - RESPONSIVE OPTIMIZATION
    banner_desktop: isMobile ? [] : ['.hero-image picture source[media="(min-width: 769px)"]'],
    banner_mobile: isMobile ? ['.hero-image picture source[media="(max-width: 768px)"], .hero-image picture img'] : ['.hero-image picture img'],

    // HOMEPAGE
    homepage_view_image: ['img[src*="pic-view.png"]'],
    homepage_circle_image: ['img[src*="circle-image.png"]'],
    homepage_title_image: ['img[src*="chuansongthuongluu.svg"]'],

    // LOCATION
    location_title_image: ['img[src*="vitrichienluoc"]'],
    location_travel_time_1: ['img[src*="3phut-image"]'],
    location_travel_time_2: ['img[src*="5phut-img"]'],
    location_travel_time_3: ['img[src*="7phut-img"]'],
    location_travel_time_4: ['img[src*="10phut-img"]'],
    location_map_image: ['img[src*="map.svg"]'],

    //Products
    product_background_desktop: isMobile ? [] : ['.role-image picture source[media="(min-width: 769px)"]'],
    product_background_mobile: isMobile ? ['.role-image picture img'] : [],
    product_btn_left_pc: isMobile ? [] : ['.role-sub-image-left picture source[media="(min-width: 769px)"]'],
    product_btn_left_mobile: isMobile ? ['.role-sub-image-left picture img'] : [],
    product_btn_right_pc: isMobile ? [] : ['.role-sub-image-right picture source[media="(min-width: 769px)"]'],
    product_btn_right_mobile: isMobile ? ['.role-sub-image-right picture img'] : [],
    product_title_image: ['.clubhouse-title-section.desktop img[src*="dacquyenthuongluu"]', '.clubhouse-title-section.mobile img[src*="dacquyenthuongluu-mobile"]'],
    product_clubhouse: ['.showcase-card:first-child img[src*="clubhouse-pic"]'],
    product_park: ['.showcase-card:last-child img[src*="congvien-pic"]'],

    //Popup Shophouse
    popup_shophouse_title_top_desktop: isMobile ? [] : ['#rolePopup .popup-banner picture source[media="(min-width: 769px)"]'],
    popup_shophouse_title_top_mobile: isMobile ? ['#rolePopup .popup-banner picture img'] : [],
    popup_shophouse_title_desktop: ['#rolePopup img[src*="matbangtoiuu-modal"]'],
    
    // Popup Shophouse - Group 1 (Left)
    popup_shophouse_tang_1_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_1_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="1"] picture img'] : [],
    popup_shophouse_tang_2_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_2_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="2"] picture img'] : [],
    popup_shophouse_tang_3_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_3_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="3"] picture img'] : [],
    popup_shophouse_tang_4_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_4_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="4"] picture img'] : [],

    // Popup Shophouse - Group 2 (Right)
    popup_shophouse_tang_1_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_1_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="1"] picture img'] : [],
    popup_shophouse_tang_2_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_2_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="2"] picture img'] : [],
    popup_shophouse_tang_3_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_3_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="3"] picture img'] : [],
    popup_shophouse_tang_4_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_4_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="4"] picture img'] : [],

    // Popup Shophouse - Group 3 (Text - Mobile only)
    popup_shophouse_tang_1_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="1"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_2_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="2"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_3_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="3"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_4_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="4"] picture source[media="(max-width: 769px)"]'] : [],
    
    //Popup Rewrittenhouse
    popup_rewrittenhouse_title_top_desktop: isMobile ? [] : ['#roleSecondPopup .popup-banner picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_title_top_mobile: isMobile ? ['#roleSecondPopup .popup-banner picture img'] : [],
    popup_rewrittenhouse_title_desktop: ['#roleSecondPopup img[src*="matbangtoiuu-modal"]'],
    
    // Popup Rewrittenhouse - Group 1 (Left)
    popup_rewrittenhouse_tang_1_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_1_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="1"] picture img'] : [],
    popup_rewrittenhouse_tang_2_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_2_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="2"] picture img'] : [],
    popup_rewrittenhouse_tang_3_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_3_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="3"] picture img'] : [],
    popup_rewrittenhouse_tang_4_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_4_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="4"] picture img'] : [],

    // Popup Rewrittenhouse - Group 2 (Right)
    popup_rewrittenhouse_tang_1_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_1_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="1"] picture img'] : [],
    popup_rewrittenhouse_tang_2_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_2_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="2"] picture img'] : [],
    popup_rewrittenhouse_tang_3_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_3_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="3"] picture img'] : [],
    popup_rewrittenhouse_tang_4_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_4_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="4"] picture img'] : [],

    // Popup Rewrittenhouse - Group 3 (Text - Mobile only)
    popup_rewrittenhouse_tang_1_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="1"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_2_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="2"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_3_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="3"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_4_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="4"] picture source[media="(max-width: 769px)"]'] : [],
    
    // Popup Clubhouse
    popup_clubhouse_title_top: ['#clubhousePopup .popup-banner picture img[src*="title-modal-clubhouse.png"]'],
    popup_clubhouse_title_desktop: isMobile ? [] : ['#clubhousePopup .popup_clubhouse_title picture source[media="(min-width: 769px)"]'],
    popup_clubhouse_title_mobile: isMobile ? ['#clubhousePopup .popup_clubhouse_title picture source[media*="max-width"]'] : [],
    
    popup_clubhouse_floor_1: ['#clubhousePopup img[src*="floor-clubhouse-modal.png"]'],
    popup_clubhouse_floor_2: ['#clubhousePopup img[src*="tang2-pic-map.png"]'],
    popup_clubhouse_floor_3: ['#clubhousePopup img[src*="tang3-pic-map.png"]'],
    popup_clubhouse_floor_4: ['#clubhousePopup img[src*="rooftop-pic-map.png"]'],

    // Popup Park
    popup_park_title_top_desktop: isMobile ? [] : ['#parkPopup .popup-banner picture source[media="(min-width: 769px)"]'],
    popup_park_title_top_mobile: isMobile ? ['#parkPopup .popup-banner picture img'] : [],
    popup_park_title_desktop: ['#parkPopup img[src*="matbang-park-modal"]'],
    popup_park_map_image_desktop: ['#parkPopup img[src*="matbang-park-modal"]'],
    popup_park_map_image_mobile: ['#parkPopup img[src*="matbang-park-modal-mobile"]'],
    popup_park_legend_image_desktop: ['#parkPopup img[src*="tohoptienichthoithuong"]'],
    popup_park_legend_image_mobile: ['#parkPopup img[src*="tohoptienichthoithuong-mobile"]'],

    // Floor Plan
    master_plan_title_desktop: isMobile ? [] : ['#mat-bang .master-plan-title-section picture source[media="(min-width: 769px)"]'],
    master_plan_title_mobile: isMobile ? ['#mat-bang .master-plan-title-section picture source[media*="max-width"]'] : [],

    // Contact
    contact_image_title_desktop: isMobile ? [] : ['#ket-noi-hom-nay .contact-form-title-section picture source[media="(min-width: 769px)"]'],
    contact_image_title_mobile: isMobile ? ['#ket-noi-hom-nay .contact-form-title-section picture source[media*="max-width"]'] : [],
  };

  Object.keys(imagesData).forEach(imageKey => {
    // Skip dynamicImages object
    if (imageKey === 'dynamicImages') return;

    const imageUrl = imagesData[imageKey];

    // Apply nếu có URL (Base64 hoặc remote URL)
    if (!imageUrl) {
      return;
    }

    // Kiểm tra xem có phải Base64 hay remote URL
    if (typeof imageUrl !== 'string') {
      return;
    }

    const isBase64 = imageUrl.startsWith('data:');
    const isRemoteURL = imageUrl.startsWith('https://') || imageUrl.startsWith('http://');

    if (!isBase64 && !isRemoteURL) {
      return; // Skip nếu không phải Base64 hoặc remote URL
    }
    console.log('imageKey', imageKey);
    const selectors = oldMappings[imageKey];
    if (!selectors || selectors.length === 0) {
      return;
    }

    // Apply vào tất cả selectors
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = imageUrl;
          appliedCount++;
          const source = isRemoteURL ? 'Remote URL' : 'Base64';
        } else if (el.tagName === 'SOURCE') {
          // Handle <source> element in <picture>
          el.srcset = imageUrl;
          appliedCount++;
          const source = isRemoteURL ? 'Remote URL' : 'Base64';
        } else {
          // Background image
          el.style.backgroundImage = `url(${imageUrl})`;
          appliedCount++;
        }
      });
    });
  });

  if (appliedCount > 0) {
  }
}

/**
 * Apply slider groups từ Firebase
 * Mỗi slider group có thể chứa nhiều hình, mỗi hình có 2 version (desktop + mobile)
 */
function applySliderGroups(sliderGroups) {
  if (!sliderGroups || sliderGroups.length === 0) {
    return;
  }

  let appliedSliders = 0;

  sliderGroups.forEach(group => {
    const { key, images } = group;

    if (!key || !images || images.length === 0) {
      return;
    }

    // Tìm container slider theo data-slider-group attribute
    const sliderContainer = document.querySelector(`[data-slider-group="${key}"]`);

    if (!sliderContainer) {
      return;
    }

    // Tìm track container
    const track = sliderContainer.querySelector('.frame-slider-track');
    if (!track) {
      return;
    }

    // Clear existing slides
    track.innerHTML = '';

    const extraSlideClass = getSliderExtraSlideClass(sliderContainer);

    // Generate slides from Firebase data
    images.forEach((image, index) => {
      const { desktop, mobile, tab, alt } = image;

      // Skip nếu thiếu hình
      if (!desktop || !mobile) {
        return;
      }

      // Create slide element
      const slideDiv = document.createElement('div');
      slideDiv.className = extraSlideClass ? `frame-slide ${extraSlideClass}` : 'frame-slide';
      if (index === 0) {
        slideDiv.classList.add('active'); // First slide active
      }
      if (tab) {
        slideDiv.setAttribute('data-tab', tab);
      }

      // Create picture element with responsive sources
      const picture = document.createElement('picture');

      // Desktop source
      const desktopSource = document.createElement('source');
      desktopSource.media = '(min-width: 769px)';
      desktopSource.srcset = desktop;
      picture.appendChild(desktopSource);

      // Mobile img (fallback)
      const img = document.createElement('img');
      img.src = mobile;
      img.alt = alt || `Slide ${index + 1}`;
      img.className = 'frame-slide-image';
      if (index === 0) {
        img.loading = 'lazy';
      }
      picture.appendChild(img);

      slideDiv.appendChild(picture);
      track.appendChild(slideDiv);

      appliedSliders++;
    });

  });

  if (appliedSliders > 0) {
  }
}

function getSliderExtraSlideClass(sliderContainer) {
  if (!sliderContainer || !sliderContainer.classList) return '';
  if (sliderContainer.classList.contains('role-second-slider-section')) {
    return 'role-second-slide';
  }
  if (sliderContainer.classList.contains('role-second-modal-first-slider')) {
    return 'role-second-modal-first-slide';
  }
  if (sliderContainer.classList.contains('role-second-modal-second-slider')) {
    return 'role-second-modal-second-slide';
  }
  return '';
}

/**
 * Apply clubhouse slider với title và description
 * Slider này có cấu trúc khác: có .slides và .slide-description riêng biệt
 */
function applyClubhouseSlider(sliderGroups) {
  if (!sliderGroups || sliderGroups.length === 0) {
    return;
  }

  // Tìm clubhouse slider group - thử nhiều keys có thể
  const clubhouseGroup = sliderGroups.find(group => 
    group.key === 'clubhouse_slider' || 
    group.key === 'slider_group_3' ||
    group.key === 'clubhouse'
  );
  
  if (!clubhouseGroup) {
    return;
  }

  if (!clubhouseGroup.images || clubhouseGroup.images.length === 0) {
    return;
  }

  const { images } = clubhouseGroup;

  // Tìm container slider
  const sliderContainer = document.querySelector('[data-slider-group="clubhouse_slider"]');
  if (!sliderContainer) {
    // Thử tìm bằng class
    const fallbackContainer = document.querySelector('.clubhouse-slider:not(.popup-container .clubhouse-slider)');
    if (fallbackContainer) {
      // Thêm attribute nếu chưa có
      if (!fallbackContainer.hasAttribute('data-slider-group')) {
        fallbackContainer.setAttribute('data-slider-group', 'clubhouse_slider');
      }
      return applyClubhouseSliderToContainer(fallbackContainer, images);
    }
    return;
  }

  applyClubhouseSliderToContainer(sliderContainer, images);
}

function applyClubhouseSliderToContainer(sliderContainer, images) {
  // Tìm slides container
  const slidesContainer = sliderContainer.querySelector('.slides');
  if (!slidesContainer) {
    return;
  }

  // Tìm slider-container để append descriptions sau nó
  const sliderContainerDiv = sliderContainer.querySelector('.slider-container');
  if (!sliderContainerDiv) {
    return;
  }

  // Clear existing slides
  slidesContainer.innerHTML = '';

  // Clear existing slide descriptions
  const existingDescriptions = sliderContainer.querySelectorAll('.slide-description');
  existingDescriptions.forEach(desc => desc.remove());

  // Generate slides và descriptions từ Firebase data
  images.forEach((image, index) => {
    const { desktop, mobile, tab, des, alt } = image;

    // Skip nếu thiếu hình
    if (!desktop || !mobile) {
      return;
    }

    // Create slide element
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    if (index === 0) {
      slideDiv.classList.add('active');
    }

    // Create picture element with responsive sources (giống format trong HTML)
    const picture = document.createElement('picture');
    
    // Desktop source
    const desktopSource = document.createElement('source');
    desktopSource.media = '(min-width: 769px)';
    desktopSource.srcset = desktop;
    picture.appendChild(desktopSource);

    // Mobile img (fallback)
    const img = document.createElement('img');
    img.src = mobile;
    img.alt = alt || tab || `Slide ${index + 1}`;
    if (index === 0) {
      img.loading = 'lazy';
    }
    picture.appendChild(img);

    slideDiv.appendChild(picture);
    slidesContainer.appendChild(slideDiv);

    // Create slide description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'slide-description fade-in stagger-2';
    if (index === 0) {
      descriptionDiv.classList.add('active');
    }
    descriptionDiv.setAttribute('data-slide', index.toString());

    // Title (từ tab)
    if (tab) {
      const title = document.createElement('h3');
      title.className = 'slide-title';
      title.textContent = tab;
      descriptionDiv.appendChild(title);
    }

    // Description (từ des) - dùng innerHTML để có thể load HTML
    if (des) {
      const text = document.createElement('p');
      text.className = 'slide-text';
      text.innerHTML = des; // Dùng innerHTML để có thể load HTML
      descriptionDiv.appendChild(text);
    }

    // Append description vào slider container (sau slider-container)
    // Insert sau slider-container div
    if (sliderContainerDiv.nextSibling) {
      sliderContainer.insertBefore(descriptionDiv, sliderContainerDiv.nextSibling);
    } else {
      sliderContainer.appendChild(descriptionDiv);
    }
  });

  // Re-init slider sau khi load data
  setTimeout(() => {
    if (typeof window.initSlider === 'function') {
      window.initSlider();
    }
  }, 500);
}

/**
 * Apply park slider với title và description
 */
function applyParkSlider(sliderGroups) {
  if (!sliderGroups || sliderGroups.length === 0) {
    return;
  }

  // Tìm park slider group
  const parkGroup = sliderGroups.find(group => 
    group.key === 'park_slider' || 
    group.key === 'park'
  );
  
  if (!parkGroup || !parkGroup.images || parkGroup.images.length === 0) {
    return;
  }

  const { images } = parkGroup;

  // Tìm container slider
  const sliderContainer = document.querySelector('[data-slider-group="park_slider"]');
  if (!sliderContainer) {
    return;
  }

  applyParkSliderToContainer(sliderContainer, images);
}

function applyParkSliderToContainer(sliderContainer, images) {
  // Tìm slides container
  const slidesContainer = sliderContainer.querySelector('.slides');
  if (!slidesContainer) {
    return;
  }

  // Tìm slider-container để append descriptions sau nó
  const sliderContainerDiv = sliderContainer.querySelector('.slider-container');
  if (!sliderContainerDiv) {
    return;
  }

  // Clear existing slides
  slidesContainer.innerHTML = '';

  // Clear existing slide descriptions
  const existingDescriptions = sliderContainer.querySelectorAll('.slide-description');
  existingDescriptions.forEach(desc => desc.remove());

  // Generate slides và descriptions từ Firebase data
  images.forEach((image, index) => {
    const { desktop, mobile, tab, des, alt } = image;

    // Skip nếu thiếu hình
    if (!desktop || !mobile) {
      return;
    }

    // Create slide element
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    if (index === 0) {
      slideDiv.classList.add('active');
    }

    // Create picture element with responsive sources
    const picture = document.createElement('picture');
    
    // Desktop source
    const desktopSource = document.createElement('source');
    desktopSource.media = '(min-width: 769px)';
    desktopSource.srcset = desktop;
    picture.appendChild(desktopSource);

    // Mobile img (fallback)
    const img = document.createElement('img');
    img.src = mobile;
    img.alt = alt || tab || `Slide ${index + 1}`;
    if (index === 0) {
      img.loading = 'lazy';
    }
    picture.appendChild(img);

    slideDiv.appendChild(picture);
    slidesContainer.appendChild(slideDiv);

    // Create slide description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'slide-description fade-in stagger-2';
    if (index === 0) {
      descriptionDiv.classList.add('active');
    }
    descriptionDiv.setAttribute('data-slide', index.toString());

    // Title (từ tab)
    if (tab) {
      const title = document.createElement('h3');
      title.className = 'slide-title';
      title.textContent = tab;
      descriptionDiv.appendChild(title);
    }

    // Description (từ des) - dùng innerHTML để có thể load HTML
    if (des) {
      const text = document.createElement('p');
      text.className = 'slide-text';
      text.innerHTML = des;
      descriptionDiv.appendChild(text);
    }

    // Append description vào slider container (sau slider-container)
    if (sliderContainerDiv.nextSibling) {
      sliderContainer.insertBefore(descriptionDiv, sliderContainerDiv.nextSibling);
    } else {
      sliderContainer.appendChild(descriptionDiv);
    }
  });

  // Re-init slider sau khi load data
  setTimeout(() => {
    if (typeof window.initParkSlider === 'function') {
      window.initParkSlider();
    }
  }, 500);
}