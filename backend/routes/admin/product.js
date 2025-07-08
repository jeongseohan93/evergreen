const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');



// 상품 전체 조회
router.get('/productAll' , productController.productAll);
// 상품 검색
router.get('/productSearch' , productController.productSearch);
// 재고 수정
router.post('/productStock' , productController.productStock);
// 상품 추가
router.post('/productAdd' , productController.productAdd);
// 카테고리 조회
router.get('/categories' , productController.getCategories);
// 카테고리 추가
router.post('/categories' , productController.addCategory);
// 카테고리 삭제
router.delete('/categories/:category_id' , productController.deleteCategory);

// 상품 삭제
router.delete('/productDel/:productId' , productController.productDelete);

router.put('/categories/:category_id' , productController.updateCategory);

//상품 수정
router.put('/productMod/:productId' , productController.productMod);

module.exports = router;