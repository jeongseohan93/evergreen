const express = require('express');
const router = express.Router();
const parcelController = require('../../controllers/admin/parcelController');

// 모든 배송 현황 조회
router.get('/deliveries', parcelController.getAllDeliveries);

// 배송 상태 업데이트
router.put('/delivery/status', parcelController.updateDeliveryStatus);

// 택배 추적
router.get('/track', parcelController.trackParcel);

// 배송 완료 처리
router.put('/delivery/complete', parcelController.completeDelivery);

// 배송 취소 처리
router.put('/delivery/cancel', parcelController.cancelDelivery);

//router.get('/user' , userController.);

module.exports = router;