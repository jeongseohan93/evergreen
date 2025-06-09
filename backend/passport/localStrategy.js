const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

// ===============================
// [ Passport Local 전략 등록 함수 ]
// - 이메일(email)과 비밀번호(password)로 로그인 인증
// - bcrypt로 비밀번호 해시 비교
// - 성공 시 user 객체 반환, 실패 시 에러 메시지 반환
// - app.js 등에서 passportConfig() 형태로 호출해서 전략을 활성화
// ===============================
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',     // req.body.email 필드를 사용자명으로 사용
        passwordField: 'password',  // req.body.password 필드를 비밀번호로 사용
        passReqToCallback: false,   // req 객체를 콜백에 넘길지 여부(false면 email, password만 전달)
      },
      // 인증 콜백 함수 (async)
      async (email, password, done) => {
        try {
          // 이메일로 사용자 조회 (필요한 필드만 select)
          const exUser = await User.findOne({
            where: { email },
            attributes: ['email', 'name', 'role', 'password'],
          });

          if (exUser) {
            // 입력 비밀번호와 해시된 비밀번호 비교
            const result = await bcrypt.compare(password, exUser.password);

            if (result) {
              // 비밀번호 일치 → 인증 성공 (user 반환)
              done(null, exUser);
            } else {
              // 비밀번호 불일치 → 인증 실패 (메시지 전달)
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            // 해당 이메일로 가입된 유저 없음 → 인증 실패 (메시지 전달)
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          // 인증 과정 중 서버 에러
          console.error(error);
          done(error);
        }
      }
    )
  );
};
