
let currentSlide = 0;
let slides = null;
let totalSlides = 0;
let tabs = null;
let sliderWrapper = null;
let autoPlayInterval = null;
let clubhouseAmenitiesCurrentSlide = -1;
let clubhouseAmenitiesPreviousSlide = -1;
let clubhouseAmenitiesSlides = null;
let clubhouseAmenitiesTotalSlides = 0;
let clubhouseAmenitiesTabs = null;
let clubhouseAmenitiesSliderWrapper = null;
let clubhouseAmenitiesAutoPlayInterval = null;
let clubhouseAmenitiesActivePanels = new Set();
let clubhouseAmenitiesPanelsOnRight = new Set();
function initSlider() {
  const mainSlider = document.querySelector('.clubhouse-slider:not(.popup-container .clubhouse-slider)');
  if (!mainSlider) {
    return false;
  }
  slides = mainSlider.querySelector('.slides');
  sliderWrapper = mainSlider.querySelector('.slider-wrapper');
  if (!slides || !sliderWrapper) {
    return false;
  }
  totalSlides = mainSlider.querySelectorAll('.slide').length;
  tabs = mainSlider.querySelectorAll('.vertical-text');
  if (totalSlides === 0) {
    return false;
  }
  currentSlide = 0;
  updateSlider();
  autoPlayInterval = setInterval(() => {
    moveSlide(1);
  }, 5000);
  sliderWrapper.addEventListener('mouseenter', () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  });
  sliderWrapper.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
      moveSlide(1);
    }, 5000);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      moveSlide(-1);
    } else if (e.key === 'ArrowRight') {
      moveSlide(1);
    }
  });
  let touchStartX = 0;
  let touchEndX = 0;
  sliderWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  sliderWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      moveSlide(1);
    }
    if (touchEndX > touchStartX + 50) {
      moveSlide(-1);
    }
  }
  return true;
}
function initClubhouseAmenitiesSlider() {
  const popup = document.getElementById('clubhousePopup');
  if (!popup) {
    return false;
  }
  const mainSlider = popup.querySelector('.clubhouse-slider');
  if (!mainSlider) {
    return false;
  }
  clubhouseAmenitiesSlides = mainSlider.querySelector('.slides');
  clubhouseAmenitiesSliderWrapper = mainSlider.querySelector('.slider-wrapper');
  const modalSlides = mainSlider.querySelectorAll('.slide');
  clubhouseAmenitiesTabs = mainSlider.querySelectorAll('.vertical-text');
  if (!clubhouseAmenitiesSlides || modalSlides.length === 0) {
    return false;
  }
  clubhouseAmenitiesTotalSlides = modalSlides.length;
  clubhouseAmenitiesCurrentSlide = -1;
  clubhouseAmenitiesPreviousSlide = -1;
  clubhouseAmenitiesActivePanels.clear();
  clubhouseAmenitiesPanelsOnRight.clear();
  modalSlides.forEach((slide) => {
    slide.classList.remove('active');
  });
  const panels = mainSlider.querySelectorAll('.panel-item');
  const panelWidth = 50;
  panels.forEach((panel, index) => {
    panel.classList.remove('active');
    const text = panel.querySelector('.vertical-text');
    if (text) text.classList.remove('active');
    panel.style.left = `${index * panelWidth}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
  });
  if (modalSlides.length > 0) {
    modalSlides[0].classList.add('active');
    clubhouseAmenitiesSlides.style.transform = 'translateX(0%)';
    clubhouseAmenitiesCurrentSlide = 0;
    clubhouseAmenitiesPreviousSlide = 0;
  }
  if (clubhouseAmenitiesAutoPlayInterval) {
    clearInterval(clubhouseAmenitiesAutoPlayInterval);
  }
  updateClubhouseAmenitiesSlider();
  clubhouseAmenitiesAutoPlayInterval = setInterval(() => {
    moveClubhouseAmenitiesSlide(1);
  }, 5000);
  clubhouseAmenitiesSliderWrapper.addEventListener('mouseenter', () => {
    if (clubhouseAmenitiesAutoPlayInterval) {
      clearInterval(clubhouseAmenitiesAutoPlayInterval);
    }
  });
  clubhouseAmenitiesSliderWrapper.addEventListener('mouseleave', () => {
    if (clubhouseAmenitiesAutoPlayInterval) {
      clearInterval(clubhouseAmenitiesAutoPlayInterval);
    }
    clubhouseAmenitiesAutoPlayInterval = setInterval(() => {
      moveClubhouseAmenitiesSlide(1);
    }, 5000);
  });
  const handleKeydown = (e) => {
    const popup = document.getElementById('clubhousePopup');
    if (popup && popup.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        moveClubhouseAmenitiesSlide(-1);
      } else if (e.key === 'ArrowRight') {
        moveClubhouseAmenitiesSlide(1);
      }
    }
  };
  document.addEventListener('keydown', handleKeydown);
  let touchStartX = 0;
  let touchEndX = 0;
  clubhouseAmenitiesSliderWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  clubhouseAmenitiesSliderWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      moveClubhouseAmenitiesSlide(1);
    }
    if (touchEndX > touchStartX + 50) {
      moveClubhouseAmenitiesSlide(-1);
    }
  }
  return true;
}
function updateClubhouseAmenitiesSlider() {
  const popup = document.getElementById('clubhousePopup');
  if (!popup || !clubhouseAmenitiesSlides) return;
  const slideDirection = clubhouseAmenitiesCurrentSlide - clubhouseAmenitiesPreviousSlide;
  if (clubhouseAmenitiesCurrentSlide >= 0) {
    clubhouseAmenitiesSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    clubhouseAmenitiesSlides.style.transform = `translateX(-${clubhouseAmenitiesCurrentSlide * 100}%)`;
  }
  const mainSlider = popup.querySelector('.clubhouse-slider');
  if (!mainSlider) return;
  const panels = mainSlider.querySelectorAll('.panel-item');
  if (clubhouseAmenitiesTabs) {
    clubhouseAmenitiesTabs.forEach((tab) => {
      const tabSlide = parseInt(tab.getAttribute('data-slide'));
      tab.classList.toggle('active', tabSlide === clubhouseAmenitiesCurrentSlide);
    });
  }
  let leftPosition = 0;
  let rightPosition = 0;
  const panelWidth = 50;
  const currentPanel = clubhouseAmenitiesCurrentSlide >= 0 ? clubhouseAmenitiesCurrentSlide : null;
  const otherPanels = [];
  panels.forEach((panel) => {
    const panelSlide = parseInt(panel.getAttribute('data-slide'));
    if (panelSlide !== currentPanel) {
      const isOnRight = clubhouseAmenitiesPanelsOnRight.has(panelSlide);
      otherPanels.push({ panel, slide: panelSlide, isOnRight });
    }
  });
  const panelsOnLeft = otherPanels.filter(p => !p.isOnRight);
  const panelsOnRight = otherPanels.filter(p => p.isOnRight);
  panelsOnLeft.sort((a, b) => a.slide - b.slide);
  panelsOnRight.sort((a, b) => b.slide - a.slide);
  panelsOnLeft.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.remove('active');
    if (text) text.classList.remove('active');
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = `${leftPosition}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
    leftPosition += panelWidth;
  });
  if (currentPanel !== null) {
    const currentPanelElement = Array.from(panels).find(p => parseInt(p.getAttribute('data-slide')) === currentPanel);
    if (currentPanelElement) {
      const text = currentPanelElement.querySelector('.vertical-text');
      currentPanelElement.classList.add('active');
      if (text) text.classList.add('active');
      const isOnRight = clubhouseAmenitiesPanelsOnRight.has(currentPanel);
      if (isOnRight) {
        const finalRight = rightPosition;
        rightPosition += panelWidth;
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = 'auto';
        currentPanelElement.style.right = `${finalRight}px`;
        currentPanelElement.style.transform = '';
      } else {
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = `${leftPosition}px`;
        currentPanelElement.style.right = 'auto';
        currentPanelElement.style.transform = '';
        leftPosition += panelWidth;
      }
    }
  }
  panelsOnRight.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.add('active');
    if (text) text.classList.remove('active');
    const finalRight = rightPosition;
    rightPosition += panelWidth;
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = 'auto';
    panel.style.right = `${finalRight}px`;
    panel.style.transform = '';
  });
  clubhouseAmenitiesPreviousSlide = clubhouseAmenitiesCurrentSlide;
  const descriptions = mainSlider.querySelectorAll('.slide-description');
  descriptions.forEach((desc) => {
    const descSlide = parseInt(desc.getAttribute('data-slide'));
    if (descSlide === clubhouseAmenitiesCurrentSlide) {
      desc.classList.add('active');
    } else {
      desc.classList.remove('active');
    }
  });
}
function moveClubhouseAmenitiesSlide(direction) {
  if (!clubhouseAmenitiesSlides || clubhouseAmenitiesTotalSlides === 0) return;
  let nextSlide = clubhouseAmenitiesCurrentSlide + direction;
  if (nextSlide < 0) {
    nextSlide = clubhouseAmenitiesTotalSlides - 1;
  } else if (nextSlide >= clubhouseAmenitiesTotalSlides) {
    nextSlide = 0;
  }
  goToClubhouseAmenitiesSlideFromTab(nextSlide);
}
function goToClubhouseAmenitiesSlideFromTab(index) {
  const popup = document.getElementById('clubhousePopup');
  if (!popup || !clubhouseAmenitiesSlides || clubhouseAmenitiesTotalSlides === 0) return;
  const isOnRight = clubhouseAmenitiesPanelsOnRight.has(index);
  if (isOnRight) {
    clubhouseAmenitiesPanelsOnRight.delete(index);
    clubhouseAmenitiesActivePanels.delete(index);
  } else {
    clubhouseAmenitiesPanelsOnRight.add(index);
    clubhouseAmenitiesActivePanels.add(index);
  }
  clubhouseAmenitiesCurrentSlide = index;
  const mainSlider = popup.querySelector('.clubhouse-slider');
  if (mainSlider) {
    const modalSlides = mainSlider.querySelectorAll('.slide');
    modalSlides.forEach((slide, idx) => {
      if (idx === clubhouseAmenitiesCurrentSlide && clubhouseAmenitiesCurrentSlide >= 0) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  clubhouseAmenitiesSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  updateClubhouseAmenitiesSlider();
}
function updateSlider() {
  if (!slides) return;
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  const mainSlider = document.querySelector('.clubhouse-slider:not(.popup-container .clubhouse-slider)');
  if (!mainSlider) return;
  const panels = mainSlider.querySelectorAll('.panel-item');
  panels.forEach((panel) => {
    const panelSlide = parseInt(panel.getAttribute('data-slide'));
    const text = panel.querySelector('.vertical-text');
    if (panelSlide === currentSlide) {
      panel.classList.add('active');
      if (text) text.classList.add('active');
    } else {
      panel.classList.remove('active');
      if (text) text.classList.remove('active');
    }
  });
  const descriptions = mainSlider.querySelectorAll('.slide-description');
  descriptions.forEach((desc) => {
    const descSlide = parseInt(desc.getAttribute('data-slide'));
    if (descSlide === currentSlide) {
      desc.classList.add('active');
    } else {
      desc.classList.remove('active');
    }
  });
  const legacyPanels = mainSlider.querySelectorAll('.left-panel, .right-panel');
  if (tabs) {
    tabs.forEach((tab) => {
      const tabSlide = parseInt(tab.getAttribute('data-slide'));
      tab.classList.toggle('active', tabSlide === currentSlide);
    });
  }
  legacyPanels.forEach((panel) => {
    const panelSlide = parseInt(panel.getAttribute('data-slide'));
    const text = panel.querySelector('.vertical-text');
    if (panelSlide === currentSlide) {
      panel.classList.add('active');
      if (text) text.classList.add('active');
    } else {
      panel.classList.remove('active');
      if (text) text.classList.remove('active');
    }
  });
}
function moveSlide(direction) {
  if (!slides || totalSlides === 0) return;
  currentSlide += direction;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  updateSlider();
}
function goToSlide(index) {
  if (!slides || totalSlides === 0) return;
  currentSlide = index;
  updateSlider();
}
function goToSlideFromTab(index) {
  const mainSlider = document.querySelector('.clubhouse-slider:not(.popup-container .clubhouse-slider)');
  if (!mainSlider) return;
  if (!slides) {
    slides = mainSlider.querySelector('.slides');
  }
  if (!slides) return;
  if (totalSlides === 0) {
    totalSlides = mainSlider.querySelectorAll('.slide').length;
  }
  if (totalSlides === 0) return;
  if (index < 0 || index >= totalSlides) return;
  if (currentSlide === index) return;
  const prevSlide = currentSlide;
  let slideDirection = 'right';
  if (index <= 1) {
    slideDirection = 'left';
  } else {
    slideDirection = 'right';
  }
  if ((index <= 1 && prevSlide > 1) || (index > 1 && prevSlide <= 1)) {
    slideDirection = index <= 1 ? 'left' : 'right';
  } else {
    slideDirection = index > prevSlide ? 'right' : 'left';
  }
  currentSlide = index;
  slides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  updateSlider();
}
function switchPlanTab(tabName) {
  const tabs = document.querySelectorAll('.plan-tab');
  const images = document.querySelectorAll('.plan-image');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  images.forEach(img => {
    if (img.id === tabName + '-img') {
      img.classList.add('active');
    } else {
      img.classList.remove('active');
    }
  });
}
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);
document.addEventListener('DOMContentLoaded', () => {
  const hasHash = window.location.hash && window.location.hash !== '';
  if (hasHash) {
    const heroOverlay = document.querySelector('.hero-animate-overlay');
    if (heroOverlay) {
      heroOverlay.style.opacity = '1';
      heroOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
      heroOverlay.style.animation = 'none';
      heroOverlay.style.willChange = 'auto';
    }
  }
  initSlider();
  initHeroAnimations();
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-in-left, .slide-in-right, .slide-in-bottom, .slide-in-top, .scale-in, .reveal'
  );
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  initParallax();
  initSmoothScroll();
  initNavbarScroll();
  if (initInfoSlider() && totalInfoSlides > 1) {
    startInfoAutoPlay();
  }
  initFrameSlider();
  initMasterPlanMapScroll();
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (infoSliderTrack && totalInfoSlides > 0) {
        const paginationContainer = document.querySelector('.info-slider-pagination');
        const isMobile = window.innerWidth <= 560;
        const itemsPerPage = isMobile ? 1 : 3;
        const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
        if (paginationContainer) {
          paginationContainer.innerHTML = '';
          if (totalPages > 1) {
            for (let i = 0; i < totalPages; i++) {
              const dot = document.createElement('span');
              dot.className = 'info-pagination-dot' + (i === currentInfoSlide ? ' active' : '');
              dot.onclick = () => goToInfoSlide(i);
              paginationContainer.appendChild(dot);
            }
            infoPaginationDots = paginationContainer.querySelectorAll('.info-pagination-dot');
          } else {
            paginationContainer.style.display = 'none';
          }
        }
        updateInfoSlider();
        if (infoAutoPlayInterval) {
          clearInterval(infoAutoPlayInterval);
          infoAutoPlayInterval = null;
        }
        if (totalInfoSlides > 1) {
          startInfoAutoPlay();
        }
      }
    }, 250);
  });
});
function initHeroAnimations() {
  const heroImage = document.querySelector('.hero-image');
  const heroBgImg = document.querySelector('.hero-bg-img');
  const heroOverlay = document.querySelector('.hero-animate-overlay');
  if (heroOverlay) {
    heroOverlay.addEventListener('animationend', function () {
      this.style.willChange = 'auto';
      this.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
      this.style.opacity = '1';
      this.classList.add('animation-complete');
    }, { once: true });
  }
  if (heroImage && heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = heroImage.offsetHeight;
      if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        const yPos = scrolled * parallaxSpeed;
        heroBgImg.style.transform = `translateY(${yPos}px) scale(1.05)`;
        heroImage.classList.add('parallax-active');
      } else {
        heroImage.classList.remove('parallax-active');
      }
    });
  }
  setTimeout(() => {
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      mainNav.style.opacity = '0';
      mainNav.style.animation = 'fadeInUp 0.8s ease-out 1s forwards';
    }
  }, 100);
}
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}
function initSmoothScroll() {
  document.documentElement.style.scrollBehavior = 'smooth';
  window.addEventListener('scroll', () => {
    updateActiveNavLink();
  });
}
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset + 150;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
function initNavbarScroll() {
  const navbar = document.querySelector('.main-nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      navbar.style.backgroundColor = 'rgba(255, 249, 240, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.backgroundColor = '';
      navbar.style.backdropFilter = '';
      navbar.style.boxShadow = '';
    }
    lastScroll = currentScroll;
  });
}
function toggleMobileNav() {
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  if (mobilePanel && hamburgerBtn) {
    mobilePanel.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    if (mobilePanel.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
let congVienCurrentSlide = 0;
let congVienSlides = null;
let congVienTotalSlides = 0;
let congVienTabs = null;
let congVienPreviousSlide = 0;
let congVienActivePanels = new Set();
let congVienPanelsOnRight = new Set();
function initCongVienSlider() {
  const popup = document.getElementById('congVienPopup');
  if (!popup) return false;
  congVienSlides = popup.querySelector('.slides');
  const modalSlides = popup.querySelectorAll('.slide');
  congVienTabs = popup.querySelectorAll('.vertical-text');
  if (!congVienSlides || modalSlides.length === 0) {
    return false;
  }
  congVienTotalSlides = modalSlides.length;
  congVienCurrentSlide = -1;
  congVienPreviousSlide = -1;
  congVienActivePanels.clear();
  congVienPanelsOnRight.clear();
  modalSlides.forEach((slide) => {
    slide.classList.remove('active');
  });
  const panels = popup.querySelectorAll('.panel-item');
  const panelWidth = 50;
  panels.forEach((panel, index) => {
    panel.classList.remove('active');
    const text = panel.querySelector('.vertical-text');
    if (text) text.classList.remove('active');
    panel.style.left = `${index * panelWidth}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
  });
  if (modalSlides.length > 0) {
    modalSlides[0].classList.add('active');
    congVienSlides.style.transform = 'translateX(0%)';
    if (panels.length > 0) {
      const firstPanel = panels[0];
      const firstText = firstPanel.querySelector('.vertical-text');
      firstPanel.classList.add('active');
      if (firstText) firstText.classList.add('active');
      congVienCurrentSlide = 0;
      congVienPreviousSlide = 0;
    }
  }
  updateCongVienSlider();
  return true;
}
function updateCongVienSlider() {
  const popup = document.getElementById('congVienPopup');
  if (!popup || !congVienSlides) return;
  const slideDirection = congVienCurrentSlide - congVienPreviousSlide;
  if (congVienCurrentSlide >= 0) {
    congVienSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    congVienSlides.style.transform = `translateX(-${congVienCurrentSlide * 100}%)`;
  }
  const panels = popup.querySelectorAll('.panel-item');
  if (congVienTabs) {
    congVienTabs.forEach((tab) => {
      const tabSlide = parseInt(tab.getAttribute('data-slide'));
      tab.classList.toggle('active', tabSlide === congVienCurrentSlide);
    });
  }
  let leftPosition = 0;
  let rightPosition = 0;
  const panelWidth = 50;
  const currentPanel = congVienCurrentSlide >= 0 ? congVienCurrentSlide : null;
  const otherPanels = [];
  panels.forEach((panel) => {
    const panelSlide = parseInt(panel.getAttribute('data-slide'));
    if (panelSlide !== currentPanel) {
      const isOnRight = congVienPanelsOnRight.has(panelSlide);
      otherPanels.push({ panel, slide: panelSlide, isOnRight });
    }
  });
  const panelsOnLeft = otherPanels.filter(p => !p.isOnRight);
  const panelsOnRight = otherPanels.filter(p => p.isOnRight);
  panelsOnLeft.sort((a, b) => a.slide - b.slide);
  panelsOnRight.sort((a, b) => b.slide - a.slide);
  panelsOnLeft.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.remove('active');
    if (text) text.classList.remove('active');
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = `${leftPosition}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
    leftPosition += panelWidth;
  });
  if (currentPanel !== null) {
    const currentPanelElement = Array.from(panels).find(p => parseInt(p.getAttribute('data-slide')) === currentPanel);
    if (currentPanelElement) {
      const text = currentPanelElement.querySelector('.vertical-text');
      currentPanelElement.classList.add('active');
      if (text) text.classList.add('active');
      const isOnRight = congVienPanelsOnRight.has(currentPanel);
      if (isOnRight) {
        const finalRight = rightPosition;
        rightPosition += panelWidth;
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = 'auto';
        currentPanelElement.style.right = `${finalRight}px`;
        currentPanelElement.style.transform = '';
      } else {
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = `${leftPosition}px`;
        currentPanelElement.style.right = 'auto';
        currentPanelElement.style.transform = '';
        leftPosition += panelWidth;
      }
    }
  }
  panelsOnRight.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.add('active');
    if (text) text.classList.remove('active');
    const finalRight = rightPosition;
    rightPosition += panelWidth;
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = 'auto';
    panel.style.right = `${finalRight}px`;
    panel.style.transform = '';
  });
  congVienPreviousSlide = congVienCurrentSlide;
  const descriptions = popup.querySelectorAll('.slide-description');
  descriptions.forEach((desc) => {
    const descSlide = parseInt(desc.getAttribute('data-slide'));
    if (descSlide === congVienCurrentSlide) {
      desc.classList.add('active');
    } else {
      desc.classList.remove('active');
    }
  });
}
function goToCongVienSlideFromTab(index) {
  const popup = document.getElementById('congVienPopup');
  if (!popup || !congVienSlides || congVienTotalSlides === 0) return;
  const isOnRight = congVienPanelsOnRight.has(index);
  if (isOnRight) {
    congVienPanelsOnRight.delete(index);
    congVienActivePanels.delete(index);
  } else {
    congVienPanelsOnRight.add(index);
    congVienActivePanels.add(index);
  }
  congVienCurrentSlide = index;
  const modalSlides = popup.querySelectorAll('.slide');
  modalSlides.forEach((slide, idx) => {
    if (idx === congVienCurrentSlide && congVienCurrentSlide >= 0) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
  congVienSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  updateCongVienSlider();
}
function moveCongVienSlide(direction) {
  const popup = document.getElementById('congVienPopup');
  if (!popup || !congVienSlides || congVienTotalSlides === 0) return;
  const newIndex = congVienCurrentSlide + direction;
  if (newIndex < 0) {
    return;
  } else if (newIndex >= congVienTotalSlides) {
    return;
  }
  goToCongVienSlideFromTab(newIndex);
}
function openCongVienPopup() {
  const popup = document.getElementById('congVienPopup');
  if (popup) {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      initCongVienSlider();
      if (typeof createParkMarkers === 'function') {
        createParkMarkers();
      }
    }, 100);
  }
}
function closeCongVienPopup() {
  const popup = document.getElementById('congVienPopup');
  if (popup) {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }
}
let clubhouseCurrentSlide = 0;
let clubhouseSlides = null;
let clubhouseTotalSlides = 0;
let clubhouseTabs = null;
let clubhousePreviousSlide = 0;
let clubhouseActivePanels = new Set();
let clubhousePanelsOnRight = new Set();
function initClubhouseSlider() {
  const popup = document.getElementById('clubhousePopup');
  if (!popup) return false;
  clubhouseSlides = popup.querySelector('.slides');
  const modalSlides = popup.querySelectorAll('.slide');
  clubhouseTabs = popup.querySelectorAll('.vertical-text');
  if (!clubhouseSlides || modalSlides.length === 0) {
    return false;
  }
  clubhouseTotalSlides = modalSlides.length;
  clubhouseCurrentSlide = -1;
  clubhousePreviousSlide = -1;
  clubhouseActivePanels.clear();
  clubhousePanelsOnRight.clear();
  modalSlides.forEach((slide) => {
    slide.classList.remove('active');
  });
  const panels = popup.querySelectorAll('.panel-item');
  const panelWidth = 50;
  panels.forEach((panel, index) => {
    panel.classList.remove('active');
    const text = panel.querySelector('.vertical-text');
    if (text) text.classList.remove('active');
    panel.style.left = `${index * panelWidth}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
  });
  if (modalSlides.length > 0) {
    modalSlides[0].classList.add('active');
    clubhouseSlides.style.transform = 'translateX(0%)';
  }
  return true;
}
function updateClubhouseSlider() {
  const popup = document.getElementById('clubhousePopup');
  if (!popup || !clubhouseSlides) return;
  const slideDirection = clubhouseCurrentSlide - clubhousePreviousSlide;
  if (clubhouseCurrentSlide >= 0) {
    clubhouseSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    clubhouseSlides.style.transform = `translateX(-${clubhouseCurrentSlide * 100}%)`;
  }
  const panels = popup.querySelectorAll('.panel-item');
  if (clubhouseTabs) {
    clubhouseTabs.forEach((tab) => {
      const tabSlide = parseInt(tab.getAttribute('data-slide'));
      tab.classList.toggle('active', tabSlide === clubhouseCurrentSlide);
    });
  }
  let leftPosition = 0;
  let rightPosition = 0;
  const panelWidth = 50;
  const currentPanel = clubhouseCurrentSlide >= 0 ? clubhouseCurrentSlide : null;
  const otherPanels = [];
  panels.forEach((panel) => {
    const panelSlide = parseInt(panel.getAttribute('data-slide'));
    if (panelSlide !== currentPanel) {
      const isOnRight = clubhousePanelsOnRight.has(panelSlide);
      otherPanels.push({ panel, slide: panelSlide, isOnRight });
    }
  });
  const panelsOnLeft = otherPanels.filter(p => !p.isOnRight);
  const panelsOnRight = otherPanels.filter(p => p.isOnRight);
  panelsOnLeft.sort((a, b) => a.slide - b.slide);
  panelsOnRight.sort((a, b) => b.slide - a.slide);
  panelsOnLeft.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.remove('active');
    if (text) text.classList.remove('active');
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = `${leftPosition}px`;
    panel.style.right = 'auto';
    panel.style.transform = '';
    leftPosition += panelWidth;
  });
  if (currentPanel !== null) {
    const currentPanelElement = Array.from(panels).find(p => parseInt(p.getAttribute('data-slide')) === currentPanel);
    if (currentPanelElement) {
      const text = currentPanelElement.querySelector('.vertical-text');
      currentPanelElement.classList.add('active');
      if (text) text.classList.add('active');
      const isOnRight = clubhousePanelsOnRight.has(currentPanel);
      if (isOnRight) {
        const finalRight = rightPosition;
        rightPosition += panelWidth;
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = 'auto';
        currentPanelElement.style.right = `${finalRight}px`;
        currentPanelElement.style.transform = '';
      } else {
        currentPanelElement.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        currentPanelElement.style.left = `${leftPosition}px`;
        currentPanelElement.style.right = 'auto';
        currentPanelElement.style.transform = '';
        leftPosition += panelWidth;
      }
    }
  }
  panelsOnRight.forEach(({ panel, slide }) => {
    const text = panel.querySelector('.vertical-text');
    panel.classList.add('active');
    if (text) text.classList.remove('active');
    const finalRight = rightPosition;
    rightPosition += panelWidth;
    panel.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), right 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    panel.style.left = 'auto';
    panel.style.right = `${finalRight}px`;
    panel.style.transform = '';
  });
  clubhousePreviousSlide = clubhouseCurrentSlide;
  const dots = popup.querySelectorAll('.clubhouse-dot-navigation .dot');
  dots.forEach((dot) => {
    const dotSlide = parseInt(dot.getAttribute('data-slide'));
    if (dotSlide === clubhouseCurrentSlide && clubhouseCurrentSlide >= 0) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  const descriptions = popup.querySelectorAll('.slide-description');
  descriptions.forEach((desc) => {
    const descSlide = parseInt(desc.getAttribute('data-slide'));
    if (descSlide === clubhouseCurrentSlide) {
      desc.classList.add('active');
    } else {
      desc.classList.remove('active');
    }
  });
  const prevBtn = popup.querySelector('.clubhouse-slider .nav-arrow.prev');
  const nextBtn = popup.querySelector('.clubhouse-slider .nav-arrow.next');
  if (prevBtn) {
    if (clubhouseCurrentSlide === 0) {
      prevBtn.style.opacity = '0.3';
      prevBtn.style.pointerEvents = 'none';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      prevBtn.style.cursor = 'pointer';
    }
  }
  if (nextBtn) {
    if (clubhouseCurrentSlide >= clubhouseTotalSlides - 1) {
      nextBtn.style.opacity = '0.3';
      nextBtn.style.pointerEvents = 'none';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
      nextBtn.style.cursor = 'pointer';
    }
  }
}
function moveClubhouseSlide(direction) {
  const popup = document.getElementById('clubhousePopup');
  if (!popup || !clubhouseSlides || clubhouseTotalSlides === 0) return;
  clubhouseCurrentSlide += direction;
  if (clubhouseCurrentSlide < 0) {
    clubhouseCurrentSlide = 0;
    return;
  } else if (clubhouseCurrentSlide >= clubhouseTotalSlides) {
    clubhouseCurrentSlide = clubhouseTotalSlides - 1;
    return;
  }
  const modalSlides = popup.querySelectorAll('.slide');
  modalSlides.forEach((slide, idx) => {
    if (idx === clubhouseCurrentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
  clubhouseSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  updateClubhouseSlider();
}
function goToClubhouseSlideFromTab(index) {
  const popup = document.getElementById('clubhousePopup');
  if (!popup || !clubhouseSlides || clubhouseTotalSlides === 0) return;
  const isOnRight = clubhousePanelsOnRight.has(index);
  if (isOnRight) {
    clubhousePanelsOnRight.delete(index);
    clubhouseActivePanels.delete(index);
  } else {
    clubhousePanelsOnRight.add(index);
    clubhouseActivePanels.add(index);
  }
  clubhouseCurrentSlide = index;
  const modalSlides = popup.querySelectorAll('.slide');
  modalSlides.forEach((slide, idx) => {
    if (idx === clubhouseCurrentSlide && clubhouseCurrentSlide >= 0) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
  clubhouseSlides.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  updateClubhouseSlider();
}
function openClubhousePopup() {
  const popup = document.getElementById('clubhousePopup');
  if (popup) {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    const floorTabs = popup.querySelector('.floor-tabs');
    if (floorTabs) {
      floorTabs.classList.remove('dropdown-open');
    }
    switchFloor(1);
    setTimeout(() => {
      initClubhouseAmenitiesSlider();
    }, 100);
    setTimeout(() => {
      initClubhouseSlider();
    }, 100);
  }
}
function closeClubhousePopup() {
  const popup = document.getElementById('clubhousePopup');
  if (popup) {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    if (clubhouseAmenitiesAutoPlayInterval) {
      clearInterval(clubhouseAmenitiesAutoPlayInterval);
      clubhouseAmenitiesAutoPlayInterval = null;
    }
  }
}
function switchFloor(floorNumber) {
  const clubhouseModal = document.getElementById('clubhousePopup');
  if (!clubhouseModal) return;
  const normalizedFloor = String(floorNumber);
  const floorTabButton = clubhouseModal.querySelector('.floor-tab-button');
  const floorTabText = clubhouseModal.querySelector('.floor-tab-text');
  const tabs = clubhouseModal.querySelectorAll('.floor-tab');
  const floorNames = {
    '1': 'TẦNG 1',
    '2': 'TẦNG 2',
    '3': 'TẦNG 3',
    'rooftop': 'ROOFTOP'
  };
  if (floorTabText && floorNames[normalizedFloor]) {
    floorTabText.textContent = floorNames[normalizedFloor];
  }
  if (floorTabButton) {
    floorTabButton.setAttribute('data-floor', normalizedFloor);
  }
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = clubhouseModal.querySelector(`.floor-tab[data-floor="${normalizedFloor}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  const floorPlans = clubhouseModal.querySelectorAll('.floor-plan-item');
  floorPlans.forEach(plan => {
    plan.classList.remove('active');
  });
  const selectedPlan = clubhouseModal.querySelector(`.floor-plan-item[data-floor="${normalizedFloor}"]`);
  if (selectedPlan) {
    selectedPlan.classList.add('active');
  }
  const legends = clubhouseModal.querySelectorAll('.clubhouse-legend');
  legends.forEach(legend => {
    legend.classList.remove('active');
  });
  const activeLegend = clubhouseModal.querySelector(`.clubhouse-legend[data-floor="${normalizedFloor}"]`);
  if (activeLegend) {
    activeLegend.classList.add('active');
  }
  const defaultDescription = clubhouseModal.querySelector('.club-house-description:not([data-floor])');
  if (defaultDescription) {
    defaultDescription.classList.add('active');
  }
  const floorDescriptions = clubhouseModal.querySelectorAll('.club-house-description[data-floor]');
  floorDescriptions.forEach(desc => {
    desc.classList.remove('active');
  });
  const activeDescription = clubhouseModal.querySelector(`.club-house-description[data-floor="${normalizedFloor}"]`);
  if (activeDescription) {
    activeDescription.classList.add('active');
  }
  const floorTabs = clubhouseModal.querySelector('.floor-tabs');
  if (floorTabs && window.innerWidth <= 768) {
    floorTabs.classList.remove('dropdown-open');
  }
}
function handleFloorTabClick(floorNumber, event) {
  const clubhouseModal = document.getElementById('clubhousePopup');
  if (!clubhouseModal) return;
  const floorTabs = clubhouseModal.querySelector('.floor-tabs');
  const floorTabButton = clubhouseModal.querySelector('.floor-tab-button');
  const clickedElement = event.target;
  let actualButton = clickedElement;
  if (clickedElement.classList.contains('floor-tab-text') || clickedElement.classList.contains('floor-tab-arrow')) {
    actualButton = clickedElement.closest('.floor-tab-button') || clickedElement.closest('.floor-tab');
  } else if (!clickedElement.classList.contains('floor-tab-button') && !clickedElement.classList.contains('floor-tab')) {
    actualButton = clickedElement.closest('.floor-tab-button') || clickedElement.closest('.floor-tab');
  }
  let actualFloorNumber = floorNumber;
  if (actualButton) {
    const buttonFloor = actualButton.getAttribute('data-floor');
    if (buttonFloor) {
      actualFloorNumber = buttonFloor === 'rooftop' ? 'rooftop' : parseInt(buttonFloor);
    }
  }
  const isButtonClick = actualButton && actualButton.classList.contains('floor-tab-button');
  const currentFloor = floorTabButton ? floorTabButton.getAttribute('data-floor') : null;
  const currentFloorValue = currentFloor === 'rooftop' ? 'rooftop' : parseInt(currentFloor);
  const isCurrentFloor = String(currentFloorValue) === String(actualFloorNumber);
  if (window.innerWidth <= 768 && isButtonClick && isCurrentFloor) {
    if (floorTabs) {
      floorTabs.classList.toggle('dropdown-open');
    }
  } else {
    switchFloor(actualFloorNumber);
    if (floorTabs && window.innerWidth <= 768) {
      floorTabs.classList.remove('dropdown-open');
    }
  }
}
function toggleFloorDropdown() {
  const clubhouseModal = document.getElementById('clubhousePopup');
  if (!clubhouseModal) return;
  const floorTabs = clubhouseModal.querySelector('.floor-tabs');
  if (floorTabs && window.innerWidth <= 768) {
    floorTabs.classList.toggle('dropdown-open');
  }
}
let currentRoleFrameSlide = 0;
let roleFrameSlides = null;
let totalRoleFrameSlides = 0;
let roleFrameSliderTrack = null;
function initRoleFrameSlider() {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) return false;
  const firstSliderSection = roleModal.querySelector('.frame-slider-section:not(.role-second-slider-section)');
  if (!firstSliderSection) return false;
  const firstSliderContainer = firstSliderSection.querySelector('.frame-slider-container');
  if (!firstSliderContainer) return false;
  roleFrameSlides = firstSliderContainer.querySelectorAll('.frame-slide:not(.role-second-slide)');
  roleFrameSliderTrack = firstSliderContainer.querySelector('.frame-slider-track:not(.role-second-slider-track)');
  if (!roleFrameSlides || roleFrameSlides.length === 0 || !roleFrameSliderTrack) {
    return false;
  }
  totalRoleFrameSlides = roleFrameSlides.length;
  currentRoleFrameSlide = 0;
  const images = firstSliderContainer.querySelectorAll('.frame-slide-image');
  let imagesLoaded = 0;
  const totalImages = images.length;
  function checkAllImagesLoaded() {
    if (imagesLoaded >= totalImages) {
      updateRoleFrameSlider();
    }
  }
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
      }
    });
  } else {
    updateRoleFrameSlider();
  }
  updateRoleFrameSlider();
  if (roleFrameSliderTrack) {
    initSliderDragState('roleFrameSlider', {
      getCurrentSlide: () => currentRoleFrameSlide,
      moveSlide: (direction) => moveRoleFrameSlide(direction),
      updateSlider: () => updateRoleFrameSlider(),
      checkActive: () => {
        const roleModal = document.getElementById('rolePopup');
        return roleModal && roleModal.classList.contains('active');
      }
    });
    setupSliderDrag('roleFrameSlider', roleFrameSliderTrack);
  }
  updateSliderButtonStates('roleFrameSlider', currentRoleFrameSlide, totalRoleFrameSlides);
  return true;
}
function updateRoleFrameSlider() {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal || !roleFrameSliderTrack) return;
  const translateX = -currentRoleFrameSlide * 100;
  roleFrameSliderTrack.style.transform = `translateX(${translateX}%)`;
  if (roleFrameSlides) {
    roleFrameSlides.forEach((slide, index) => {
      if (index === currentRoleFrameSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  updateSliderButtonStates('roleFrameSlider', currentRoleFrameSlide, totalRoleFrameSlides);
}
function moveRoleFrameSlide(direction) {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) {
    return;
  }
  const dragState = sliderDragStates['roleFrameSlider'];
  if (dragState && dragState.isDragging) {
    return;
  }
  if (!roleFrameSlides || totalRoleFrameSlides === 0) {
    initRoleFrameSlider();
    return;
  }
  if (direction > 0 && currentRoleFrameSlide >= totalRoleFrameSlides - 1) {
    return;
  }
  if (direction < 0 && currentRoleFrameSlide <= 0) {
    return;
  }
  currentRoleFrameSlide += direction;
  updateRoleFrameSlider();
}
let currentRoleSecondSlide = 0;
let roleSecondSlides = null;
let totalRoleSecondSlides = 0;
let roleSecondSliderTrack = null;
function initRoleSecondSlider() {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) return false;
  const secondSliderContainer = roleModal.querySelector('.role-second-slider-container');
  if (!secondSliderContainer) return false;
  roleSecondSlides = secondSliderContainer.querySelectorAll('.role-second-slide');
  roleSecondSliderTrack = secondSliderContainer.querySelector('.role-second-slider-track');
  if (!roleSecondSlides || roleSecondSlides.length === 0 || !roleSecondSliderTrack) {
    return false;
  }
  totalRoleSecondSlides = roleSecondSlides.length;
  currentRoleSecondSlide = 0;
  const images = secondSliderContainer.querySelectorAll('.frame-slide-image');
  let imagesLoaded = 0;
  const totalImages = images.length;
  function checkAllImagesLoaded() {
    if (imagesLoaded >= totalImages) {
      updateRoleSecondSlider();
    }
  }
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
      }
    });
  } else {
    updateRoleSecondSlider();
  }
  updateRoleSecondSlider();
  if (roleSecondSliderTrack) {
    initSliderDragState('roleSecondSlider', {
      getCurrentSlide: () => currentRoleSecondSlide,
      moveSlide: (direction) => moveRoleSecondSlide(direction),
      updateSlider: () => updateRoleSecondSlider(),
      checkActive: () => {
        const roleModal = document.getElementById('rolePopup');
        return roleModal && roleModal.classList.contains('active');
      }
    });
    setupSliderDrag('roleSecondSlider', roleSecondSliderTrack);
  }
  return true;
}
function updateRoleSecondSlider() {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal || !roleSecondSliderTrack) return;
  const translateX = -currentRoleSecondSlide * 100;
  roleSecondSliderTrack.style.transform = `translateX(${translateX}%)`;
  if (roleSecondSlides) {
    roleSecondSlides.forEach((slide, index) => {
      if (index === currentRoleSecondSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  updateSliderButtonStates('roleSecondSlider', currentRoleSecondSlide, totalRoleSecondSlides);
}
function moveRoleSecondSlide(direction) {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) return;
  const dragState = sliderDragStates['roleSecondSlider'];
  if (dragState && dragState.isDragging) {
    return;
  }
  if (!roleSecondSlides || totalRoleSecondSlides === 0) {
    initRoleSecondSlider();
    return;
  }
  if (direction > 0 && currentRoleSecondSlide >= totalRoleSecondSlides - 1) {
    return;
  }
  if (direction < 0 && currentRoleSecondSlide <= 0) {
    return;
  }
  currentRoleSecondSlide += direction;
  updateRoleSecondSlider();
}
function openRoleModal() {
  const popup = document.getElementById('rolePopup');
  if (popup) {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    enableAllRoleModalButtons();
    setTimeout(() => {
      initRoleFrameSlider();
      initRoleSecondSlider();
      setTimeout(() => {
        enableAllRoleModalButtons();
      }, 50);
    }, 100);
  }
}
function closeRoleModal() {
  const popup = document.getElementById('rolePopup');
  if (popup) {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }
}
let currentRoleSecondModalFirstSlide = 0;
let roleSecondModalFirstSlides = null;
let totalRoleSecondModalFirstSlides = 0;
let roleSecondModalFirstTrack = null;
function initRoleSecondModalFirstSlider() {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal) return false;
  const firstSliderContainer = roleSecondModal.querySelector('.role-second-modal-first-container');
  if (!firstSliderContainer) return false;
  roleSecondModalFirstSlides = firstSliderContainer.querySelectorAll('.role-second-modal-first-slide');
  roleSecondModalFirstTrack = firstSliderContainer.querySelector('.role-second-modal-first-track');
  if (!roleSecondModalFirstSlides || roleSecondModalFirstSlides.length === 0 || !roleSecondModalFirstTrack) {
    return false;
  }
  totalRoleSecondModalFirstSlides = roleSecondModalFirstSlides.length;
  currentRoleSecondModalFirstSlide = 0;
  const images = firstSliderContainer.querySelectorAll('.frame-slide-image');
  let imagesLoaded = 0;
  const totalImages = images.length;
  function checkAllImagesLoaded() {
    if (imagesLoaded >= totalImages) {
      updateRoleSecondModalFirstSlider();
    }
  }
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
      }
    });
  } else {
    updateRoleSecondModalFirstSlider();
  }
  updateRoleSecondModalFirstSlider();
  if (roleSecondModalFirstTrack) {
    initSliderDragState('roleSecondModalFirstSlider', {
      getCurrentSlide: () => currentRoleSecondModalFirstSlide,
      moveSlide: (direction) => moveRoleSecondModalFirstSlide(direction),
      updateSlider: () => updateRoleSecondModalFirstSlider(),
      checkActive: () => {
        const roleSecondModal = document.getElementById('roleSecondPopup');
        return roleSecondModal && roleSecondModal.classList.contains('active');
      }
    });
    setupSliderDrag('roleSecondModalFirstSlider', roleSecondModalFirstTrack);
  }
  updateSliderButtonStates('roleSecondModalFirstSlider', currentRoleSecondModalFirstSlide, totalRoleSecondModalFirstSlides);
  return true;
}
function updateRoleSecondModalFirstSlider() {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal || !roleSecondModalFirstTrack) return;
  const translateX = -currentRoleSecondModalFirstSlide * 100;
  roleSecondModalFirstTrack.style.transform = `translateX(${translateX}%)`;
  if (roleSecondModalFirstSlides) {
    roleSecondModalFirstSlides.forEach((slide, index) => {
      if (index === currentRoleSecondModalFirstSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  updateSliderButtonStates('roleSecondModalFirstSlider', currentRoleSecondModalFirstSlide, totalRoleSecondModalFirstSlides);
}
function moveRoleSecondModalFirstSlide(direction) {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal) return;
  const dragState = sliderDragStates['roleSecondModalFirstSlider'];
  if (dragState && dragState.isDragging) {
    return;
  }
  if (!roleSecondModalFirstSlides || totalRoleSecondModalFirstSlides === 0) {
    initRoleSecondModalFirstSlider();
    return;
  }
  if (direction > 0 && currentRoleSecondModalFirstSlide >= totalRoleSecondModalFirstSlides - 1) {
    return;
  }
  if (direction < 0 && currentRoleSecondModalFirstSlide <= 0) {
    return;
  }
  currentRoleSecondModalFirstSlide += direction;
  updateRoleSecondModalFirstSlider();
}
let currentRoleSecondModalSecondSlide = 0;
let roleSecondModalSecondSlides = null;
let totalRoleSecondModalSecondSlides = 0;
let roleSecondModalSecondTrack = null;
function initRoleSecondModalSecondSlider() {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal) return false;
  const secondSliderContainer = roleSecondModal.querySelector('.role-second-modal-second-container');
  if (!secondSliderContainer) return false;
  roleSecondModalSecondSlides = secondSliderContainer.querySelectorAll('.role-second-modal-second-slide');
  roleSecondModalSecondTrack = secondSliderContainer.querySelector('.role-second-modal-second-track');
  if (!roleSecondModalSecondSlides || roleSecondModalSecondSlides.length === 0 || !roleSecondModalSecondTrack) {
    return false;
  }
  totalRoleSecondModalSecondSlides = roleSecondModalSecondSlides.length;
  currentRoleSecondModalSecondSlide = 0;
  const images = secondSliderContainer.querySelectorAll('.frame-slide-image');
  let imagesLoaded = 0;
  const totalImages = images.length;
  function checkAllImagesLoaded() {
    if (imagesLoaded >= totalImages) {
      updateRoleSecondModalSecondSlider();
    }
  }
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
      }
    });
  } else {
    updateRoleSecondModalSecondSlider();
  }
  updateRoleSecondModalSecondSlider();
  if (roleSecondModalSecondTrack) {
    initSliderDragState('roleSecondModalSecondSlider', {
      getCurrentSlide: () => currentRoleSecondModalSecondSlide,
      moveSlide: (direction) => moveRoleSecondModalSecondSlide(direction),
      updateSlider: () => updateRoleSecondModalSecondSlider(),
      checkActive: () => {
        const roleSecondModal = document.getElementById('roleSecondPopup');
        return roleSecondModal && roleSecondModal.classList.contains('active');
      }
    });
    setupSliderDrag('roleSecondModalSecondSlider', roleSecondModalSecondTrack);
  }
  updateSliderButtonStates('roleSecondModalSecondSlider', currentRoleSecondModalSecondSlide, totalRoleSecondModalSecondSlides);
  return true;
}
function updateRoleSecondModalSecondSlider() {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal || !roleSecondModalSecondTrack) return;
  const translateX = -currentRoleSecondModalSecondSlide * 100;
  roleSecondModalSecondTrack.style.transform = `translateX(${translateX}%)`;
  if (roleSecondModalSecondSlides) {
    roleSecondModalSecondSlides.forEach((slide, index) => {
      if (index === currentRoleSecondModalSecondSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  updateSliderButtonStates('roleSecondModalSecondSlider', currentRoleSecondModalSecondSlide, totalRoleSecondModalSecondSlides);
}
function moveRoleSecondModalSecondSlide(direction) {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal) return;
  const dragState = sliderDragStates['roleSecondModalSecondSlider'];
  if (dragState && dragState.isDragging) {
    return;
  }
  if (!roleSecondModalSecondSlides || totalRoleSecondModalSecondSlides === 0) {
    initRoleSecondModalSecondSlider();
    return;
  }
  if (direction > 0 && currentRoleSecondModalSecondSlide >= totalRoleSecondModalSecondSlides - 1) {
    return;
  }
  if (direction < 0 && currentRoleSecondModalSecondSlide <= 0) {
    return;
  }
  currentRoleSecondModalSecondSlide += direction;
  updateRoleSecondModalSecondSlider();
}
function openRoleSecondModal() {
  const popup = document.getElementById('roleSecondPopup');
  if (popup) {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    enableAllRoleSecondModalButtons();
    setTimeout(() => {
      initRoleSecondModalFirstSlider();
      initRoleSecondModalSecondSlider();
      setTimeout(() => {
        enableAllRoleSecondModalButtons();
      }, 50);
    }, 100);
  }
}
function closeRoleSecondModal() {
  const popup = document.getElementById('roleSecondPopup');
  if (popup) {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }
}
function switchFloorRole(floorNumber) {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) return;
  const tabs = roleModal.querySelectorAll('.floor-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = roleModal.querySelector(`.floor-tab[data-floor="${floorNumber}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  const floorPlans = roleModal.querySelectorAll('.floor-plan-item');
  floorPlans.forEach(plan => {
    plan.classList.remove('active');
  });
  const selectedPlan = roleModal.querySelector(`.floor-plan-item[data-floor="${floorNumber}"]`);
  if (selectedPlan) {
    selectedPlan.classList.add('active');
  }
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCongVienPopup();
    closeClubhousePopup();
    closeRoleModal();
    closeRoleSecondModal();
  }
});
function switchOptimalFloor(floorNumber) {
  const modal = document.getElementById('rolePopup');
  if (!modal) return;
  const section = modal.querySelector('.optimal-floor-plan-section');
  if (!section) return;
  const leftItems = section.querySelectorAll('.optimal-floor-left-item');
  leftItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeLeftItem = section.querySelector(`.optimal-floor-left-item[data-floor="${floorNumber}"]`);
  if (activeLeftItem) {
    activeLeftItem.classList.add('active');
  }
  const rightItems = section.querySelectorAll('.optimal-floor-right-item');
  rightItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeRightItem = section.querySelector(`.optimal-floor-right-item[data-floor="${floorNumber}"]`);
  if (activeRightItem) {
    activeRightItem.classList.add('active');
  }
  const textItems = section.querySelectorAll('.optimal-floor-text-item');
  textItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeTextItem = section.querySelector(`.optimal-floor-text-item[data-floor="${floorNumber}"]`);
  if (activeTextItem) {
    activeTextItem.classList.add('active');
  }
}
function switchOptimalFloorToam(floorNumber) {
  const modal = document.getElementById('roleSecondPopup');
  if (!modal) return;
  const section = modal.querySelector('.optimal-floor-plan-section');
  if (!section) return;
  const leftItems = section.querySelectorAll('.optimal-floor-left-item');
  leftItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeLeftItem = section.querySelector(`.optimal-floor-left-item[data-floor="${floorNumber}"]`);
  if (activeLeftItem) {
    activeLeftItem.classList.add('active');
  }
  const rightItems = section.querySelectorAll('.optimal-floor-right-item');
  rightItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeRightItem = section.querySelector(`.optimal-floor-right-item[data-floor="${floorNumber}"]`);
  if (activeRightItem) {
    activeRightItem.classList.add('active');
  }
  const textItems = section.querySelectorAll('.optimal-floor-text-item');
  textItems.forEach(item => {
    item.classList.remove('active');
  });
  const activeTextItem = section.querySelector(`.optimal-floor-text-item[data-floor="${floorNumber}"]`);
  if (activeTextItem) {
    activeTextItem.classList.add('active');
  }
}
let currentInfoSlide = 0;
let infoSliderTrack = null;
let infoPaginationDots = null;
let totalInfoSlides = 0;
let infoAutoPlayInterval = null;
function initInfoSlider() {
  infoSliderTrack = document.querySelector('.info-slider-track');
  const paginationContainer = document.querySelector('.info-slider-pagination');
  if (!infoSliderTrack) {
    return false;
  }
  totalInfoSlides = document.querySelectorAll('.info-card-slide').length;
  if (totalInfoSlides === 0) {
    return false;
  }
  const isMobile = window.innerWidth <= 768;
  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
  if (paginationContainer) {
    paginationContainer.innerHTML = '';
    if (totalPages > 1) {
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = 'info-pagination-dot' + (i === 0 ? ' active' : '');
        const dotIndex = i;
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          goToInfoSlide(dotIndex);
        });
        let touchStartTime = 0;
        dot.addEventListener('touchstart', (e) => {
          touchStartTime = Date.now();
          e.stopPropagation();
        }, { passive: true });
        dot.addEventListener('touchend', (e) => {
          const touchDuration = Date.now() - touchStartTime;
          if (touchDuration < 300) {
            e.preventDefault();
            e.stopPropagation();
            goToInfoSlide(dotIndex);
          }
        }, { passive: false });
        paginationContainer.appendChild(dot);
      }
      infoPaginationDots = paginationContainer.querySelectorAll('.info-pagination-dot');
    } else {
      paginationContainer.style.display = 'none';
    }
  }
  const prevArrow = document.querySelector('.info-slider-prev');
  const nextArrow = document.querySelector('.info-slider-next');
  if (totalPages <= 1) {
    if (prevArrow) prevArrow.style.display = 'none';
    if (nextArrow) nextArrow.style.display = 'none';
  }
  if (isMobile) {
    if (infoSliderTrack) {
      infoSliderTrack.style.transform = 'none';
      infoSliderTrack.style.transition = 'none';
      infoSliderTrack.style.overflowX = 'visible';
      infoSliderTrack.style.overflowY = 'visible';
    }
    const container = document.querySelector('.info-slider-container');
    if (container) {
      container.style.overflowX = 'auto';
      container.style.overflowY = 'hidden';
      container.style.webkitOverflowScrolling = 'touch';
      container.addEventListener('touchstart', (e) => {
      }, { passive: true });
      container.addEventListener('touchmove', (e) => {
      }, { passive: true });
      let scrollTimeout;
      container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          updateActiveDotFromScroll();
        }, 100);
      }, { passive: true });
    }
  }
  const sliderWrapper = document.querySelector('.info-slider-wrapper');
  if (sliderWrapper && !isMobile) {
    sliderWrapper.addEventListener('mouseenter', () => {
      if (infoAutoPlayInterval) {
        clearInterval(infoAutoPlayInterval);
        infoAutoPlayInterval = null;
      }
    });
    sliderWrapper.addEventListener('mouseleave', () => {
      if (!infoAutoPlayInterval) {
        startInfoAutoPlay();
      }
    });
  }
  updateInfoSlider();
  return true;
}
function updateInfoSlider() {
  if (!infoSliderTrack) return;
  const isMobile = window.innerWidth <= 560;
  if (isMobile) {
    infoSliderTrack.style.transform = 'none';
    infoSliderTrack.style.transition = 'none';
    return;
  }
  infoSliderTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  const translateX = -currentInfoSlide * 100;
  infoSliderTrack.style.transform = `translateX(${translateX}%)`;
  updatePaginationDots();
}
function moveInfoSlide(direction) {
  if (!infoSliderTrack || totalInfoSlides === 0) return;
  if (infoAutoPlayInterval) {
    clearInterval(infoAutoPlayInterval);
    infoAutoPlayInterval = null;
  }
  const isMobile = window.innerWidth <= 560;
  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
  currentInfoSlide += direction;
  if (currentInfoSlide < 0) {
    currentInfoSlide = totalPages - 1;
  } else if (currentInfoSlide >= totalPages) {
    currentInfoSlide = 0;
  }
  if (isMobile) {
    goToInfoSlide(currentInfoSlide);
  } else {
    updateInfoSlider();
  }
  setTimeout(() => {
    if (!infoAutoPlayInterval) {
      startInfoAutoPlay();
    }
  }, 8000);
}
function goToInfoSlide(index) {
  if (!infoSliderTrack || totalInfoSlides === 0) return;
  if (infoAutoPlayInterval) {
    clearInterval(infoAutoPlayInterval);
    infoAutoPlayInterval = null;
  }
  const isMobile = window.innerWidth <= 768;
  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
  if (index < 0 || index >= totalPages) return;
  currentInfoSlide = index;
  if (isMobile) {
    const container = document.querySelector('.info-slider-container');
    const cards = document.querySelectorAll('.info-card-slide');
    if (container && cards.length > index) {
      const targetCard = cards[index];
      if (targetCard) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = targetCard.getBoundingClientRect();
        const containerScrollLeft = container.scrollLeft;
        const cardLeft = targetCard.offsetLeft;
        const cardWidth = targetCard.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
        setTimeout(() => {
          container.scrollLeft = Math.max(0, scrollPosition);
        }, 50);
      }
    }
    updatePaginationDots();
  } else {
    updateInfoSlider();
  }
  if (!isMobile) {
    setTimeout(() => {
      if (!infoAutoPlayInterval) {
        startInfoAutoPlay();
      }
    }, 8000);
  }
}
function updateActiveDotFromScroll() {
  const isMobile = window.innerWidth <= 560;
  if (!isMobile || !infoSliderTrack) return;
  const container = document.querySelector('.info-slider-container');
  if (!container) return;
  const cards = document.querySelectorAll('.info-card-slide');
  if (cards.length === 0) return;
  const containerScrollLeft = container.scrollLeft;
  const containerWidth = container.offsetWidth;
  const centerPoint = containerScrollLeft + containerWidth / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;
  cards.forEach((card, index) => {
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const cardCenter = cardLeft + cardWidth / 2;
    const distance = Math.abs(cardCenter - centerPoint);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  if (currentInfoSlide !== closestIndex) {
    currentInfoSlide = closestIndex;
    updatePaginationDots();
  }
}
function updatePaginationDots() {
  if (!infoPaginationDots) return;
  const isMobile = window.innerWidth <= 560;
  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
  infoPaginationDots.forEach((dot, index) => {
    if (isMobile) {
      if (index === currentInfoSlide && index < totalPages) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    } else {
      if (index === currentInfoSlide && index < totalPages) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    }
  });
}
function startInfoAutoPlay() {
  const isMobile = window.innerWidth <= 560;
  if (isMobile) {
    return;
  }
  if (infoAutoPlayInterval) {
    clearInterval(infoAutoPlayInterval);
  }
  const itemsPerPage = 3;
  const totalPages = Math.ceil(totalInfoSlides / itemsPerPage);
  if (totalPages > 1) {
    infoAutoPlayInterval = setInterval(() => {
      if (!infoSliderTrack || totalInfoSlides === 0) return;
      const currentIsMobile = window.innerWidth <= 560;
      const currentItemsPerPage = currentIsMobile ? 1 : 3;
      const currentTotalPages = Math.ceil(totalInfoSlides / currentItemsPerPage);
      currentInfoSlide = (currentInfoSlide + 1) % currentTotalPages;
      if (currentIsMobile) {
        goToInfoSlide(currentInfoSlide);
      } else {
        updateInfoSlider();
      }
    }, 5000);
  }
}
function initMasterPlanMapScroll() {
  const mapContainer = document.querySelector('.master-plan-map-container');
  if (!mapContainer) {
    return;
  }
  const mapWrapper = mapContainer.querySelector('.map-wrapper');
  if (!mapWrapper) {
    return;
  }
  const svgContainer = mapWrapper.querySelector('.container');
  if (!svgContainer) {
    return;
  }
  const navScrollMap = mapContainer.querySelector('.nav-scroll-map');
  if (!navScrollMap) {
    return;
  }
  let prevButton = navScrollMap.querySelector('div:first-child');
  let nextButton = navScrollMap.querySelector('div:last-child');
  if (!prevButton || !nextButton) {
    prevButton = navScrollMap.querySelector('img:first-child');
    nextButton = navScrollMap.querySelector('img:last-child');
  }
  if (!prevButton || !nextButton) {
    return;
  }
  const scrollAmount = window.innerWidth * 0.8;
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (svgContainer) {
      svgContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  });
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (svgContainer) {
      svgContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  });
}
let currentFrameSlide = 0;
let frameSlides = null;
let totalFrameSlides = 0;
const sliderDragStates = {};
function initSliderDragState(sliderId, config) {
  sliderDragStates[sliderId] = {
    isDragging: false,
    startX: 0,
    currentX: 0,
    dragOffset: 0,
    track: null,
    getCurrentSlide: config.getCurrentSlide,
    moveSlide: config.moveSlide,
    updateSlider: config.updateSlider,
    checkActive: config.checkActive || (() => true)
  };
}
function setupSliderDrag(sliderId, trackElement) {
  if (!trackElement) return;
  const state = sliderDragStates[sliderId];
  if (!state) return;
  state.track = trackElement;
  trackElement.addEventListener('mousedown', (e) => handleSliderDragStart(e, sliderId));
  trackElement.addEventListener('touchstart', (e) => handleSliderDragStart(e, sliderId), { passive: false });
  const images = trackElement.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
}
function handleSliderDragStart(e, sliderId) {
  const state = sliderDragStates[sliderId];
  if (!state || !state.track) return;
  if (!state.checkActive()) return;
  const target = e.target.closest('.frame-slider-track');
  if (!target || target !== state.track) return;
  state.isDragging = true;
  state.track.style.cursor = 'grabbing';
  state.track.style.transition = 'none';
  if (sliderId === 'roleFrameSlider' || sliderId === 'roleSecondSlider' ||
    sliderId === 'roleSecondModalFirstSlider' || sliderId === 'roleSecondModalSecondSlider') {
    disableSliderButtons(sliderId);
  }
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  state.startX = clientX;
  state.currentX = clientX;
  const transform = window.getComputedStyle(state.track).transform;
  if (transform && transform !== 'none') {
    const matrix = transform.match(/matrix\(([^)]+)\)/);
    if (matrix) {
      state.dragOffset = parseFloat(matrix[1].split(',')[4]) || 0;
    }
  } else {
    const currentSlide = state.getCurrentSlide();
    state.dragOffset = -currentSlide * 100;
  }
  const moveHandler = (e) => handleSliderDragMove(e, sliderId);
  const endHandler = (e) => handleSliderDragEnd(e, sliderId);
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', endHandler);
  document.addEventListener('touchmove', moveHandler, { passive: false });
  document.addEventListener('touchend', endHandler);
  state._moveHandler = moveHandler;
  state._endHandler = endHandler;
}
function handleSliderDragMove(e, sliderId) {
  const state = sliderDragStates[sliderId];
  if (!state || !state.isDragging || !state.track) return;
  e.preventDefault();
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  state.currentX = clientX;
  const deltaX = state.currentX - state.startX;
  const sliderWidth = state.track.offsetWidth;
  const dragPercent = (deltaX / sliderWidth) * 100;
  const currentSlide = state.getCurrentSlide();
  const basePosition = -currentSlide * 100;
  let newPosition = basePosition + dragPercent;
  let totalSlides = 0;
  if (sliderId === 'roleFrameSlider') {
    totalSlides = totalRoleFrameSlides;
  } else if (sliderId === 'roleSecondSlider') {
    totalSlides = totalRoleSecondSlides;
  } else if (sliderId === 'roleSecondModalFirstSlider') {
    totalSlides = totalRoleSecondModalFirstSlides;
  } else if (sliderId === 'roleSecondModalSecondSlider') {
    totalSlides = totalRoleSecondModalSecondSlides;
  } else if (sliderId === 'frameSlider') {
    totalSlides = totalFrameSlides;
  }
  const minPosition = 0;
  const maxPosition = -(totalSlides - 1) * 100;
  if (newPosition > minPosition) {
    const excess = newPosition - minPosition;
    newPosition = minPosition + excess * 0.3;
  } else if (newPosition < maxPosition) {
    const excess = maxPosition - newPosition;
    newPosition = maxPosition - excess * 0.3;
  }
  state.track.style.transform = `translateX(${newPosition}%)`;
}
function handleSliderDragEnd(e, sliderId) {
  const state = sliderDragStates[sliderId];
  if (!state || !state.isDragging || !state.track) return;
  state.isDragging = false;
  state.track.style.cursor = 'grab';
  state.track.style.transition = '';
  if (sliderId === 'roleFrameSlider' || sliderId === 'roleSecondSlider' ||
    sliderId === 'roleSecondModalFirstSlider' || sliderId === 'roleSecondModalSecondSlider') {
    enableSliderButtons(sliderId);
  }
  if (state._moveHandler) {
    document.removeEventListener('mousemove', state._moveHandler);
    document.removeEventListener('touchmove', state._moveHandler);
  }
  if (state._endHandler) {
    document.removeEventListener('mouseup', state._endHandler);
    document.removeEventListener('touchend', state._endHandler);
  }
  const clientX = e.type.includes('touch') ? (e.changedTouches[0] ? e.changedTouches[0].clientX : state.currentX) : e.clientX;
  const deltaX = clientX - state.startX;
  const sliderWidth = state.track.offsetWidth;
  const dragPercent = (deltaX / sliderWidth) * 100;
  let totalSlides = 0;
  const currentSlide = state.getCurrentSlide();
  if (sliderId === 'roleFrameSlider') {
    totalSlides = totalRoleFrameSlides;
  } else if (sliderId === 'roleSecondSlider') {
    totalSlides = totalRoleSecondSlides;
  } else if (sliderId === 'roleSecondModalFirstSlider') {
    totalSlides = totalRoleSecondModalFirstSlides;
  } else if (sliderId === 'roleSecondModalSecondSlider') {
    totalSlides = totalRoleSecondModalSecondSlides;
  } else if (sliderId === 'frameSlider') {
    totalSlides = totalFrameSlides;
  }
  const threshold = 30;
  if (Math.abs(dragPercent) > threshold) {
    if (dragPercent < 0) {
      if (currentSlide < totalSlides - 1) {
        state.moveSlide(1);
      } else {
        state.updateSlider();
      }
    } else {
      if (currentSlide > 0) {
        state.moveSlide(-1);
      } else {
        state.updateSlider();
      }
    }
  } else {
    state.updateSlider();
  }
}
function disableSliderButtons(sliderId) {
  let buttons = [];
  if (sliderId === 'roleFrameSlider' || sliderId === 'roleSecondSlider') {
    const roleModal = document.getElementById('rolePopup');
    if (!roleModal) return;
    if (sliderId === 'roleFrameSlider') {
      buttons = roleModal.querySelectorAll('.frame-slider-section:not(.role-second-slider-section) .frame-slider-arrow');
    } else if (sliderId === 'roleSecondSlider') {
      buttons = roleModal.querySelectorAll('.role-second-slider-section .frame-slider-arrow');
    }
  } else if (sliderId === 'roleSecondModalFirstSlider' || sliderId === 'roleSecondModalSecondSlider') {
    const roleSecondModal = document.getElementById('roleSecondPopup');
    if (!roleSecondModal) return;
    if (sliderId === 'roleSecondModalFirstSlider') {
      buttons = roleSecondModal.querySelectorAll('.role-second-modal-first-slider .frame-slider-arrow');
    } else if (sliderId === 'roleSecondModalSecondSlider') {
      buttons = roleSecondModal.querySelectorAll('.role-second-modal-second-slider .frame-slider-arrow');
    }
  }
  buttons.forEach(btn => {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
  });
}
function enableSliderButtons(sliderId) {
  let buttons = [];
  if (sliderId === 'roleFrameSlider' || sliderId === 'roleSecondSlider') {
    const roleModal = document.getElementById('rolePopup');
    if (!roleModal) return;
    if (sliderId === 'roleFrameSlider') {
      buttons = roleModal.querySelectorAll('.frame-slider-section:not(.role-second-slider-section) .frame-slider-arrow');
    } else if (sliderId === 'roleSecondSlider') {
      buttons = roleModal.querySelectorAll('.role-second-slider-section .frame-slider-arrow');
    }
  } else if (sliderId === 'roleSecondModalFirstSlider' || sliderId === 'roleSecondModalSecondSlider') {
    const roleSecondModal = document.getElementById('roleSecondPopup');
    if (!roleSecondModal) return;
    if (sliderId === 'roleSecondModalFirstSlider') {
      buttons = roleSecondModal.querySelectorAll('.role-second-modal-first-slider .frame-slider-arrow');
    } else if (sliderId === 'roleSecondModalSecondSlider') {
      buttons = roleSecondModal.querySelectorAll('.role-second-modal-second-slider .frame-slider-arrow');
    }
  }
  buttons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
    btn.disabled = false;
  });
}
function enableAllRoleModalButtons() {
  const roleModal = document.getElementById('rolePopup');
  if (!roleModal) {
    return;
  }
  const allButtons = roleModal.querySelectorAll('.frame-slider-arrow');
  allButtons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
    btn.disabled = false;
    btn.style.cursor = 'pointer';
  });
}
function enableAllRoleSecondModalButtons() {
  const roleSecondModal = document.getElementById('roleSecondPopup');
  if (!roleSecondModal) {
    return;
  }
  const allButtons = roleSecondModal.querySelectorAll('.frame-slider-arrow');
  allButtons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
    btn.disabled = false;
    btn.style.cursor = 'pointer';
  });
}
function updateSliderButtonStates(sliderId, currentSlide, totalSlides) {
  let prevButton = null;
  let nextButton = null;
  if (sliderId === 'roleFrameSlider' || sliderId === 'roleSecondSlider') {
    const roleModal = document.getElementById('rolePopup');
    if (!roleModal) return;
    if (sliderId === 'roleFrameSlider') {
      const section = roleModal.querySelector('.frame-slider-section:not(.role-second-slider-section)');
      if (section) {
        prevButton = section.querySelector('.frame-slider-prev');
        nextButton = section.querySelector('.frame-slider-next');
      }
    } else if (sliderId === 'roleSecondSlider') {
      const section = roleModal.querySelector('.role-second-slider-section');
      if (section) {
        prevButton = section.querySelector('.frame-slider-prev');
        nextButton = section.querySelector('.frame-slider-next');
      }
    }
  } else if (sliderId === 'roleSecondModalFirstSlider' || sliderId === 'roleSecondModalSecondSlider') {
    const roleSecondModal = document.getElementById('roleSecondPopup');
    if (!roleSecondModal) return;
    if (sliderId === 'roleSecondModalFirstSlider') {
      const section = roleSecondModal.querySelector('.role-second-modal-first-slider');
      if (section) {
        prevButton = section.querySelector('.frame-slider-prev');
        nextButton = section.querySelector('.frame-slider-next');
      }
    } else if (sliderId === 'roleSecondModalSecondSlider') {
      const section = roleSecondModal.querySelector('.role-second-modal-second-slider');
      if (section) {
        prevButton = section.querySelector('.frame-slider-prev');
        nextButton = section.querySelector('.frame-slider-next');
      }
    }
  }
  if (prevButton) {
    if (currentSlide <= 0) {
      prevButton.style.opacity = '0.3';
      prevButton.style.pointerEvents = 'none';
      prevButton.style.cursor = 'not-allowed';
    } else {
      prevButton.style.opacity = '1';
      prevButton.style.pointerEvents = 'auto';
      prevButton.style.cursor = 'pointer';
    }
  }
  if (nextButton) {
    if (currentSlide >= totalSlides - 1) {
      nextButton.style.opacity = '0.3';
      nextButton.style.pointerEvents = 'none';
      nextButton.style.cursor = 'not-allowed';
    } else {
      nextButton.style.opacity = '1';
      nextButton.style.pointerEvents = 'auto';
      nextButton.style.cursor = 'pointer';
    }
  }
}
let frameSliderTrack = null;
function initFrameSlider() {
  const mainFrameSlider = document.querySelector('.frame-depiction-section .frame-slider-container');
  if (!mainFrameSlider) {
    return false;
  }
  frameSlides = mainFrameSlider.querySelectorAll('.frame-slide');
  frameSliderTrack = document.querySelector('.frame-depiction-section .frame-slider-track');
  if (!frameSlides || frameSlides.length === 0) {
    return false;
  }
  totalFrameSlides = frameSlides.length;
  currentFrameSlide = 0;
  const images = mainFrameSlider.querySelectorAll('.frame-slide-image');
  let imagesLoaded = 0;
  const totalImages = images.length;
  function checkAllImagesLoaded() {
    if (imagesLoaded >= totalImages) {
      updateFrameSlider();
    }
  }
  if (totalImages > 0) {
    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++;
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          checkAllImagesLoaded();
        });
      }
    });
  } else {
    updateFrameSlider();
  }
  updateFrameSlider();
  if (frameSliderTrack) {
    initSliderDragState('frameSlider', {
      getCurrentSlide: () => currentFrameSlide,
      moveSlide: (direction) => moveFrameSlide(direction),
      updateSlider: () => updateFrameSlider(),
      checkActive: () => true
    });
    setupSliderDrag('frameSlider', frameSliderTrack);
  }
  return true;
}
function updateFrameSlider() {
  if (!frameSlides || !frameSlides[0]) return;
  const mainFrameSlider = document.querySelector('.frame-depiction-section .frame-slider-track');
  if (mainFrameSlider) {
    const translateX = -currentFrameSlide * 100;
    mainFrameSlider.style.transform = `translateX(${translateX}%)`;
  }
  frameSlides.forEach((slide, index) => {
    if (index === currentFrameSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
}
function moveFrameSlide(direction) {
  if (!frameSlides || totalFrameSlides === 0) return;
  currentFrameSlide += direction;
  if (currentFrameSlide < 0) {
    currentFrameSlide = totalFrameSlides - 1;
  } else if (currentFrameSlide >= totalFrameSlides) {
    currentFrameSlide = 0;
  }
  updateFrameSlider();
  updateFrameTabs();
}
function switchFrameTab(tabName) {
  if (!frameSlides) return;
  const mainFrameSlider = document.querySelector('.frame-depiction-section .frame-slider-container');
  if (!mainFrameSlider) return;
  let targetIndex = -1;
  frameSlides.forEach((slide, index) => {
    if (slide.getAttribute('data-tab') === tabName) {
      targetIndex = index;
    }
  });
  if (targetIndex >= 0) {
    currentFrameSlide = targetIndex;
    updateFrameSlider();
    updateFrameTabs();
    const frameTabNav = document.querySelector('.frame-tab-navigation');
    if (frameTabNav && window.innerWidth <= 768) {
      frameTabNav.classList.remove('dropdown-open');
    }
  }
}
function updateFrameTabs() {
  const mainFrameSlider = document.querySelector('.frame-depiction-section');
  if (!mainFrameSlider || !frameSlides) return;
  const tabs = mainFrameSlider.querySelectorAll('.frame-tab');
  const activeSlide = frameSlides[currentFrameSlide];
  if (!activeSlide) return;
  const activeTabName = activeSlide.getAttribute('data-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === activeTabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  if (activeTabName && window.innerWidth <= 768) {
    const frameTabNav = mainFrameSlider.querySelector('.frame-tab-navigation');
    if (frameTabNav) {
      const frameTabButton = frameTabNav.querySelector('.frame-tab-button');
      const frameTabText = frameTabNav.querySelector('.frame-tab-text');
      const tabNames = {
        'tong-the': 'TỔNG THỂ',
        'shophouse': 'SHOPHOUSE',
        'townhouse': 'TOWNHOUSE',
        'clubhouse': 'CLUBHOUSE',
        'cong-vien': 'CÔNG VIÊN'
      };
      if (frameTabButton && frameTabText && tabNames[activeTabName]) {
        frameTabText.textContent = tabNames[activeTabName];
        frameTabButton.setAttribute('data-tab', activeTabName);
      }
    }
  }
}
function handleFrameTabClick(tabName, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const frameTabNav = document.querySelector('.frame-tab-navigation');
  if (!frameTabNav) return;
  const frameTabButton = frameTabNav.querySelector('.frame-tab-button');
  const clickedElement = event ? event.target : null;
  let actualButton = clickedElement;
  if (clickedElement) {
    if (clickedElement.classList.contains('frame-tab-text') || clickedElement.classList.contains('frame-tab-arrow')) {
      actualButton = clickedElement.closest('.frame-tab-button') || clickedElement.closest('.frame-tab');
    } else if (!clickedElement.classList.contains('frame-tab-button') && !clickedElement.classList.contains('frame-tab')) {
      actualButton = clickedElement.closest('.frame-tab-button') || clickedElement.closest('.frame-tab');
    }
  }
  let actualTabName = tabName;
  if (actualButton) {
    const buttonTab = actualButton.getAttribute('data-tab');
    if (buttonTab) {
      actualTabName = buttonTab;
    }
  }
  const isButtonClick = actualButton && actualButton.classList.contains('frame-tab-button');
  const currentTab = frameTabButton ? frameTabButton.getAttribute('data-tab') : null;
  const isCurrentTab = String(currentTab) === String(actualTabName);
  if (window.innerWidth <= 768 && isButtonClick && isCurrentTab) {
    frameTabNav.classList.toggle('dropdown-open');
  } else {
    switchFrameTab(actualTabName);
    if (frameTabNav && window.innerWidth <= 768) {
      frameTabNav.classList.remove('dropdown-open');
    }
  }
}
document.getElementById("connect-today-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const fullname = form.querySelector('#connect-fullname').value.trim();
  const phone = form.querySelector('#connect-phone').value.trim();
  const email = form.querySelector('#connect-email').value.trim();
  if (!fullname || !phone || !email) {
    showNotificationPopup('error', 'Lỗi!', 'Vui lòng điền đầy đủ các trường bắt buộc: Họ và tên, Số điện thoại và Email.');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotificationPopup('error', 'Lỗi!', 'Vui lòng nhập địa chỉ email hợp lệ.');
    return;
  }
  const phoneNumbersOnly = phone.replace(/[\s\-\+\(\)]/g, '');
  const vietnamPhoneRegex = /^(0|\+84|84)[2-9]\d{8}$/;
  if (!vietnamPhoneRegex.test(phoneNumbersOnly)) {
    showNotificationPopup('error', 'Lỗi!', 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0, hoặc +84/84).');
    return;
  }
  const submitBtn = form.querySelector('.connect-form-submit-btn');
  const submitBtnImg = form.querySelector('.connect-submit-btn-img');
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  submitBtnImg.style.opacity = '0.6';
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'submit-loading-spinner';
  loadingSpinner.innerHTML = '<div class="spinner"></div><span class="loading-text">Đang gửi...</span>';
  submitBtn.appendChild(loadingSpinner);
  try {
    const fullNameVal = (form.querySelector('#connect-fullname')?.value || "").trim();
    const phoneVal = (form.querySelector('#connect-phone')?.value || "").trim();
    const emailVal = (form.querySelector('#connect-email')?.value || "").trim();
    const vnFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const vnParts = vnFormatter.formatToParts(new Date());
    const vnMap = Object.fromEntries(vnParts.map((p) => [p.type, p.value]));
    const formattedTime = `${vnMap.year}-${vnMap.month}-${vnMap.day} ${vnMap.hour}:${vnMap.minute}:${vnMap.second}`;
    const payload = {
      'Dấu thời gian': formattedTime,
      'Họ và Tên': fullNameVal,
      'Số điện thoại': phoneVal,
      'Email': emailVal
    };
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      showNotificationPopup('success', 'Thành công!', 'Thông tin của bạn đã được gửi thành công.<br>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
      form.reset();
    } else {
      showNotificationPopup('error', 'Lỗi!', data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  } catch (error) {
    showNotificationPopup('error', 'Lỗi!', 'Đã có lỗi xảy ra khi gửi form. Vui lòng kiểm tra kết nối internet và thử lại.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtnImg.style.opacity = '1';
    loadingSpinner.remove();
  }
});
function showNotificationPopup(type, title, message) {
  const popup = document.getElementById("notificationPopup");
  const icon = document.getElementById("notificationIcon");
  const titleEl = document.getElementById("notificationTitle");
  const messageEl = document.getElementById("notificationMessage");
  titleEl.innerHTML = title;
  messageEl.innerHTML = message;
  if (type === 'success') {
    icon.innerHTML = `
                    <circle cx="12" cy="12" r="10" fill="#eed377" opacity="0.1"/>
                    <path d="M9 12l2 2 4-4" stroke="#902b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <circle cx="12" cy="12" r="10" stroke="#902b2b" stroke-width="2" fill="none"/>
                `;
    popup.classList.remove('error');
    popup.classList.add('success');
  } else {
    icon.innerHTML = `
                    <circle cx="12" cy="12" r="10" fill="#f44336" opacity="0.1"/>
                    <path d="M12 8v4M12 16h.01" stroke="#f44336" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="10" stroke="#f44336" stroke-width="2" fill="none"/>
                `;
    popup.classList.remove('success');
    popup.classList.add('error');
  }
  popup.classList.add('active');
}
function closeNotificationPopup() {
  const popup = document.getElementById("notificationPopup");
  popup.classList.remove('active');
}