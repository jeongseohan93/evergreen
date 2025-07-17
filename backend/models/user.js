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
                    allowNull: true
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

                // 주소 (255자)
                address: {
                    type: Sequelize.STRING(255),
                    allowNull: true
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
                underscored: false,    // 필드명 카멜케이스(예: createdAt)
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
                        name: "email",
                        unique: true,
                        using: "BTREE",
                        fields: [{ name: "email" }]
                    }
                ]
            });
        }
    
        static associate(db) {
            //order 관계
            db.User.hasMany(db.Order, {
                foreignKey: 'user_uuid',
                sourceKey: 'user_uuid', //부모테이블 쪽, 관계를 설정하는 출발 모델의 컬럼
                onDelete: 'CASCADE',
            });

            //orderItem 관계
            db.User.hasMany(db.OrderItem, {
                foreignKey: 'user_uuid',
                targetKey: 'user_uuid', // User 모델의 UUID PK
                onDelete: 'CASCADE',
            });

            db.User.hasMany(db.Board, {
                foreignKey: 'user_id',      // Board 테이블의 user_id
                sourceKey: 'user_uuid',     // User 테이블의 user_uuid
                onDelete: 'CASCADE',
            });
        }  // board 관계 추가
          
    }

module.exports = User;
