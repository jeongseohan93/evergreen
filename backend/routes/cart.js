const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

// 'POST /' 요청은 addToCart 함수로 연결
router.post('/', addToCart);

// 'GET /' 요청은 getCart 함수로 연결
router.get('/', getCart);

// 'PATCH /:cartId' 요청은 updateCartItem 함수로 연결
router.patch('/:cartId', updateCartItem);

// 'DELETE /:cartId' 요청은 removeCartItem 함수로 연결
router.delete('/:cartId', removeCartItem);

module.exports = router;