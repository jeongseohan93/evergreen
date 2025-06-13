const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

// 현재 실행 환경 (production, development 등) 결정 및 config 파일 로드
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {}; // DB와 모델 객체들을 저장할 컨테이너 역할
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

// Sequelize 인스턴스를 db 객체에 저장 (외부에서 import해 쓸 수 있게)
db.sequelize = sequelize;

const basename = path.basename(__filename);

// ===============================
// [모델 자동 로딩 및 등록]
// - 현재 디렉토리(.js) 파일 중 index.js 제외하고 모두 require
// - 각 모델 파일에서 .initiate(sequelize) 실행해 모델 정의
// - 모델 이름 기준으로 db 객체에 등록 (ex: db.User, db.Post 등)
// ===============================
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.') !== 0         // 숨김 파일(x)
            && file !== basename              // 자기 자신(index.js)(x)
            && file.slice(-3) === '.js';      // .js 파일만(o)
    })
    .forEach(file => {
        const modelModule = require(path.join(__dirname, file)); // 모델 모듈 import

        // 각 모델의 initiate 메서드 호출 (sequelize 인스턴스 주입)
        // 모델 객체 반환 (ex: User, Post 등)
        const model = modelModule.initiate(sequelize);

        // 모델의 name(Sequelize에서 자동 지정됨)을 키로 db 객체에 등록
        db[model.name] = model;
    });

// ===============================
// [모델 관계(associations) 설정]
// - 모델에 associate 메서드가 정의되어 있으면, 전체 db 객체를 인자로 호출
// - 예: User.associate(db) → 관계 연결
// ===============================
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//디버깅용
//기존에 존재하는 테이블을 모두 삭제(DROP) 한 후,
//모델 정의대로 새롭게 테이블을 생성(CREATE) 합니다.
/* sequelize.sync({ force: true }) 
 .then(() => console.log('모든 테이블 재생성 완료'))
.catch(console.error); */

// db 객체 내보내기 (모든 모델 및 sequelize 인스턴스 포함)
// - db.User, db.Post, db.sequelize 등으로 접근 가능
module.exports = db;
