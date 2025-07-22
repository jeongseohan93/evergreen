const express = require('express');
const router = express.Router();


const mypageController = require('../controllers/mypageController');

// 마이페이지 대시보드 요약
router.get('/', mypageController.getMypageSummary);

// 모든 주문 목록
router.get('/orders', mypageController.getAllOrders);

// 특정 주문 상세
router.get('/orders/:orderId', mypageController.getOrderDetail);


module.exports = router;