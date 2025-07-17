//일반 사용자 인증 처리 라우터

const express = require('express');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares/index'); // jwt토근 유무 및 로그인 상태가 아닌지 체크하는 미들웨어

const { idcheckr, signup, login, logout, findId, sendVerificationCode, resetPasswordWithCode} = require('../controllers/authController'); // 로그인 요청 처리 컨트롤러

const { isjwt } = require('../utils/isjwt'); // JWT 토큰 생성 및 검증 유틸리티
const { sendToken } = require('../controllers/sendController');
const jwt  =require('jsonwebtoken');
const router = express.Router(); // 라우터 인스턴스 생성 (각 요청 경로를 모듈화하여 관리하기 위함)
const { User } = require('../models');


// ===============================
// [이메일 중복 체크 API 라우팅]
// - POST /idcheck: 회원가입 시 이메일 중복 여부 검사 요청을 idcheckr 컨트롤러에 전달
// ===============================
router.post('/idcheck', idcheckr);


// ===============================
// [회원가입 API 라우팅]
// - POST /register: 회원가입 요청을 register 컨트롤러에 전달
// ===============================

router.post('/signup', signup);

 

// ========================
// [ 로그인 요청 라우팅 ]
// - POST /login으로 들어온 요청 처리 흐름
// - 각 미들웨어/컨트롤러/유틸리티가 순차적으로 실행됨
// 1. isNotLoggedIn(미들웨어) : 로그인 상태가 아니어야만 다음 단계로 진행
// 2. login (컨트롤러) :
//    - Passport.js의 local 전략 사용
//    - 아이디/비밀번호를 passport.authenticate('local')로 검증
//    - 로그인 성공 시 사용자 정보를 req.user에 저장
//    - 이후 단계(JWT 발급 등)로 next() 호출하여 연결
// 3. isjwt(유틸리티) : 로그인 성공 시 JWT 토큰 생성/검증, req에 토큰 추가
// 4. setToken (미들웨어) : JWT 토큰을 Redis 유틸리티로 저장한 뒤 next()로 다음 미들웨어로 넘깁니다.
// 5. sendToken(컨트롤러) : 프론트엔드(클라이언트)로 최종적으로 토큰(및 기타 정보) 응답
// ========================
router.post('/login', isNotLoggedIn, login, isjwt, sendToken);


router.post('/me', async (req, res) => { // async 추가
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(200).json({ isLoggedIn: false, user: null, role: null });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 토큰에 저장된 정보로 사용자 데이터를 DB에서 조회
      const user = await User.findOne({ 
        where: { user_uuid: decoded.user_uuid }, // 토큰 생성 시 넣었던 값으로 조회
        attributes: ['name', 'user_uuid' , 'email', 'role'] // 필요한 정보만 선택
      });

      if (!user) {
        // 토큰은 유효하지만 해당 유저가 DB에 없는 경우
        return res.status(200).json({ isLoggedIn: false, user: null, role: null });
      }

      // ✅ 프론트엔드가 기대하는 형태로 응답을 보냅니다.
      return res.status(200).json({
        isLoggedIn: true,
        user: {
           user_uuid: user.user_uuid,
            name: user.name,
            email: user.email,
            role: user.role
        },
       
      });

    } catch (err) {
      // 토큰이 유효하지 않은 경우 (만료, 위조 등)
      console.error("JWT 검증 실패:", err.message);
      return res.status(200).json({ isLoggedIn: false, user: null, role: null });
    }
});
  


// ===============================
// [로그아웃 API 라우팅]
// - isLoggedIn: JWT 인증된 사용자만 로그아웃 허용(미인증 시 차단)
// - logout: 로그아웃 로직(토큰 무효화 등) 처리 컨트롤러
// ===============================
router.post('/logout', logout);

router.post('/findid', findId);

router.post('/checkemailsent', sendVerificationCode);

router.post('/reset-password', resetPasswordWithCode);

module.exports = router; // 라우터 객체를 외부 모듈에서 사용할 수 있도록 내보냄 

