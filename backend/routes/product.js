const express = require('express');
const router = express.Router();
const { groupProduct } = require('../controllers/productController')

router.get('/category', groupProduct );

module.exports = router;