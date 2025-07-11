// backend/routes/main.js
const express = require('express');
const router = express.Router();
// mainController.js는 backend/controllers/admin/mainController.js에 있으므로 상대 경로를 잘 맞춰야 함.
// routes/main.js에서 controllers/admin/mainController.js로 가는 경로:
// '../controllers/admin/mainController'
const mainController = require('../../controllers/admin/mainController'); 

// --- 배너 관련 라우트 ---
// 배너 추가 (이미지 업로드 포함)
// 'bannerImage'는 프론트엔드에서 FormData에 추가할 필드 이름과 동일해야 함.
router.post('/banners', mainController.addBanner);

// 모든 배너 조회 (관리자용)
router.get('/banners/all', mainController.getAllBanners);

// 활성화된 배너 조회 (프론트엔드 메인 페이지용)
router.get('/banners', mainController.getActiveBanners);

// 특정 배너 수정 (이미지 변경 포함)
router.put('/banners/:bannerId', mainController.updateBanner);

// 특정 배너 삭제
router.delete('/banners/:bannerId', mainController.deleteBanner);

// 특정 배너의 순서 및 활성화 상태만 업데이트
router.patch('/banners/:bannerId/status-order', mainController.updateBannerStatusAndOrder);

// 여기에 main 대시보드에 필요한 다른 라우트들을 추가할 수 있음
// 예: router.get('/', mainController.getDashboardData);

module.exports = router;

