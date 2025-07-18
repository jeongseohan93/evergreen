// routes/product.js

const express = require('express');
const router = express.Router();

const { getBestProducts, getProductById } = require('../controllers/productController');

// 'GET /api/products/best' 요청 시 getBestProducts 함수 실행
router.get('/best', getBestProducts);
router.get('/:productId', getProductById);

module.exports = router;