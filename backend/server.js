const dotenv = require('dotenv'); // 환경변수 로딩을 위한 dotenv 라이브러리
const express = require('express'); // Express 웹 프레임워크 불러오기 (서버 및 라우팅에 사용)
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing) 설정을 위한 미들웨어
const { sequelize } = require('./models'); // Sequelize ORM 인스턴스 불러오기 (DB 연동용)
const passport = require('passport'); // 로그인 상태 유지, 사용자 인증을 도와주는 미들웨어 (세션/토큰 인증 등)
const morgan = require('morgan'); // HTTP 요청 로그를 콘솔에 출력해주는 미들웨어 (개발 중 요청 추적용)
const cookieParser = require('cookie-parser'); // HTTP 요청의 쿠키를 파싱(분석)하여 `req.cookies` 객체에 넣어주는 미들웨어 임포트
const auth = require('./routes/auth'); // 사용자 인증 관련 라우터 (로그인, 회원가입 등)
const admin = require('./routes/admin'); // 관리자 인증 관련 라우터
const reportRouter = require('./routes/admin/report');
const passportConfig = require('./passport'); // Passport 설정 파일 불러오기 (전략 등록, 시리얼라이즈/디시리얼라이즈 등 설정 포함)
const { notFound, errorHandler } = require('./middlewares/error'); // 404/500 에러 처리 미들웨어
const path = require('path');

// ======================
// [ Express 앱 기본 설정 ]
// - dotenv 환경 변수 가장 먼저 로드 
// - 포트 설정
// - 인증 전략 초기화
// ======================
dotenv.config(); // .env 파일에 작성된 환경 변수들을 process.env에 로드함 (애플리케이션 시작 시 가장 먼저 실행되어야 함)
const app = express(); // express 애플리케이션 인스턴스를 app에 담음
app.set('port', process.env.PORT || 3005);// .env 파일에 PORT 값이 있으면 그 값을 사용하고, 없으면 기본값 3005 사용
passportConfig(); // Passport 설정 함수 실행 (미들웨어 적용 전에 인증 전략을 미리 세팅함)
 


// ======================
// [ 데이터베이스 연결 및 모델 동기화 ]
// - Sequelize를 통해 DB 연결 시도
// - 모델 정의에 따라 테이블 생성 또는 동기화 수행
// ======================

// force: true → 테이블 전체 삭제 후 재생성 (초기 개발/테스트 때만 사용)
// alter: true → 기존 테이블과 모델의 차이만 자동 반영 (실운영에서는 권장X, 데이터 유실 가능성 있음)
sequelize.sync() // 모델 정의와 실제 DB 테이블을 동기화 (필요시 테이블 생성)
// .sync({ force: true })  // 개발 중 테이블 구조 바꿀 때만! 주석 풀면 기존 데이터 전부 삭제
// .sync({ alter: true })   // 컬럼 구조 자동 반영(권장X), 운영환경에서는 직접 마이그레이션 사용
    .then(() => {
        console.log('DB 연결 성공');
    })
    .catch((err) => {
        console.error('DB 연결 실패:', err);
    });


// ======================
// [ 공통 미들웨어 설정 ]
// - HTTP 요청 로그 출력
// - JSON 요청 바디 파싱
// - CORS 설정 (프론트엔드 연결 허용)
// - Passport 인증 시스템 초기화
// ======================    
app.use(morgan('dev')); // http 요청 로그를 콘솔에 출력해주는 미들웨어 (개발 중 요청/응답 정보 확인용), 'dev' 모드는 간단하게 로그로 출력
app.use(express.json()); // 클라이언트에서 보내는 JSON 형식의 요청(body)을 파싱하여 req.body로 사용할 수 있게 함
app.use(cookieParser()); // Express 앱에 cookie-parser 미들웨어를 적용합니다. 이로써 모든 요청에서 자동으로 쿠키를 파싱할 수 있게 됩니다.


// JWT 토큰만 사용하는 경우 credentials: false
// 쿠키(세션) 기반 인증을 쓰면 credentials: true, 그리고 origin은 반드시 정확히 매칭해야 함
app.use(cors({
  origin: 'http://localhost:3000',  // 허용할 프론트엔드 주소 (React 개발 서버 도메인)
  methods: ['GET','POST','PUT','DELETE','OPTIONS'], // 허용할 HTTP 메서드 목록
  allowedHeaders: ['Content-Type','Authorization'], // 클라이언트에서 사용할 수 있는 요청 헤더
  credentials: true // 인증 정보(쿠키, 헤더 등) 포함 여부 - false일 경우 쿠키 전송 안 됨
}));
app.use(passport.initialize()); // passport 인증 시스템 초기화


// ======================
// [ 라우터 등록 ]
// - 각 기능별 요청 경로에 라우터 연결
// ======================
app.use('/auth', auth); // auth → 인증 관련 라우터
app.use('/admin', admin); //admin -> 관리자 인증 관련 라우터
app.use('/adminReport', reportRouter);
//정적 파일 서빙: 이미지 미리보기를 위해 작성
app.use('/adminImages', express.static(path.join(__dirname, 'public/adminImages')));

// ==============================
// [에러 처리 미들웨어 등록]
// - 404: 존재하지 않는 API 요청 처리
// - 500: 서버 내부 에러를 JSON으로 응답
// ==============================
app.use(notFound);        // 존재하지 않는 API 404 처리
app.use(errorHandler);    // 서버 내부 에러 JSON 응답


// ======================
// [ 서버 실행 ]
// - 지정된 포트에서 Express 서버를 시작하고 요청 대기
// - app.set('port')에서 설정한 포트를 기준으로 실행됨
// ======================
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '빈 포트에서 대기 중');
});
