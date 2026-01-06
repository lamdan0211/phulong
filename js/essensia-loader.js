/**
 * ESSENSIA BROADWAY - CONTENT LOADER
 * Load dynamic content từ Firebase Firestore vào index.html
 */

import { db } from './firebase-config.js';
import { TEXT_MAPPINGS } from './content-mappings.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const ESSENSIA_COLLECTION = 'essensia_broadway';

/**
 * Load content khi page đã sẵn sàng
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔥 Essensia Loader: Bắt đầu load content...');

    try {
        const content = await loadContentFromFirebase();
        if (content) {
            applyContentToPage(content);
            console.log('✅ Đã load và apply content thành công!');
        } else {
            console.warn('⚠️ Không có content trong Firebase, dùng content mặc định');
        }
    } catch (error) {
        console.error('❌ Lỗi khi load content:', error);
    }
});

/**
 * Load content từ Firestore
 */
async function loadContentFromFirebase() {
    try {
        const docRef = doc(db, ESSENSIA_COLLECTION, 'content');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('❌ Lỗi Firestore:', error);
        return null;
    }
}

/**
 * Apply content vào các elements trong page
 */
function applyContentToPage(content) {
    // HERO SECTION
    if (content.hero) {
        applyHeroContent(content.hero);
    }

    // LOCATION SECTION
    if (content.location) {
        applyLocationContent(content.location);
    }

    // CONTACT
    if (content.contact) {
        applyContactContent(content.contact);
    }

    // Dynamic text mappings
    if (content.dynamicText) {
        applyDynamicText(content.dynamicText);
    }
}

/**
 * Apply Hero content
 */
function applyHeroContent(hero) {
    // Title (trong meta description)
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && hero.subtitle) {
        metaDesc.setAttribute('content', hero.subtitle);
    }

    // Title tag
    if (hero.title) {
        document.title = `${hero.title} - PhuLong`;
    }

    // Lifestyle description paragraphs (3 đoạn trong section trang-chu)
    const lifestyleTexts = document.querySelectorAll('.lifestyle-text');
    if (lifestyleTexts.length >= 3) {
        if (hero.description1) lifestyleTexts[0].textContent = hero.description1;
        if (hero.description2) lifestyleTexts[1].textContent = hero.description2;
        if (hero.description3) lifestyleTexts[2].textContent = hero.description3;
    }

    // Hero banner images (nếu có Base64)
    if (hero.bannerDesktop) {
        const desktopBanner = document.querySelector('.hero-image.desktop .hero-bg-img');
        if (desktopBanner) {
            desktopBanner.src = hero.bannerDesktop;
        }
    }

    if (hero.bannerMobile) {
        const mobileBanner = document.querySelector('.hero-image.mobile .hero-bg-img');
        if (mobileBanner) {
            mobileBanner.src = hero.bannerMobile;
        }
    }

    console.log('✅ Applied Hero content');
}

/**
 * Apply Location content
 */
function applyLocationContent(location) {
    // Location description
    const locationText = document.querySelector('.strategic-location-text');
    if (locationText && location.description) {
        locationText.textContent = location.description;
    }

    // Map image
    if (location.mapImage) {
        const mapImages = document.querySelectorAll('.map-image');
        mapImages.forEach(img => {
            img.src = location.mapImage;
        });
    }

    console.log('✅ Applied Location content');
}

/**
 * Apply Contact content
 */
function applyContactContent(contact) {
    // Tìm tất cả các elements có text là hotline và thay thế
    if (contact.hotline) {
        // Có thể có nhiều nơi hiển thị hotline
        const hotlineElements = document.querySelectorAll('a[href^="tel:"]');
        hotlineElements.forEach(el => {
            el.textContent = contact.hotline;
            el.href = `tel:${contact.hotline.replace(/\s/g, '')}`;
        });
    }

    // Email
    if (contact.email) {
        const emailElements = document.querySelectorAll('a[href^="mailto:"]');
        emailElements.forEach(el => {
            el.textContent = contact.email;
            el.href = `mailto:${contact.email}`;
        });
    }

    console.log('✅ Applied Contact content');
}

/**
 * Helper: Replace text trong element
 */
function replaceText(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
        element.textContent = text;
    }
}

/**
 * Helper: Replace image src
 */
function replaceImage(selector, imageSrc) {
    const element = document.querySelector(selector);
    if (element && imageSrc) {
        element.src = imageSrc;
    }
}

console.log('🔥 Essensia Loader initialized');

function applyDynamicText(dynamicText) {
    TEXT_MAPPINGS.forEach(item => {
        const value = dynamicText[item.key];
        if (value === undefined || value === null) return;
        const elements = document.querySelectorAll(item.selector);
        const target = elements[item.index];
        if (!target) return;
        if (item.mode === 'attr' && item.attribute) {
            target.setAttribute(item.attribute, value);
            return;
        }
        if (item.mode === 'html') {
            target.innerHTML = value;
            return;
        }
        target.textContent = value;
    });
    console.log('✅ Applied Dynamic Text content');
}
