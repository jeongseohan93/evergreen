const express = require('express');
const router = express.Router();
const { productSearch } = require('../../controllers/admin/productController');


// 상품 검색
router.get('/productSearch' , productSearch);


module.exports = router;