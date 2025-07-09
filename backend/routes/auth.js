//일반 사용자 인증 처리 라우터

const express = require('express');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares/index'); // jwt토근 유무 및 로그인 상태가 아닌지 체크하는 미들웨어
const { idcheckr, signup, login, logout } = require('../controllers/authController'); // 로그인 요청 처리 컨트롤러
const { isjwt } = require('../utils/isjwt'); // JWT 토큰 생성 및 검증 유틸리티
const { sendToken } = require('../controllers/sendController');
const jwt  =require('jsonwebtoken');
const router = express.Router(); // 라우터 인스턴스 생성 (각 요청 경로를 모듈화하여 관리하기 위함)


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


router.post('/logincheck', (req, res) => {
    try {
        
      const token = req.cookies.access_token; // ✅ 수정된 부분
      console.log(token);
      if (!token) {
        return res.status(401).json({ success: false, message: "No token" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      return res.json({
        success: true,
        role: decoded.role,
      });
    } catch (err) {
      console.error("JWT 검증 실패:", err.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  });
  


// ===============================
// [로그아웃 API 라우팅]
// - isLoggedIn: JWT 인증된 사용자만 로그아웃 허용(미인증 시 차단)
// - logout: 로그아웃 로직(토큰 무효화 등) 처리 컨트롤러
// ===============================
router.post('/logout', logout);


module.exports = router; // 라우터 객체를 외부 모듈에서 사용할 수 있도록 내보냄 

