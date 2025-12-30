/**
 * Advanced Lazy Loading for Images
 * Uses Intersection Observer API for better performance
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    rootMargin: '50px 0px', // Load images 50px before they enter viewport
    threshold: 0.01,
    // Placeholder image (1x1 transparent pixel)
    placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  };

  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, loading all images immediately');
    loadAllImages();
    return;
  }

  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, config);

  // Load single image
  function loadImage(img) {
    const src = img.dataset.src || img.getAttribute('data-src');

    if (!src) return;

    // Create new image to preload
    const tempImg = new Image();

    tempImg.onload = function() {
      // Add fade-in class
      img.classList.add('lazy-loading');

      // Set the actual source
      img.src = src;

      // Remove data-src attribute
      img.removeAttribute('data-src');

      // Add loaded class after a small delay for animation
      setTimeout(() => {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
      }, 50);
    };

    tempImg.onerror = function() {
      console.error('Failed to load image:', src);
      img.classList.add('lazy-error');
    };

    // Start loading
    tempImg.src = src;
  }

  // Load all images (fallback for old browsers)
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

  // Initialize lazy loading
  function initLazyLoad() {
    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');

    console.log(`Lazy loading initialized for ${lazyImages.length} images`);

    // Observe each image
    lazyImages.forEach(img => {
      // Set placeholder if image doesn't have src
      if (!img.src || img.src === '') {
        img.src = config.placeholder;
      }

      // Add lazy class for styling
      img.classList.add('lazy');

      // Start observing
      imageObserver.observe(img);
    });
  }

  // Auto-convert loading="lazy" images to data-src for better control
  function convertNativeLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    let converted = 0;

    lazyImages.forEach(img => {
      // Skip if already has data-src
      if (img.hasAttribute('data-src')) return;

      const src = img.getAttribute('src');

      // Only convert if image is not in initial viewport
      const rect = img.getBoundingClientRect();
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );

      // Convert images that are below the fold
      if (!isInViewport && src && src !== config.placeholder) {
        img.setAttribute('data-src', src);
        img.src = config.placeholder;
        img.removeAttribute('loading');
        converted++;
      }
    });

    console.log(`Converted ${converted} native lazy-load images to advanced lazy loading`);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      convertNativeLazyLoad();
      initLazyLoad();
    });
  } else {
    // DOM already loaded
    convertNativeLazyLoad();
    initLazyLoad();
  }

  // Expose API for dynamic content
  window.LazyLoad = {
    init: initLazyLoad,
    loadImage: loadImage,
    observer: imageObserver
  };

})();
