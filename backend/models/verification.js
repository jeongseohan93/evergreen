// models/verification.js

const Sequelize = require('sequelize');

class Verification extends Sequelize.Model {
    static initiate(sequelize) {
        Verification.init({
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '인증번호를 받은 이메일 주소',
            },
            code: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: '발송된 6자리 인증번호',
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: '인증번호 만료 시간',
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Verification',
            tableName: 'verifications',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });

        // ✅ 초기화된 모델 클래스를 반환하는 코드를 추가합니다.
        return Verification;
    }

    static associate(db) {
        // 관계 설정
    }
}

module.exports = Verification;