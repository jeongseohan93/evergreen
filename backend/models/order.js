const { Model, DataTypes } = require('sequelize');

class Order extends Model {
  static initiate(sequelize) {
    return super.init({
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, //추가 될 때 마다 1씩 증가
      },
      user_uuid: {
        type: DataTypes.CHAR(36), // UUID 대신 명시적으로 CHAR(36)
        allowNull: false,
        // 이걸 추가해야 BINARY 불일치 문제 방지
        collate: 'utf8_general_ci', // 또는 DB와 맞는 collation으로 통일
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
           order_address: {
        type: DataTypes.STRING(500), 
        allowNull: false, // 주문시 주소 필수
      },
      status: {
        //.ENUM:이넘(열거형) => 대기 / 완료 / 취소
        //type: DataTypes.STRING(20), <= ENUM제약없이 상태값 넣고 싶을때는 이렇게 하면 됨.대신 검증은 코드로 해야 함. 
        type: DataTypes.ENUM('shipping', 'paid', 'delivered', 'cancelled', 'pending'), // 필요 시 수정
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },// --- 추가해야 할 컬럼들 ---
      tracking_number: {
        type: DataTypes.STRING(255), // 운송장 번호는 보통 문자열
        allowNull: true, // 운송장 번호가 없을 수도 있으니 허용
      },
      delivery_company: {
        type: DataTypes.STRING(100), // 택배사 이름
        allowNull: true,
      },
      delivered_at: {
        type: DataTypes.DATE, // 배송 완료 시간
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE, // 취소한 시간
        allowNull: true,
      }, 
      cancel_reason: {
        type: DataTypes.TEXT, // 취소 사유
        allowNull: true,
      },
      // --- (isDelayed, daysSinceOrder, delayDays는 DB 컬럼이 아니므로 여기에 추가하지 않음) ---
    }, {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: false, // created_at 직접 관리하므로 false
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    //user 관계
    db.Order.belongsTo(db.User, {
      foreignKey: 'user_uuid',
      targetKey: 'user_uuid', //자식테이블 쪽, 관계를 맺으려는 대상 모델의 컬럼
      onDelete: 'CASCADE',
    });

    //otherItem 관계
    db.Order.hasMany(db.OrderItem, {
        foreignKey: 'order_id',
        targetKey: 'order_id',  
        onDelete: 'CASCADE',
    });
  }
}

module.exports = Order;
