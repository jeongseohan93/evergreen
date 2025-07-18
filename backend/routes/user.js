const express = require('express');
const router = express.Router();
const { userinfor, updateMyInfo } = require('../controllers/userController');

router.get('/infor', userinfor);

router.put('/infor',updateMyInfo )

module.exports = router;