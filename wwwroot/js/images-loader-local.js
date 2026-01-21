
document.addEventListener('DOMContentLoaded', async () => {

  try {
    const imagesData = await loadImagesFromLocal();
    if (imagesData) {
      applyGroupImages(imagesData);

      let allSliderGroups = [];
      if (imagesData.sliderGroupsProduct) {
        allSliderGroups = allSliderGroups.concat(imagesData.sliderGroupsProduct);
      }
      if (imagesData.sliderGroupsPrivilege) {
        allSliderGroups = allSliderGroups.concat(imagesData.sliderGroupsPrivilege);
      }

      if (allSliderGroups.length > 0) {
        applySliderGroups(allSliderGroups);
        applyClubhouseSlider(allSliderGroups);
        applyParkSlider(allSliderGroups);
        refreshDynamicSliders();
      }
    }
  } catch (error) {
  }
});

async function loadImagesFromLocal() {
  try {
    const response = await fetch(`/api/Data/images?t=${Date.now()}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

function refreshDynamicSliders() {
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

function applyGroupImages(imagesData) {
  let appliedCount = 0;

  const isMobile = window.innerWidth <= 768;

  const oldMappings = {
    logo_broadway: ['img[src*="LOGO-BROADWAY.png"]:not([src*="PRELOAD"])'],
    logo_broadway_preload: ['img[src*="LOGO-BROADWAY-PRELOAD"]'],
    logo_phulong: ['img[src*="logo-phulong.png"]'],
    slogan_graphic: ['img[src*="saibuocthoithuong"]'],
    title_lifestyle: ['img[src*="chuansongthuongluu"]'],

    banner_desktop: isMobile ? [] : ['.hero-image picture source[media="(min-width: 769px)"]'],
    banner_mobile: isMobile ? ['.hero-image picture source[media="(max-width: 768px)"], .hero-image picture img'] : ['.hero-image picture img'],

    homepage_view_image: ['img[src*="pic-view.png"]'],
    homepage_circle_image: ['img[src*="circle-image.png"]'],
    homepage_title_image: ['img[src*="chuansongthuongluu.svg"]'],

    location_title_image: ['img[src*="vitrichienluoc"]'],
    location_travel_time_1: ['img[src*="3phut-image"]'],
    location_travel_time_2: ['img[src*="5phut-img"]'],
    location_travel_time_3: ['img[src*="7phut-img"]'],
    location_travel_time_4: ['img[src*="10phut-img"]'],
    location_map_image: ['img[src*="map.svg"]'],

    product_background_desktop: isMobile ? [] : ['.role-image picture source[media="(min-width: 769px)"]'],
    product_background_mobile: isMobile ? ['.role-image picture img'] : [],
    product_btn_left_pc: isMobile ? [] : ['.role-sub-image-left picture source[media="(min-width: 769px)"]'],
    product_btn_left_mobile: isMobile ? ['.role-sub-image-left picture img'] : [],
    product_btn_right_pc: isMobile ? [] : ['.role-sub-image-right picture source[media="(min-width: 769px)"]'],
    product_btn_right_mobile: isMobile ? ['.role-sub-image-right picture img'] : [],
    product_title_image: ['.clubhouse-title-section.desktop img[src*="dacquyenthuongluu"]', '.clubhouse-title-section.mobile img[src*="dacquyenthuongluu-mobile"]'],
    product_clubhouse: ['.showcase-card:first-child img[src*="clubhouse-pic"]'],
    product_park: ['.showcase-card:last-child img[src*="congvien-pic"]'],

    popup_shophouse_title_top_desktop: isMobile ? [] : ['#rolePopup .popup-banner picture source[media="(min-width: 769px)"]'],
    popup_shophouse_title_top_mobile: isMobile ? ['#rolePopup .popup-banner picture img'] : [],
    popup_shophouse_title_desktop: ['#rolePopup img[src*="matbangtoiuu-modal"]'],

    popup_shophouse_tang_1_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_1_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="1"] picture img'] : [],
    popup_shophouse_tang_2_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_2_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="2"] picture img'] : [],
    popup_shophouse_tang_3_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_3_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="3"] picture img'] : [],
    popup_shophouse_tang_4_group_1_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-left-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_4_group_1_mobile: isMobile ? ['#rolePopup .optimal-floor-left-item[data-floor="4"] picture img'] : [],

    popup_shophouse_tang_1_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_1_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="1"] picture img'] : [],
    popup_shophouse_tang_2_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_2_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="2"] picture img'] : [],
    popup_shophouse_tang_3_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_3_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="3"] picture img'] : [],
    popup_shophouse_tang_4_group_2_desktop: isMobile ? [] : ['#rolePopup .optimal-floor-right-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_shophouse_tang_4_group_2_mobile: isMobile ? ['#rolePopup .optimal-floor-right-item[data-floor="4"] picture img'] : [],

    popup_shophouse_tang_1_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="1"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_2_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="2"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_3_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="3"] picture source[media="(max-width: 769px)"]'] : [],
    popup_shophouse_tang_4_group_3_mobile: isMobile ? ['#rolePopup .optimal-floor-text-item[data-floor="4"] picture source[media="(max-width: 769px)"]'] : [],

    popup_rewrittenhouse_title_top_desktop: isMobile ? [] : ['#roleSecondPopup .popup-banner picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_title_top_mobile: isMobile ? ['#roleSecondPopup .popup-banner picture img'] : [],
    popup_rewrittenhouse_title_desktop: ['#roleSecondPopup img[src*="matbangtoiuu-modal"]'],

    popup_rewrittenhouse_tang_1_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_1_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="1"] picture img'] : [],
    popup_rewrittenhouse_tang_2_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_2_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="2"] picture img'] : [],
    popup_rewrittenhouse_tang_3_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_3_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="3"] picture img'] : [],
    popup_rewrittenhouse_tang_4_group_1_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-left-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_4_group_1_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-left-item[data-floor="4"] picture img'] : [],

    popup_rewrittenhouse_tang_1_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="1"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_1_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="1"] picture img'] : [],
    popup_rewrittenhouse_tang_2_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="2"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_2_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="2"] picture img'] : [],
    popup_rewrittenhouse_tang_3_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="3"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_3_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="3"] picture img'] : [],
    popup_rewrittenhouse_tang_4_group_2_desktop: isMobile ? [] : ['#roleSecondPopup .optimal-floor-right-item[data-floor="4"] picture source[media="(min-width: 769px)"]'],
    popup_rewrittenhouse_tang_4_group_2_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-right-item[data-floor="4"] picture img'] : [],

    popup_rewrittenhouse_tang_1_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="1"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_2_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="2"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_3_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="3"] picture source[media="(max-width: 769px)"]'] : [],
    popup_rewrittenhouse_tang_4_group_3_mobile: isMobile ? ['#roleSecondPopup .optimal-floor-text-item[data-floor="4"] picture source[media="(max-width: 769px)"]'] : [],

    popup_clubhouse_title_top: ['#clubhousePopup .popup-banner picture img[src*="title-modal-clubhouse.png"]'],
    popup_clubhouse_title_desktop: isMobile ? [] : ['#clubhousePopup .popup_clubhouse_title picture source[media="(min-width: 769px)"]'],
    popup_clubhouse_title_mobile: isMobile ? ['#clubhousePopup .popup_clubhouse_title picture source[media*="max-width"]'] : [],

    popup_clubhouse_floor_1: ['#clubhousePopup img[src*="floor-clubhouse-modal.png"]'],
    popup_clubhouse_floor_2: ['#clubhousePopup img[src*="tang2-pic-map.png"]'],
    popup_clubhouse_floor_3: ['#clubhousePopup img[src*="tang3-pic-map.png"]'],
    popup_clubhouse_floor_4: ['#clubhousePopup img[src*="rooftop-pic-map.png"]'],

    popup_popuppark_title_top: ['#congVienPopup .popup-banner img'],
    popup_popuppark_title_desktop: isMobile ? [] : ['#congVienPopup .top-content-description-park picture source[media="(min-width: 769px)"]'],
    popup_popuppark_title_mobile: isMobile ? ['#congVienPopup .top-content-description-park picture img', '#congVienPopup .top-content-description-park picture source[media="(max-width: 768px)"]'] : [],

    popup_popuppark_map: isMobile ? [] : ['#congVienPopup #parkMapImage', '#congVienPopup .park-map-wrapper picture source[media="(min-width: 769px)"]'],
    popup_popuppark_map_mobile: isMobile ? ['#congVienPopup #parkMapImage', '#congVienPopup .park-map-wrapper picture source[media="(max-width: 768px)"]'] : [],

    master_plan_title_desktop: isMobile ? [] : ['#mat-bang .master-plan-title-section picture source[media="(min-width: 769px)"]'],
    master_plan_title_mobile: isMobile ? ['#mat-bang .master-plan-title-section picture source[media*="max-width"]'] : [],

    contact_image_title_desktop: isMobile ? [] : ['#ket-noi-hom-nay .contact-form-title-section picture source[media="(min-width: 769px)"]'],
    contact_image_title_mobile: isMobile ? ['#ket-noi-hom-nay .contact-form-title-section picture source[media*="max-width"]'] : [],

    khung_hinh_khach_hoa_title_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-depiction-header picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_title_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-depiction-header picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-depiction-header picture img'] : ['#khung-hinh-khac-hoa .frame-depiction-header picture img'],

    khung_hinh_khach_hoa_tong_the_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="tong-the"] picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_tong_the_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-slide[data-tab="tong-the"] picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-slide[data-tab="tong-the"] picture img'] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="tong-the"] picture img'],

    khung_hinh_khach_hoa_shophouse_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="shophouse"] picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_shophouse_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-slide[data-tab="shophouse"] picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-slide[data-tab="shophouse"] picture img'] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="shophouse"] picture img'],

    khung_hinh_khach_hoa_townhouse_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="townhouse"] picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_townhouse_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-slide[data-tab="townhouse"] picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-slide[data-tab="townhouse"] picture img'] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="townhouse"] picture img'],

    khung_hinh_khach_hoa_clubhouse_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="clubhouse"] picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_clubhouse_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-slide[data-tab="clubhouse"] picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-slide[data-tab="clubhouse"] picture img'] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="clubhouse"] picture img'],

    khung_hinh_khach_hoa_cong_vien_desktop: isMobile ? [] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="cong-vien"] picture source[media="(min-width: 769px)"]'],
    khung_hinh_khach_hoa_cong_vien_mobile: isMobile ? ['#khung-hinh-khac-hoa .frame-slide[data-tab="cong-vien"] picture source[media="(max-width: 768px)"], #khung-hinh-khac-hoa .frame-slide[data-tab="cong-vien"] picture img'] : ['#khung-hinh-khac-hoa .frame-slide[data-tab="cong-vien"] picture img'],
  };

  Object.keys(imagesData).forEach(imageKey => {
    if (imageKey === 'dynamicImages') return;

    const imageUrl = imagesData[imageKey];

    if (!imageUrl) {
      return;
    }

    if (typeof imageUrl !== 'string') {
      return;
    }

    const isBase64 = imageUrl.startsWith('data:');
    const isRemoteURL = imageUrl.startsWith('https://') || imageUrl.startsWith('http://') || imageUrl.startsWith('/');

    if (!isBase64 && !isRemoteURL) {
      return;
    }
    const selectors = oldMappings[imageKey];
    if (!selectors || selectors.length === 0) {
      return;
    }

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = imageUrl;
          appliedCount++;
          const source = isRemoteURL ? 'Remote URL' : 'Base64';
        } else if (el.tagName === 'SOURCE') {
          el.srcset = imageUrl;
          appliedCount++;
          const source = isRemoteURL ? 'Remote URL' : 'Base64';
        } else {
          el.style.backgroundImage = `url(${imageUrl})`;
          appliedCount++;
        }
      });
    });
  });

}

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

    const sliderContainer = document.querySelector(`[data-slider-group="${key}"]`);

    if (!sliderContainer) {
      return;
    }

    const track = sliderContainer.querySelector('.frame-slider-track');
    if (!track) {
      return;
    }

    track.innerHTML = '';

    const extraSlideClass = getSliderExtraSlideClass(sliderContainer);

    images.forEach((image, index) => {
      const { desktop, mobile, tab, alt } = image;

      if (!desktop || !mobile) {
        return;
      }

      const slideDiv = document.createElement('div');
      slideDiv.className = extraSlideClass ? `frame-slide ${extraSlideClass}` : 'frame-slide';
      if (index === 0) {
        slideDiv.classList.add('active');
      }
      if (tab) {
        slideDiv.setAttribute('data-tab', tab);
      }

      const picture = document.createElement('picture');

      const desktopSource = document.createElement('source');
      desktopSource.media = '(min-width: 769px)';
      desktopSource.srcset = desktop;
      picture.appendChild(desktopSource);

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

function applyClubhouseSlider(sliderGroups) {
  if (!sliderGroups || sliderGroups.length === 0) {
    return;
  }

  const clubhouseGroup = sliderGroups.find(group =>
    group.key === 'clubhouse_slider' ||
    group.key === 'clubhouse'
  );

  if (!clubhouseGroup) {
    return;
  }

  if (!clubhouseGroup.images || clubhouseGroup.images.length === 0) {
    return;
  }

  const { images } = clubhouseGroup;

  const sliderContainer = document.querySelector('[data-slider-group="clubhouse_slider"]');
  if (!sliderContainer) {
    const fallbackContainer = document.querySelector('.clubhouse-slider:not(.popup-container .clubhouse-slider)');
    if (fallbackContainer) {
      if (!fallbackContainer.hasAttribute('data-slider-group')) {
        fallbackContainer.setAttribute('data-slider-group', 'clubhouse_slider');
      }
      return applyClubhouseSliderToContainer(fallbackContainer, images);
    }
    return;
  }

  applyClubhouseSliderToContainer(sliderContainer, images);
}

function createSlideElement(image, index) {
  const { desktop, mobile, tab, des, alt } = image;

  const slideDiv = document.createElement('div');
  slideDiv.className = 'slide';
  if (index === 0) {
    slideDiv.classList.add('active');
  }

  const picture = document.createElement('picture');

  const desktopSource = document.createElement('source');
  desktopSource.media = '(min-width: 769px)';
  desktopSource.srcset = desktop;
  picture.appendChild(desktopSource);

  const img = document.createElement('img');
  img.src = mobile;
  img.alt = alt || tab || `Slide ${index + 1}`;
  if (index === 0) {
    img.loading = 'lazy';
  }
  picture.appendChild(img);

  slideDiv.appendChild(picture);
  return slideDiv;
}

function createDescriptionElement(image, index) {
  const { tab, des } = image;

  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'slide-description fade-in stagger-2';
  if (index === 0) {
    descriptionDiv.classList.add('active');
  }
  descriptionDiv.setAttribute('data-slide', index.toString());

  if (tab) {
    const title = document.createElement('h3');
    title.className = 'slide-title';
    title.textContent = tab;
    descriptionDiv.appendChild(title);
  }

  if (des) {
    const text = document.createElement('p');
    text.className = 'slide-text';
    text.innerHTML = des;
    descriptionDiv.appendChild(text);
  }

  return descriptionDiv;
}

function applyClubhouseSliderToContainer(sliderContainer, images) {
  const slidesContainer = sliderContainer.querySelector('.slides');
  if (!slidesContainer) {
    return;
  }

  const sliderContainerDiv = sliderContainer.querySelector('.slider-container');
  if (!sliderContainerDiv) {
    return;
  }

  slidesContainer.innerHTML = '';

  const existingDescriptions = sliderContainer.querySelectorAll('.slide-description');
  existingDescriptions.forEach(desc => desc.remove());

  images.forEach((image, index) => {
    const { desktop, mobile } = image;

    if (!desktop || !mobile) {
      return;
    }

    const slideDiv = createSlideElement(image, index);
    slidesContainer.appendChild(slideDiv);

    const descriptionDiv = createDescriptionElement(image, index);
    if (sliderContainerDiv.nextSibling) {
      sliderContainer.insertBefore(descriptionDiv, sliderContainerDiv.nextSibling);
    } else {
      sliderContainer.appendChild(descriptionDiv);
    }
  });

  setTimeout(() => {
    if (typeof window.initSlider === 'function') {
      window.initSlider();
    }
  }, 500);
}

function applyParkSlider(sliderGroups) {
  if (!sliderGroups || sliderGroups.length === 0) {
    return;
  }

  const parkGroup = sliderGroups.find(group =>
    group.key === 'park_slider' ||
    group.key === 'park'
  );

  if (!parkGroup || !parkGroup.images || parkGroup.images.length === 0) {
    return;
  }

  const { images } = parkGroup;

  const sliderContainer = document.querySelector('[data-slider-group="park_slider"]');
  if (!sliderContainer) {
    return;
  }

  applyParkSliderToContainer(sliderContainer, images);
}

function applyParkSliderToContainer(sliderContainer, images) {
  const slidesContainer = sliderContainer.querySelector('.slides');
  if (!slidesContainer) {
    return;
  }

  const sliderContainerDiv = sliderContainer.querySelector('.slider-container');
  if (!sliderContainerDiv) {
    return;
  }

  slidesContainer.innerHTML = '';

  const existingDescriptions = sliderContainer.querySelectorAll('.slide-description');
  existingDescriptions.forEach(desc => desc.remove());

  const slidesData = [];
  images.forEach((image, index) => {
    const { desktop, mobile } = image;

    if (!desktop || !mobile) {
      return;
    }

    const slideDiv = createSlideElement(image, index);
    slidesContainer.appendChild(slideDiv);

    slidesData.push({ image, index });
  });

  for (let i = slidesData.length - 1; i >= 0; i--) {
    const { image, index } = slidesData[i];
    const { tab, des } = image;

    if (tab || des) {
      const descriptionDiv = createDescriptionElement(image, index);
      if (sliderContainerDiv.nextSibling) {
        sliderContainer.insertBefore(descriptionDiv, sliderContainerDiv.nextSibling);
      } else {
        sliderContainer.appendChild(descriptionDiv);
      }
    }
  }

  const firstDesc = sliderContainer.querySelector('.slide-description[data-slide="0"]');
  if (firstDesc) {
    firstDesc.classList.add('active');
  }

  setTimeout(() => {
    if (typeof window.initParkSlider === 'function') {
      window.initParkSlider();
    }
  }, 500);
}
