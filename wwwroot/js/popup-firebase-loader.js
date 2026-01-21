import { db, POPUP_COLLECTION_NAME } from './firebase-config.js';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const defaultPopupData = {
  type1: {
    imageDesktop: 'images/popup-matcat/pc/1.png',
    imageMobile: 'images/popup-matcat/mobile/1.png',
    content: {
      quantity: '04 căn',
      floor: '3 tầng + 1 tum',
      landArea: '153,75 m² <b>(7,5 x 20 m)</b>',
      bedrooms: '4 phòng ngủ',
      direction: 'Đông Bắc | Tây Nam',
      constructionArea: '116,30 m²',
      density: '75,64%',
      totalArea: '374,63 m²',
      frontSpace: '3 m',
      backSpace: '2 m',
      sideSpace: '- - -'
    }
  },
  type2: {
    imageDesktop: 'images/popup-matcat/pc/2.png',
    imageMobile: 'images/popup-matcat/mobile/2.png',
    content: {
      quantity: '01 căn',
      floor: '3 tầng + 1 tum',
      landArea: '344,50m² <b>(9,4 - 20,9 x 20,5 m)</b>',
      bedrooms: '5 phòng ngủ',
      direction: 'Tây Nam',
      constructionArea: '154,04 m²',
      density: '44,71%',
      totalArea: '482,57 m²',
      frontSpace: '3 m',
      backSpace: '2 m',
      sideSpace: '6 m'
    }
  },
  type3: {
    imageDesktop: 'images/popup-matcat/pc/3.png',
    imageMobile: 'images/popup-matcat/mobile/3.png',
    content: {
      quantity: '46 căn',
      floor: '3 tầng + 1 tum',
      landArea: '153,75 m² <b>(7,5 x 20,5 m)</b>',
      bedrooms: '4 phòng ngủ',
      direction: 'Tây Nam',
      constructionArea: '116,30 m²',
      density: '75,64%',
      totalArea: '368,33 m²',
      frontSpace: '3 m',
      backSpace: '2 m',
      sideSpace: '- - -'
    }
  },
  type4: {
    imageDesktop: 'images/popup-matcat/pc/4.png',
    imageMobile: 'images/popup-matcat/mobile/4.png',
    content: {
      quantity: '01 căn',
      floor: '3 tầng + 1 tum',
      landArea: '392,52 m² <b>(13,4 - 19,9 x 23 m)</b>',
      bedrooms: '4 phòng ngủ',
      direction: 'Đông Bắc',
      constructionArea: '149,84 m²',
      density: '38,18%',
      totalArea: '467,18 m²',
      frontSpace: '6 m',
      backSpace: '2 m',
      sideSpace: '6 m'
    }
  },
  type5: {
    imageDesktop: 'images/popup-matcat/pc/5.png',
    imageMobile: 'images/popup-matcat/mobile/5.png',
    content: {
      quantity: '28 căn',
      floor: '3 tầng + 1 tum',
      landArea: '172,50 m² <b>(7,5 x 23 m)</b>',
      bedrooms: '3 phòng ngủ',
      direction: 'Đông Bắc',
      constructionArea: '112,50 m²',
      density: '65,22%',
      totalArea: '366,36 m²',
      frontSpace: '6 m',
      backSpace: '2 m',
      sideSpace: '- - -'
    }
  },
  type6: {
    imageDesktop: 'images/popup-matcat/pc/6.png',
    imageMobile: 'images/popup-matcat/mobile/6.png',
    content: {
      quantity: '02 căn',
      floor: '3 tầng + 1 tum',
      landArea: '172,50 m² <b>(7,5 x 23 m)</b>',
      bedrooms: '3 phòng ngủ',
      direction: 'Đông Bắc',
      constructionArea: '112,50 m²',
      density: '65,22%',
      totalArea: '364,45 m²',
      frontSpace: '6 m',
      backSpace: '2 m',
      sideSpace: '- - -'
    }
  }
};

window.floorPlanPopupData = defaultPopupData;
export function loadFloorPlanPopupData() {
  return new Promise((resolve) => {
    try {
      const popupDocRef = doc(db, POPUP_COLLECTION_NAME, 'data');

      onSnapshot(popupDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const firebaseData = docSnapshot.data();
          window.floorPlanPopupData = firebaseData;
          resolve(firebaseData);
        } else {
          window.floorPlanPopupData = defaultPopupData;
          resolve(defaultPopupData);
        }
      }, (error) => {
        window.floorPlanPopupData = defaultPopupData;
        resolve(defaultPopupData);
      });
    } catch (error) {
      window.floorPlanPopupData = defaultPopupData;
      resolve(defaultPopupData);
    }
  });
}

export function getPopupDataByType(type) {
  const data = window.floorPlanPopupData || defaultPopupData;
  const firebaseTypeData = data[`type${type}`];
  const defaultTypeData = defaultPopupData[`type${type}`] || defaultPopupData.type1;

  if (!firebaseTypeData) {
    return defaultTypeData;
  }

  return {
    imageDesktop: firebaseTypeData.imageDesktop || defaultTypeData.imageDesktop,
    imageMobile: firebaseTypeData.imageMobile || defaultTypeData.imageMobile,
    content: {
      quantity: firebaseTypeData.content?.quantity || defaultTypeData.content.quantity,
      floor: firebaseTypeData.content?.floor || defaultTypeData.content.floor,
      landArea: firebaseTypeData.content?.landArea || defaultTypeData.content.landArea,
      bedrooms: firebaseTypeData.content?.bedrooms || defaultTypeData.content.bedrooms,
      direction: firebaseTypeData.content?.direction || defaultTypeData.content.direction,
      constructionArea: firebaseTypeData.content?.constructionArea || defaultTypeData.content.constructionArea,
      density: firebaseTypeData.content?.density || defaultTypeData.content.density,
      totalArea: firebaseTypeData.content?.totalArea || defaultTypeData.content.totalArea,
      frontSpace: firebaseTypeData.content?.frontSpace || defaultTypeData.content.frontSpace,
      backSpace: firebaseTypeData.content?.backSpace || defaultTypeData.content.backSpace,
      sideSpace: firebaseTypeData.content?.sideSpace || defaultTypeData.content.sideSpace
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadFloorPlanPopupData();
  });
} else {
  loadFloorPlanPopupData();
}
