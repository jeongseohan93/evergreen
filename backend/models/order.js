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
      status: {
        //.ENUM:이넘(열거형) => 대기 / 완료 / 취소
        //type: DataTypes.STRING(20), <= ENUM제약없이 상태값 넣고 싶을때는 이렇게 하면 됨.대신 검증은 코드로 해야 함. 
        type: DataTypes.ENUM('pending', 'paid', 'cancelled'), // 필요 시 수정
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
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
