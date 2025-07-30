const jwt = require('jsonwebtoken');

// =============================
// [ isjwt 미들웨어 ]
// - 로그인 성공 후 사용자 정보를 기반으로 JWT 토큰 생성
// - 토큰에는 email, nick, role 등 주요 정보(payload)를 담음
// - process.env.JWT_SECRET을 시크릿 키로 사용하여 서명
// - 만료시간(expiresIn)은 1시간으로 설정
// - 생성된 토큰을 req.token에 저장하여 다음 미들웨어에서 사용 가능하게 함
// =============================
exports.isjwt = (req, res, next) => {
  // ✅ 이전 미들웨어에서 req.user로 넘겨준 정보를 사용합니다.
  const { user_uuid, email, nick, role } = req.user;
  
  const payload = { user_uuid, email, nick, role };

  req.token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  req.role = role;
  req.user_uuid = user_uuid;
  
  next();
};