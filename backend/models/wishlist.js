const { Model, DataTypes } = require('sequelize');

class Wishlist extends Model {
  static initiate(sequelize) {
    return super.init({
      // 각 관심 상품 항목의 고유 ID (장바구니의 cart_id와 유사)
      wishlist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 어떤 유저의 관심 상품 항목인지 식별 (외래키 설정 없음)
      user_uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      
      // 어떤 상품인지 식별 (외래키 설정 없음)
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      /*
       * [주먹구구식 핵심]
       * 상품 정보를 Product 테이블에서 매번 조회(JOIN)하지 않고,
       * 관심 상품에 담을 당시의 상품 정보를 여기에 복사해서 저장합니다.
       * (장바구니 모델과 동일한 전략)
       */
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      small_photo: {
        type: DataTypes.STRING(255),
      },

    }, {
      sequelize,
      modelName: 'Wishlist', // 모델 이름: Wishlist
      tableName: 'wishlists', // 실제 데이터베이스 테이블 이름: wishlists (복수형)
      timestamps: true, // 항목 추가/수정 시간 기록 (createdAt, updatedAt)
      // paranoid: true, // 필요하다면 소프트 삭제(deletedAt)를 위해 추가할 수 있습니다.
      underscored: true, // createdAt, updatedAt을 created_at, updated_at으로 변경 (선택 사항)
    });
  }

  // user_uuid와 product_id에 대한 외래키 관계를 Sequelize 모델 상에서는 명시적으로 설정하지 않았습니다.
  // 이 부분은 데이터베이스 스키마 레벨에서 설정하거나, 애플리케이션 로직에서 처리할 수 있습니다.
  static associate(db) {
    // 만약 User 모델과 Product 모델이 있다면 다음과 같이 관계를 설정할 수도 있습니다 (선택 사항):
    // db.Wishlist.belongsTo(db.User, { foreignKey: 'user_uuid', targetKey: 'uuid', constraints: false });
    // db.Wishlist.belongsTo(db.Product, { foreignKey: 'product_id', targetKey: 'id', constraints: false });
    // 여기서 constraints: false는 외래키 제약 조건을 데이터베이스에 추가하지 않겠다는 의미로,
    // 현재 모델의 "주먹구구식 핵심" (상품 정보 복사) 전략과 일맥상통합니다.
  }
}

module.exports = Wishlist;