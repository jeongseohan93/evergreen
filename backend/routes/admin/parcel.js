const express = require('express');
const router = express.Router();
const parcelController = require('../../controllers/admin/parcelController');

// 모든 배송 현황 조회
router.get('/deliveries', parcelController.getAllDeliveries);

// 배송 상태 업데이트
router.put('/status', parcelController.updateDeliveryStatus);

// 배송 완료 처리
router.put('/complete', parcelController.completeDelivery);

// 배송 취소 처리
router.put('/cancel', parcelController.cancelDelivery);

// 배송 정보 전체 수정
router.put('/deliveries/:id', parcelController.updateDeliveryInfo);

//router.get('/user' , userController.);

module.exports = router;