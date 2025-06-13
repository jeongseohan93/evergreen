const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

// 상품 전체 조회
router.get('/productAll' , productController.productAll);
// 상품 검색
router.get('/productSearch' , productController.productSearch);
// 재고 수정
router.post('/productStock' , productController.productStock);


module.exports = router;