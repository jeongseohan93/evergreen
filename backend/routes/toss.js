const express = require('express');
const router = express.Router();

const tossController = require('../controllers/tossController');

router.post('/success' , tossController.tossPayments );

module.exports = router;