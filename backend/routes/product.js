// routes/product.js

const express = require('express');
const router = express.Router();

const { getProductsByPathVariable, getProductById, searchProducts } = require('../controllers/productController');

router.get('/pick/:pickValue', getProductsByPathVariable);

// ⭐️ 1. /category 라우트를 /:productId 보다 먼저 정의합니다.
router.get('/category', searchProducts); // ⭐️ searchProducts 컨트롤러를 '/category'에 연결

// 2. /search 라우트도 /:productId 보다 먼저 정의되어야 합니다. (기존 위치 유지)
router.get('/search', searchProducts);

// 3. /:productId 와 같이 파라미터를 받는 가장 일반적인 라우트는 가장 마지막에 정의합니다.
router.get('/:productId', getProductById);


module.exports = router;