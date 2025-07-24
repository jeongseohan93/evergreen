const Sequelize = require('sequelize');

// ===============================
// [ User 모델 정의 (Sequelize) ]
// - users 테이블과 매핑되는 ORM 클래스
// - UUID 기반 기본키, 이메일 유니크 등 다양한 속성 포함
// - 소프트 삭제(paranoid) 및 createdAt/updatedAt 관리
// ===============================
class User extends Sequelize.Model {
    // 모델(테이블) 구조 정의 및 초기화 메서드
    static initiate(sequelize) {
        return super.init(
            {
                // UUID 기본키 (user_uuid, 자동생성, PK)
                user_uuid: {
                    type: Sequelize.CHAR(36),
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: Sequelize.UUIDV4,  // UUID 자동생성
                    collate: 'utf8_general_ci',
                },

                // 이메일 (유니크 인덱스, 100자 제한)
                email: {
                    type: Sequelize.STRING(100),
                    allowNull: true, // 이메일이 필수인 경우 allowNull: false로 변경해야 합니다.
                    unique: true // 이메일 필드에 직접 unique 제약조건 추가 (index와 중복되지만 명시적)
                },

                // 비밀번호 (필수, 255자)
                password: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },

                // 이름 (20자)
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: true
                },

                // 전화번호 (20자)
                phone: {
                    type: Sequelize.STRING(20),
                    allowNull: true
                },

                // ⭐⭐ 주소 필드 세분화: 기존 'address' 삭제 및 다음 3개 필드 추가 ⭐⭐
                zipCode: { // 우편번호
                    type: Sequelize.STRING(10), // 일반적으로 5~7자리이므로 넉넉하게 설정
                    allowNull: true // 필수 여부에 따라 변경
                },
                addressMain: { // 기본 주소 (도로명, 지번 등)
                    type: Sequelize.STRING(255),
                    allowNull: true // 필수 여부에 따라 변경
                },
                addressDetail: { // 상세 주소 (동, 호수 등)
                    type: Sequelize.STRING(255),
                    allowNull: true // 필수 여부에 따라 변경
                },

                // 역할(권한): 'admin' 또는 'user', 기본값 'user'
                role: {
                    type: Sequelize.ENUM('admin', 'user'),
                    allowNull: false,
                    defaultValue: "user"
                }
            },
            {
                sequelize,             // DB 연결 인스턴스
                timestamps: true,      // createdAt, updatedAt 자동생성
                underscored: false,    // 필드명 카멜케이스(예: createdAt) - 새로운 주소 필드에 적용
                modelName: 'User',     // Sequelize 내부 모델명
                tableName: 'users',    // 실제 DB 테이블명
                paranoid: true,        // deletedAt 소프트 삭제 컬럼 자동 추가
                charset: 'utf8',       // 문자셋
                collate: 'utf8_general_ci', // 정렬 기준

                // 인덱스 정의 (유니크/검색 최적화)
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "user_uuid" }]
                    },
                    {
                        // email 필드에 unique: true를 직접 설정해도 되지만,
                        // 인덱스를 통해 명시적으로 유니크 제약조건을 걸 수 있습니다.
                        name: "email",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "email" }]
                    }
                ]
            });
        }
    
        static associate(db) {
            // Order 관계
            db.User.hasMany(db.Order, {
                foreignKey: 'user_uuid',
                sourceKey: 'user_uuid', // User 모델의 PK
                onDelete: 'CASCADE',
            });

            // OrderItem 관계
            // targetKey는 belongsTo 관계에서 대상 모델의 PK를 지정할 때 주로 사용됩니다.
            // hasMany 관계에서는 foreignKey와 sourceKey로 충분합니다.
            db.User.hasMany(db.OrderItem, {
                foreignKey: 'user_uuid', // OrderItem 테이블의 외래키
                sourceKey: 'user_uuid',  // User 모델의 UUID PK (연결될 키)
                onDelete: 'CASCADE',
            });

            // Board 관계
            // Board 테이블의 외래키명이 'user_id'가 아닌 'user_uuid'로 통일되면 더 좋습니다.
            // (DB 스키마 수정이 가능하다면 그렇게 하는 것을 권장합니다.)
            db.User.hasMany(db.Board, {
                foreignKey: 'user_id',      // Board 테이블의 외래키
                sourceKey: 'user_uuid',     // User 테이블의 UUID PK
                onDelete: 'CASCADE',
            });
        }
    }

module.exports = User;