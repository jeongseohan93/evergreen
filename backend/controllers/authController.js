// 인증(회원가입, 로그인, 로그아웃) 및 유저 관련 컨트롤러 모음

const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { v4: uuidv4} = require('uuid');
const { setToken, deleteToken } = require('../utils/redis');
const jwt = require('jsonwebtoken');
// ===============================
// [ idcheckr 컨트롤러 ]
// - 회원가입 시 이메일 중복 여부를 검사하는 API
// - email이 req.body에 없으면 400 에러 반환
// - 이미 가입된 이메일이면 409(Conflict) 에러 반환
// - 가입 이력이 없으면 200 OK와 함께 "가입된 이메일이 아님" 메시지 반환
// - 서버 오류 시 500 에러 처리
// ===============================
exports.idcheckr = async (req, res) => {
  try {
    const { email } = req.body;

    // 이메일 값이 없으면 요청 에러 응답 (400)
    if (!email) {
      return res.status(400).json({ message: 'email이 필요합니다.' });
    }

    // DB에서 이메일로 기존 유저 검색
    const userCheck = await User.findOne({
      where: { email },
      attributes: ['email'],
    });

    if (userCheck) {
      // 이미 가입된 이메일 → 409 Conflict
      return res.status(409).json({ message: '가입된 이메일입니다.' });
    }

    // 가입 이력이 없는 이메일 → 200 OK
    return res.status(200).json({ message: '가입된 이메일이 아닙니다.' });
  } catch (err) {
    // 서버 에러 발생 시 500 응답
    console.error("아이디 체크 오류:", err);
    return res.status(500).json({ message: '서버 오류' });
  }
};


// ===============================
// [ register 컨트롤러 ]
// - 회원가입 요청 처리
// - 이메일 중복 확인 → 이미 존재하면 409 에러
// - 비밀번호 해싱(bcrypt) 후 사용자 생성
// - 회원가입 성공 시 201 Created 응답, 실패 시 500 에러
// ===============================
exports.signup = async (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    address
  } = req.body;

  // 1. 이메일 중복 체크
  const exUser = await User.findOne({ where: { email } });
  if (exUser) {
    // 이미 가입된 이메일일 경우 409 응답
    return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
  }

  try {
    // 2. 비밀번호 해싱 
    const hash = await bcrypt.hash(password, 12);

    // 3. 새 사용자 생성 (UUID는 직접 생성, 비밀번호는 해싱된 값으로 저장)
    await User.create({
      user_uuid: uuidv4(),
      email,
      password: hash,
      name,
      phone,
      address 
    });

    // 4. 성공 응답 (201 Created)
    return res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    // 서버 에러 처리 (500)
    console.error(error);
    return res.status(500).json({ message: '서버 에러 발생' });
  }
};


// ===============================
// [ login 컨트롤러 (Passport local 전략 사용) ]
// - passport.authenticate('local', ...) 직접 콜백 적용 
// - 인증 성공 시 user 객체에서 필요한 정보만 req.authData에 저장 
// - 인증 실패/오류 시 각각 401 또는 서버 에러 응답
// ===============================
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      // 인증 처리 중 서버 에러 발생
      console.error(authError);
      return next(authError); // 에러 핸들링 미들웨어로 이동
    }

    if (!user) {
      // 인증 실패 (아이디/비밀번호 불일치 등)
      return res.status(401).json({ message: info?.message || '로그인 실패' });
    }

    // 제명된 회원 체크
    if (user.deletedAt !== null) {
      return res.status(403).json({ message: '제명된 회원입니다. 로그인할 수 없습니다.' });
    }

    // 인증 성공! user 객체에서 필요한 정보만 추출해서 req.authData에 저장
    req.authData = {
      email: user.email,
      nick: user.nick,
      role: user.role,
    }; // 다음 미들웨어(JWT 생성, 토큰 저장 등)에서 활용 가능
    next(); // 다음 미들웨어로 이동
  })(req, res, next); // passport.authenticate는 미들웨어가 아닌 함수이므로 즉시 실행(괄호 위치 매우 중요)
};


// ===============================
// [ logout 컨트롤러 ]
// - Authorization 헤더에서 JWT 추출
// - 토큰을 블랙리스트에 등록하여 재사용 방지
// - TTL(남은 유효시간) 기반으로 자동 만료 처리
// - 에러 발생 시 401 응답 처리
// ===============================
exports.logout = async (req, res, next) => {
  try {
    // 1. Authorization 헤더에서 Bearer 토큰 추출
    const token = req.cookies.access_token;
  
    if (!token) {
      // 토큰이 없으면 401 Unauthorized 응답
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }
    console.log(token);
    // 2. 토큰 디코딩 → 만료 시간 확인
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const now = Math.floor(Date.now() / 1000);        // 현재 시각 (초 단위)
    const ttl = decoded.exp - now;                    // 남은 만료 시간 계산

  
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
  });

    // 4. 성공 응답 반환
    return res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    // JWT 검증 실패 시 (만료, 위조 등) → 401 Unauthorized 응답
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
