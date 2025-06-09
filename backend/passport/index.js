const passport = require('passport'); // Passport 모듈 불러오기 (Node.js 인증 미들웨어)
const local = require('./localStrategy'); // 로컬 로그인 전략 모듈 불러오기

// passport 전략 등록 함수
// server.js 등 애플리케이션 진입점에서 한 번 호출하여 인증 전략들을 등록함
module.exports = () => {

  local(); // passport.use('local', ...) 내부적으로 실행됨
  
};
