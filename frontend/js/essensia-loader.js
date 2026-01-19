

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const ESSENSIA_COLLECTION = 'essensia_broadway';

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const content = await loadContentFromFirebase();
    if (content) {
      applyContentToPage(content);
    } else {
      }
  } catch (error) {
    }
});

async function loadContentFromFirebase() {
  try {
    const docRef = doc(db, ESSENSIA_COLLECTION, 'content');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    return null;
  }
}

function applyContentToPage(content) {
  if (content.homepage) {
    applyHomepageContent(content.homepage);
  }

  if (content.location) {
    applyLocationContent(content.location);
  }

  if (content.product) {
    applyProductContent(content.product);
  }

  if (content.floorplan) {
    applyFloorplanContent(content.floorplan);
  }

  if (content.contact) {
    applyContactContent(content.contact);
  }

  if (content.menu) {
    applyMenuContent(content.menu);
  }

  if (content.news) {
    applyNewsContent(content.news);
  }

  if (content.framedepicting) {
    applyFrameDepictingContent(content.framedepicting);
  }

  if (content.developer) {
    applyDeveloperContent(content.developer);
  }
}

function applyHomepageContent(homepage)
{
  const lifestyleTexts = document.querySelectorAll('.lifestyle-text');
  if (lifestyleTexts.length >= 3) {
    if (homepage.description1) lifestyleTexts[0].textContent = homepage.description1;
    if (homepage.description2) lifestyleTexts[1].textContent = homepage.description2;
    if (homepage.description3) lifestyleTexts[2].textContent = homepage.description3;
  }
}

function applyLocationContent(location) {
  const locationText = document.querySelectorAll('.strategic-location-text');
  if (locationText.length >= 2) {
    if (location.description1) locationText[0].textContent = location.description1;
    if (location.description2) locationText[1].textContent = location.description2;
  }
}

function applyFloorplanContent(floorplan) {
  const floorplanText = document.querySelectorAll('.master-plan-text');
  if (floorplanText.length >= 2) {
    if (floorplan.description1) floorplanText[0].textContent = floorplan.description1;
    if (floorplan.description2) floorplanText[1].textContent = floorplan.description2;
  }
}

function applyProductContent(product) {
  const productText = document.querySelectorAll('.clubhouse-text');
  if (productText.length >= 2) {
    if (product.description1) productText[0].textContent = product.description1;
    if (product.description2) productText[1].textContent = product.description2;
  }

  const productPopup1Text = document.querySelectorAll('.popup1description');
  if (productPopup1Text.length >= 2) {
    if (product.popup1description1) productPopup1Text[0].textContent = product.popup1description1;
    if (product.popup1description2) productPopup1Text[1].textContent = product.popup1description2;
  }

  const productPopup2Text = document.querySelectorAll('.popup2description');
  if (productPopup2Text.length >= 1 && product.popup2description1) {
    productPopup2Text[0].textContent = product.popup2description1;
  }

  const popup3Mapping = [
    { class: 'popup3description1', prop: 'popup3description1', useHTML: true },
    { class: 'popup3description2', prop: 'popup3description2', useHTML: true },
    { class: 'popup3tang1tab', prop: 'popup3tang1tab', useHTML: false },
    { class: 'popup3tang1title', prop: 'popup3tang1title', useHTML: true },
    { class: 'popup3tang1desc', prop: 'popup3tang1desc', useHTML: true },
    { class: 'popup3tang1detail', prop: 'popup3tang1detail', useHTML: true },
    { class: 'popup3tang2tab', prop: 'popup3tang2tab', useHTML: true },
    { class: 'popup3tang2title', prop: 'popup3tang2title', useHTML: true },
    { class: 'popup3tang2desc', prop: 'popup3tang2desc', useHTML: true },
    { class: 'popup3tang2detail', prop: 'popup3tang2detail', useHTML: true },
    { class: 'popup3tang3tab', prop: 'popup3tang3tab', useHTML: true },
    { class: 'popup3tang3title', prop: 'popup3tang3title', useHTML: true },
    { class: 'popup3tang3desc', prop: 'popup3tang3desc', useHTML: true },
    { class: 'popup3tang3detail', prop: 'popup3tang3detail', useHTML: true },
    { class: 'popup3tang4tab', prop: 'popup3tang4tab', useHTML: true },
    { class: 'popup3tang4title', prop: 'popup3tang4title', useHTML: true },
    { class: 'popup3tang4desc', prop: 'popup3tang4desc', useHTML: true },
    { class: 'popup3tang4detail', prop: 'popup3tang4detail', useHTML: true }
  ];

  const productPopup3Text = document.querySelectorAll('.popup3trans');
  productPopup3Text.forEach(el => {
    popup3Mapping.forEach(({ class: className, prop, useHTML }) => {
      if (el.classList.contains(className) && product[prop]) {
        el[useHTML ? 'innerHTML' : 'textContent'] = product[prop];
      }
    });
  });

  const productPopup4Text = document.querySelectorAll('.popup4trans');
  productPopup4Text.forEach(el => {
    if (el.classList.contains('popup4desc') && product.popup4desc) {
      el.innerHTML = product.popup4desc;
    }
    if (el.classList.contains('popup4detail') && product.popup4detail) {
      el.innerHTML = product.popup4detail;
    }
  });
}

function applyContactContent(contact) {
  if (contact.hotline) {
    const hotlineElements = document.querySelectorAll('a[href^="tel:"]');
    hotlineElements.forEach(el => {
      el.href = `tel:${contact.hotline.replace(/\s/g, '')}`;
    });

    const hotlineTextElements = document.querySelectorAll('.trans_contact_hotline_number');
    if (hotlineTextElements.length > 0) hotlineTextElements[0].textContent = contact.hotline;
  }

  if(contact.company) {
    const companyElements = document.querySelectorAll('.trans_contact_company');
    if (companyElements.length > 0) companyElements[0].textContent = contact.company;
  }

  if(contact.address) {
    const addressElements = document.querySelectorAll('.trans_contact_address');
    if (addressElements.length > 0) addressElements[0].innerHTML = contact.address;
  }

  if (contact.email) {
    const emailElements = document.querySelectorAll('.trans_contact_email');
    if (emailElements.length > 0) emailElements[0].innerHTML = contact.email;
  }

  if(contact.fromInfo) {
    const fromInfoElements = document.querySelectorAll('.trans_contact_fromInfo');
    if (fromInfoElements.length > 0) fromInfoElements[0].innerHTML = contact.fromInfo;
  }

  if(contact.copyright) {
    const copyrightElements = document.querySelectorAll('.trans_contact_copyright');
    if (copyrightElements.length > 0) copyrightElements[0].innerHTML = contact.copyright;
  }

  if(contact.sociallinktiktok) {
    const sociallinktiktokElements = document.querySelectorAll('.trans_contact_sociallinktiktok');
    if (sociallinktiktokElements.length > 0) sociallinktiktokElements[0].href = contact.sociallinktiktok;
  }

  if(contact.sociallinkfacebook) {
    const sociallinkfacebookElements = document.querySelectorAll('.trans_contact_sociallinkfacebook');
    if (sociallinkfacebookElements.length > 0) sociallinkfacebookElements[0].href = contact.sociallinkfacebook;
  }
}

function applyDeveloperContent(developer) {

  if(developer.description) {
    const descriptioElements = document.querySelectorAll('.trans_developer_description');
    if (descriptioElements.length > 0) descriptioElements[0].innerHTML = developer.description;
  }

  if(developer.partnerstitle) {
    const partnerstitleElements = document.querySelectorAll('.trans_partners_title');
    if (partnerstitleElements.length > 0) partnerstitleElements[0].textContent = developer.partnerstitle;
  }

  if(developer.partnersdescription1) {
    const partnersdescription1Elements = document.querySelectorAll('.trans_partners_description_1');
    if (partnersdescription1Elements.length > 0) partnersdescription1Elements[0].textContent = developer.partnersdescription1;
  }

  if(developer.partnersdescription2) {
    const partnersdescription2Elements = document.querySelectorAll('.trans_partners_description_2');
    if (partnersdescription2Elements.length > 0) partnersdescription2Elements[0].textContent = developer.partnersdescription2;
  }

  if(developer.partnersdescription3) {
    const partnersdescription3Elements = document.querySelectorAll('.trans_partners_description_3');
    if (partnersdescription3Elements.length > 0) partnersdescription3Elements[0].textContent = developer.partnersdescription3;
  }

}

function applyFrameDepictingContent(framedepicting) {
  const frameDepictingText = document.querySelectorAll('.frame-tabs-container .frame-tab');
  if (frameDepictingText.length >= 5) {
    if (framedepicting.tongthe) frameDepictingText[0].textContent = framedepicting.tongthe;
    if (framedepicting.shophouse) frameDepictingText[1].textContent = framedepicting.shophouse;
    if (framedepicting.townhouse) frameDepictingText[2].textContent = framedepicting.townhouse;
    if (framedepicting.clubhouse) frameDepictingText[3].textContent = framedepicting.clubhouse;
    if (framedepicting.congvien) frameDepictingText[4].textContent = framedepicting.congvien;
  }
}

function applyMenuContent(menu) {
  for (let i = 1; i <= 6; i++) {
    const key = `nav_${i}`;
    if (menu[key]) {
      const elements = document.querySelectorAll(`.trans_${key}`);
      elements.forEach(el => {
        el.textContent = menu[key];
      });
    }
  }
}

function applyNewsContent(news) {
  const infoSliderTrack = document.querySelector('.info-slider-track');

  if (!infoSliderTrack || !news.items || news.items.length === 0) {
    return;
  }

  infoSliderTrack.innerHTML = '';

  news.items.forEach(item => {
    const newsCard = document.createElement('a');
    newsCard.href = item.link || '#';
    newsCard.target = '_blank';
    newsCard.className = 'info-card-slide';

    const thumbnailUrl = item.thumbnail || '';
    const thumbnailSrc = thumbnailUrl.startsWith('http') ? thumbnailUrl : `./${thumbnailUrl}`;

    newsCard.innerHTML = `
      <div class="info-card-image">
        <img data-src="${thumbnailSrc}" alt="${item.title || ''}" loading="lazy">
      </div>
      <div class="info-card-content">
        <h3 class="info-card-title">${item.title || ''}</h3>
        <p class="info-card-text">${item.summary || ''}</p>
      </div>
    `;

    infoSliderTrack.appendChild(newsCard);
  });

  if (typeof window.LazyLoad !== 'undefined' && typeof window.LazyLoad.init === 'function') {
    setTimeout(() => {
      window.LazyLoad.init();
    }, 50);
  }

  if (typeof window.initInfoSlider === 'function') {
    setTimeout(() => {
      const totalSlides = document.querySelectorAll('.info-card-slide').length;
      if (window.initInfoSlider() && totalSlides > 1) {
        if (typeof window.startInfoAutoPlay === 'function') {
          window.startInfoAutoPlay();
        }
      }
    }, 150);
  }
}