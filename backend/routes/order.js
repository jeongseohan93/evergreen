const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

router.post('/' , orderController.createOrderForPayment);

router.get('/addresses-default', orderController.getAddressDefault);

router.get('/shipping_addresses', orderController.getAllAddressDefault);

module.exports = router;