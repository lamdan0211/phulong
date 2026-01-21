(function () {
  'use strict';
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  };
  if (!('IntersectionObserver' in window)) {
    loadAllImages();
    return;
  }
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, config);
  function loadImage(img) {
    const src = img.dataset.src || img.getAttribute('data-src');
    if (!src) return;
    const tempImg = new Image();
    tempImg.onload = function () {
      img.classList.add('lazy-loading');
      img.src = src;
      img.removeAttribute('data-src');
      setTimeout(() => {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
      }, 50);
    };
    tempImg.onerror = function () {
      img.classList.add('lazy-error');
    };
    tempImg.src = src;
  }
  function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      const src = img.dataset.src || img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
  }
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (!img.src || img.src === '') {
        img.src = config.placeholder;
      }
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLazyLoad();
    });
  } else {
    initLazyLoad();
  }
  window.LazyLoad = {
    init: initLazyLoad,
    loadImage: loadImage,
    observer: imageObserver
  };
})();