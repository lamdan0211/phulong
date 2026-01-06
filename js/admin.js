/**
 * ESSENSIA BROADWAY - UNIFIED ADMIN PANEL
 * Quản lý toàn bộ nội dung text và hình ảnh trong 1 file duy nhất
 */

import { auth, db } from './firebase-config.js';
import { TEXT_MAPPINGS, IMAGE_MAPPINGS } from './content-mappings.js';
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

/**
 * ==============================================
 * IMAGE GROUPS DEFINITION
 * ==============================================
 */
const IMAGE_GROUPS = {
    logos: {
        title: 'Logos & Branding',
        images: [
            { key: 'logo_broadway', label: 'Logo Broadway', original: 'LOGO-BROADWAY.png' },
            { key: 'logo_broadway_preload', label: 'Logo Preloader', original: 'LOGO-BROADWAY-PRELOAD.png' },
            { key: 'logo_phulong', label: 'Logo Phú Long', original: 'logo-phulong.png' },
            { key: 'slogan_graphic', label: 'Slogan Graphic', original: 'saibuocthoithuong.svg' },
            { key: 'title_lifestyle', label: 'Title Lifestyle', original: 'chuansongthuongluu.svg' }
        ]
    },
    hero: {
        title: 'Hero & Banners',
        images: [
            { key: 'banner_desktop', label: 'Banner Desktop', original: 'banner-top.png' },
            { key: 'banner_mobile', label: 'Banner Mobile', original: 'banner-top-mobile.png' },
            { key: 'hero_view', label: 'Hero View', original: 'pic-view.png' },
            { key: 'circle_image', label: 'Circle Overlay', original: 'circle-image.png' },
            { key: 'location_map', label: 'Location Map', original: 'map.svg' },
            { key: 'scroll_indicator', label: 'Scroll Icon', original: 'SCROLL.svg' }
        ]
    },
    features: {
        title: 'Features & Amenities',
        images: [
            { key: 'clubhouse', label: 'Clubhouse', original: 'clubhouse-pic.png' },
            { key: 'park', label: 'Công viên', original: 'congvien-pic.png' },
            { key: 'privilege_luxury', label: 'Đặc quyền thượng lưu', original: 'dacquyenthuongluu.svg' },
            { key: 'privilege_experience', label: 'Đặc quyền trải nghiệm', original: 'dacquyentrainghiem.svg' },
            { key: 'feature_1', label: 'Feature 1', original: 'botrikhoahoc.svg' },
            { key: 'feature_2', label: 'Feature 2', original: 'vitrichienluoc.svg' },
            { key: 'btn_register', label: 'Nút Đăng ký', original: 'btn-dangkyngay.svg' },
            { key: 'hotline_img', label: 'Hotline Image', original: 'HOTLINE.png' },
            { key: 'modal_floor', label: 'Floor Modal', original: 'floor-clubhouse-modal.png' },
            { key: 'time_3min', label: '3 phút', original: '3phut-image.png' }
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
        alert('Không thể đăng xuất');
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
        renderDynamicTextSections();
        renderDynamicImageGrid();

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
    // Hero
    if (data.hero) {
        setValue('hero-title', data.hero.title);
        setValue('hero-subtitle', data.hero.subtitle);
        setValue('hero-desc1', data.hero.description1);
        setValue('hero-desc2', data.hero.description2);
        setValue('hero-desc3', data.hero.description3);
    }

    // Location
    if (data.location) {
        setValue('location-title', data.location.title);
        setValue('location-desc', data.location.description);
    }

    // Product
    if (data.product) {
        setValue('product-title', data.product.title);
        setValue('product-desc', data.product.description);
    }

    // News
    if (data.news) {
        setValue('news-title', data.news.title);
        renderNewsList(data.news.items || []);
    }

    // Contact
    if (data.contact) {
        setValue('contact-hotline', data.contact.hotline);
        setValue('contact-email', data.contact.email);
        setValue('contact-address', data.contact.address);
        setValue('contact-project-address', data.contact.projectAddress);
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

function renderNewsList(items) {
    const container = document.getElementById('news-items-container');
    if (!container) return;

    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-card-header">
                <h3>Tin ${index + 1}</h3>
                <button class="btn-delete" onclick="window.deleteNews(${index})">🗑️ Xóa</button>
            </div>
            <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" id="news-item-title-${index}" value="${item.title || ''}">
            </div>
            <div class="form-group">
                <label>Tóm tắt</label>
                <textarea id="news-item-excerpt-${index}" rows="2">${item.excerpt || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Nội dung</label>
                <textarea id="news-item-content-${index}" rows="3">${item.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Ngày</label>
                <input type="date" id="news-item-date-${index}" value="${item.date || ''}">
            </div>
        `;
        container.appendChild(div);
    });
}

document.getElementById('add-news-btn')?.addEventListener('click', () => {
    if (!contentData.news) contentData.news = { title: '', items: [] };
    if (!contentData.news.items) contentData.news.items = [];

    contentData.news.items.push({
        title: 'Tin mới',
        excerpt: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });

    renderNewsList(contentData.news.items);
});

window.deleteNews = (index) => {
    if (confirm('Xóa tin này?')) {
        contentData.news.items.splice(index, 1);
        renderNewsList(contentData.news.items);
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

    group.images.forEach(imageConfig => {
        const imageItem = createImageItem(imageConfig, groupKey);
        container.appendChild(imageItem);
    });
}

function createImageItem(imageConfig, groupKey) {
    const { key, label, original } = imageConfig;
    const div = document.createElement('div');
    div.className = 'image-item';

    // Lấy hình từ imagesData hoặc dùng placeholder
    const currentImage = imagesData[key] || `images/${original}`;
    const isUploaded = imagesData[key] && imagesData[key].startsWith('data:');

    div.innerHTML = `
        <img src="${currentImage}" alt="${label}" id="preview-${key}">
        <label>${label}</label>
        <small>File gốc: ${original}</small>
        <input type="file"
               id="input-${key}"
               accept="image/*"
               style="display: none"
               data-key="${key}">
        <button class="upload-btn" onclick="document.getElementById('input-${key}').click()">
            📁 Chọn hình mới (max 1MB)
        </button>
        <span class="image-status ${isUploaded ? 'status-uploaded' : 'status-pending'}">
            ${isUploaded ? '✓ Đã upload' : 'Dùng hình gốc'}
        </span>
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
        alert('Vui lòng chọn file hình ảnh');
        return;
    }

    if (file.size > 1 * 1024 * 1024) {
        alert('Hình quá lớn! Tối đa 1MB. Vui lòng nén hình trước.');
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
        alert('Không thể xử lý hình');
    }
}

function renderDynamicTextSections() {
    const container = document.getElementById('all-text-sections');
    if (!container) return;

    const dynamicText = contentData.dynamicText || {};
    container.innerHTML = '';

    // FILTER: Chỉ lấy text quan trọng (loại bỏ menu, navigation duplicate)
    const importantSections = ['head', 'hero-section', 'strategic-location-section', 'product-section',
                                'news-article', 'contact-info-section', 'popup-park', 'popup-clubhouse',
                                'popup-role', 'popup-role-second', 'legend-item'];

    const filteredMappings = TEXT_MAPPINGS.filter(item => {
        // Chỉ lấy text dài > 10 ký tự HOẶC thuộc important sections
        const isImportant = importantSections.includes(item.section);
        const isLongText = (item.defaultValue || '').length > 15;
        return isImportant || isLongText;
    });

    const sectionsOrder = [];
    const sectionMap = {};
    filteredMappings.forEach(item => {
        const section = item.section || 'uncategorized';
        if (!sectionMap[section]) {
            sectionMap[section] = [];
            sectionsOrder.push(section);
        }
        sectionMap[section].push(item);
    });

    // Sort sections theo thứ tự logic
    const sectionPriority = {
        'head': 0,
        'hero-section': 1,
        'strategic-location-section': 2,
        'product-section': 3,
        'news-article': 4,
        'contact-info-section': 5,
        'popup-park': 6,
        'popup-clubhouse': 7
    };

    sectionsOrder.sort((a, b) => {
        const priorityA = sectionPriority[a] ?? 999;
        const priorityB = sectionPriority[b] ?? 999;
        return priorityA - priorityB;
    });

    sectionsOrder.forEach(section => {
        const sectionBox = document.createElement('div');
        sectionBox.className = 'section-editor';
        sectionBox.style.marginTop = '1.5rem';

        // Translate section names
        const sectionNames = {
            'head': '📄 Meta & Title',
            'hero-section': '🏠 Hero Section',
            'strategic-location-section': '📍 Vị trí',
            'product-section': '🏗️ Sản phẩm',
            'news-article': '📰 Tin tức',
            'contact-info-section': '📞 Liên hệ',
            'popup-park': '🌳 Popup Công viên',
            'popup-clubhouse': '🏋️ Popup Clubhouse',
            'popup-role': '🏢 Popup Shophouse',
            'popup-role-second': '🏘️ Popup Townhouse',
            'legend-item': '🗺️ Legend Items'
        };

        sectionBox.innerHTML = `<h3>${sectionNames[section] || section}</h3>`;

        sectionMap[section].forEach(item => {
            const value = dynamicText[item.key] ?? item.defaultValue ?? '';
            const displayValue = item.mode === 'html' ? normalizeLineBreaks(value) : value;
            const useTextarea = displayValue.length > 100 || item.mode === 'html';
            const field = document.createElement('div');
            field.className = 'form-group';
            field.innerHTML = `
                <label>${item.label.substring(0, 80)}${item.label.length > 80 ? '...' : ''}</label>
                ${useTextarea
                    ? `<textarea data-text-key="${item.key}" data-text-mode="${item.mode}" rows="4">${escapeHtml(displayValue)}</textarea>`
                    : `<input type="text" data-text-key="${item.key}" data-text-mode="${item.mode}" value="${escapeHtml(displayValue)}">`
                }
                <small style="color:#6b7280;">Selector: ${item.selector}[${item.index}]</small>
            `;
            sectionBox.appendChild(field);
        });

        container.appendChild(sectionBox);
    });

    console.log(`✅ Rendered ${filteredMappings.length} text fields (filtered from ${TEXT_MAPPINGS.length})`);
}

function renderDynamicImageGrid() {
    const container = document.getElementById('all-images-grid');
    if (!container) return;
    container.innerHTML = '';

    const dynamicImages = imagesData.dynamicImages || {};

    // FILTER: Chỉ lấy hình quan trọng (loại bỏ navigation arrows, duplicates)
    const importantImages = IMAGE_MAPPINGS.filter(item => {
        // Loại bỏ navigation arrows
        if (item.label.includes('pre-btn') || item.label.includes('next-btn')) return false;
        if (item.label.includes('arrow') || item.label.includes('pre-news') || item.label.includes('next-news')) return false;

        // Loại bỏ duplicate mobile/desktop khi có cả 2
        // (Chỉ giữ 1, ưu tiên desktop)
        const isMobileDuplicate = item.label.includes('mobile') &&
            IMAGE_MAPPINGS.some(other =>
                other.label === item.label.replace('mobile', '').replace('-mobile', '') &&
                other !== item
            );
        if (isMobileDuplicate) return false;

        return true;
    });

    importantImages.forEach(item => {
        const currentImage = dynamicImages[item.key] || item.defaultValue || '';
        const isUploaded = dynamicImages[item.key] && dynamicImages[item.key].startsWith('data:');
        const div = document.createElement('div');
        div.className = 'image-item';
        div.innerHTML = `
            <img src="${currentImage}" alt="${item.label}" id="preview-dynamic-${item.key}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e5e7eb%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%236b7280%22 font-size=%2214%22>No image</text></svg>'">
            <label title="${item.label}">${item.label.substring(0, 40)}${item.label.length > 40 ? '...' : ''}</label>
            <small>Section: ${item.section || 'other'}</small>
            <input type="file"
                   id="input-dynamic-${item.key}"
                   accept="image/*"
                   style="display: none"
                   data-key="${item.key}">
            <button class="upload-btn" onclick="document.getElementById('input-dynamic-${item.key}').click()">
                📁 Chọn hình (max 1MB)
            </button>
            <span class="image-status ${isUploaded ? 'status-uploaded' : 'status-pending'}">
                ${isUploaded ? '✓ Đã upload' : 'Dùng hình gốc'}
            </span>
        `;
        const input = div.querySelector(`#input-dynamic-${item.key}`);
        input.addEventListener('change', (e) => handleDynamicImageUpload(e, item.key));
        container.appendChild(div);
    });

    console.log(`✅ Rendered ${importantImages.length} images (filtered from ${IMAGE_MAPPINGS.length})`);
}

async function handleDynamicImageUpload(event, imageKey) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
    }

    if (file.size > 1 * 1024 * 1024) {
        alert('Hình quá lớn! Tối đa 1MB. Vui lòng nén hình trước.');
        return;
    }

    try {
        console.log(`📤 Đang convert ${file.name}...`);
        const base64 = await fileToBase64(file);
        uploadedDynamicImages[imageKey] = base64;

        const preview = document.getElementById(`preview-dynamic-${imageKey}`);
        if (preview) {
            preview.src = base64;
        }

        const status = preview.parentElement.querySelector('.image-status');
        if (status) {
            status.className = 'image-status status-uploaded';
            status.textContent = '✓ Sẵn sàng lưu';
        }
    } catch (error) {
        console.error('❌ Lỗi:', error);
        alert('Không thể xử lý hình');
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

/**
 * ==============================================
 * SAVE ALL CHANGES
 * ==============================================
 */

saveAllBtn.addEventListener('click', async () => {
    try {
        saveAllBtn.disabled = true;
        saveAllBtn.innerHTML = '<span class="spinner"></span> Đang lưu...';

        // Collect text data
        collectTextData();

        // Merge uploaded images vào imagesData
        Object.assign(imagesData, uploadedImages);
        imagesData.dynamicImages = imagesData.dynamicImages || {};
        Object.assign(imagesData.dynamicImages, uploadedDynamicImages);

        // Save both collections
        await setDoc(doc(db, TEXT_COLLECTION, 'content'), contentData);
        await setDoc(doc(db, IMAGES_COLLECTION, 'data'), imagesData);

        // Clear uploaded cache
        uploadedImages = {};
        uploadedDynamicImages = {};

        // Show success
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        console.log('✅ Đã lưu thành công!');

        // Re-render để update status
        renderAllImageGroups();
        renderDynamicImageGrid();
    } catch (error) {
        console.error('❌ Lỗi:', error);
        alert('Không thể lưu. Vui lòng thử lại.');
    } finally {
        saveAllBtn.disabled = false;
        saveAllBtn.innerHTML = '💾 Lưu tất cả thay đổi';
    }
});

function collectTextData() {
    // Hero
    contentData.hero = {
        title: getValue('hero-title'),
        subtitle: getValue('hero-subtitle'),
        description1: getValue('hero-desc1'),
        description2: getValue('hero-desc2'),
        description3: getValue('hero-desc3')
    };

    // Location
    contentData.location = {
        title: getValue('location-title'),
        description: getValue('location-desc')
    };

    // Product
    contentData.product = {
        title: getValue('product-title'),
        description: getValue('product-desc')
    };

    // News
    const newsItems = [];
    const newsCount = document.querySelectorAll('[id^="news-item-title-"]').length;
    for (let i = 0; i < newsCount; i++) {
        newsItems.push({
            title: getValue(`news-item-title-${i}`),
            excerpt: getValue(`news-item-excerpt-${i}`),
            content: getValue(`news-item-content-${i}`),
            date: getValue(`news-item-date-${i}`)
        });
    }
    contentData.news = {
        title: getValue('news-title'),
        items: newsItems
    };

    // Contact
    contentData.contact = {
        hotline: getValue('contact-hotline'),
        email: getValue('contact-email'),
        address: getValue('contact-address'),
        projectAddress: getValue('contact-project-address')
    };

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
