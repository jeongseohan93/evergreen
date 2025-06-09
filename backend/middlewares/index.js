const jwt = require('jsonwebtoken');
const { getToken } = require('../utils/redis');

// ===============================
// [ isLoggedIn 미들웨어 ]
// - 요청 헤더에서 JWT 토큰을 추출하고 검증
// - 블랙리스트 확인 후, 유효하면 사용자 정보(req.user)에 저장
// - 유효하지 않으면 401 Unauthorized 응답
// ===============================
exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1. Authorization 헤더에서 Bearer 토큰 추출
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    // 2. Redis 블랙리스트에 등록된 토큰인지 확인
    const blacklisted = await getToken(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(401).json({ message: '로그아웃된 토큰입니다.' });
    }

    // 3. JWT 토큰 검증 및 디코딩 (유효성, 서명, 만료 등 체크)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. 검증 성공 시 사용자 정보를 요청 객체에 저장
    req.user = decoded;

    // 5. 다음 미들웨어 또는 라우터로 요청 전달
    next();
  } catch (err) {
    // 6. 토큰이 만료되었거나 위조된 경우 401 응답
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};


// ===============================
// [ isNotLoggedIn 미들웨어 ]
// - 로그인하지 않은 사용자만 통과 가능 (ex. 로그인/회원가입 페이지 차단)
// - 이미 로그인한 상태(유효한 토큰이 있으면) 403 에러 응답
// - 토큰 없거나 유효하지 않으면 "비로그인 상태"로 간주하고 통과
// ===============================
exports.isNotLoggedIn = (req, res, next) => {
  // Authorization 헤더에서 Bearer 토큰 추출
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    // 토큰이 없으면 로그인하지 않은 상태 → 통과(next)
    return next();
  }

  try {
    // 토큰이 유효하면 이미 로그인 상태이므로 403 Forbidden 응답
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(403).json({ message: '이미 로그인한 상태입니다.' });
  } catch {
    // 토큰이 만료되었거나 변조되었으면 "비로그인 상태"로 간주하고 통과
    return next();
  }
};


exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
}
