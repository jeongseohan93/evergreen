const express = require('express');
const router = express.Router();
const saleController = require('../../controllers/admin/saleController');

// 매출 입력 (오프라인 매출 + 온라인 매출 자동 계산)
router.post('/add', saleController.addSale);

// 일간 매출 조회
router.get('/daily', saleController.getDailySales);

// 월간 매출 조회
router.get('/monthly', saleController.getMonthlySales);

// 연간 매출 조회
router.get('/yearly', saleController.getYearlySales);

// 특정 날짜의 매출 상세 조회
router.get('/date/:sale_date', saleController.getSaleByDate);

module.exports = router; 