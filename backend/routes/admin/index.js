const express = require('express');
const router = express.Router();


const main = require('./main');
const parcel = require('./parcel');
const product = require('./product');
const user = require('./user');

const { isLoggedIn, isAdmin } = require('../../middlewares/index');

// 2) 이 아래 모든 /admin/* 요청은 인증 + 관리자 권한이 필요
// router.use(isLoggedIn, isAdmin); // 임시로 주석 처리

// 3) 인증된 관리자만 접근할 수 있는 서브라우터
router.use('/main', main);
router.use('/parcel', parcel);
router.use('/product', product);
router.use('/user', user);

module.exports = router;
