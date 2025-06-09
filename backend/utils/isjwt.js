const jwt = require('jsonwebtoken');

// =============================
// [ isjwt 미들웨어 ]
// - 로그인 성공 후 사용자 정보를 기반으로 JWT 토큰 생성
// - 토큰에는 email, nick, role 등 주요 정보(payload)를 담음
// - process.env.JWT_SECRET을 시크릿 키로 사용하여 서명
// - 만료시간(expiresIn)은 1시간으로 설정
// - 생성된 토큰을 req.token에 저장하여 다음 미들웨어에서 사용 가능하게 함
// =============================
exports.isjwt = ( req, res, next ) => {
    
    const { email, nick, role } = req.authData; // 앞선 미들웨어에서 저장된 사용자 정보 추출
    
    // JWT의 payload(내용)로 이메일, 닉네임, 역할을 포함
    const payload = {email, nick, role};

    // JWT 토큰 생성 (시크릿 키 및 만료 시간 포함)
    const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // 시크릿 키 (.env 파일에서 관리)
    { expiresIn: '1h'} // 토큰 유효기간: 1시간
    );
    
    req.token = token; // 생성한 토큰을 req 객체에 저장
    next(); // 다음 미들웨어로 흐름 이동
}