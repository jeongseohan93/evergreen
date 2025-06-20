// 토큰, 상품정보 등 백엔드에서 가공된 데이터를 클라이언트로 응답하는 범용 컨트롤러

// ===============================
// [ sendToken 컨트롤러 ]
// - JWT 토큰 발급 성공 시 클라이언트(프론트엔드)로 최종 응답 전달
// - 200 OK 상태와 함께 { message, token } 형태로 반환
// ===============================
exports.sendToken = (req, res) => {
  const role = req.role
  console.log(role);
  res.cookie("access_token", req.token, {
    httpOnly: true, //JS에서 접근불가 (XSS 방지)
    secure: process.env.NODE_ENV === "production", //HTTPS 환경에서만 사용
    sameSite: "Lax", //CSRF 방지
    maxAge : 60 * 60 * 1000 // 1시간
  });
  
  res.status(200).json({
    success : true,
    role : role,
    message: '로그인 성공',
  });
};

exports.meToken = (req, res) => {
  res.status(200).json({
    id: 'test-user-id',
    name: '테스트유저',
    role: 'admin' // 또는 'user'
  });
}
