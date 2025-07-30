const { Model, DataTypes } = require('sequelize');

class Cart extends Model {
  static initiate(sequelize) {
    return super.init({
      // 각 장바구니 항목의 고유 ID
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 어떤 유저의 장바구니 항목인지 식별 (외래키 설정 없음)
      user_uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      
      // 어떤 상품인지 식별 (외래키 설정 없음)
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 수량
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      /*
       * [주먹구구식 핵심]
       * 상품 정보를 Product 테이블에서 매번 조회(JOIN)하지 않고,
       * 장바구니에 담을 당시의 상품 정보를 여기에 복사해서 저장합니다.
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
      modelName: 'Cart',
      tableName: 'carts',
      timestamps: true, // 항목 추가/수정 시간 기록
    });
  }

  // 외래키 관계를 설정하지 않으므로 associate 메서드는 비워둡니다.
  static associate(db) {}
}

module.exports = Cart;