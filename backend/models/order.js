// backend/models/order.js

const { Model, DataTypes } = require('sequelize');

class Order extends Model {
  static initiate(sequelize) {
    return super.init({
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // 내부 DB에서 사용하는 auto-increment ID
      },
      // ⭐ 추가: 토스페이먼츠에 전달할 고유 주문 ID (UUID) ⭐
      // 이 필드에 UUID를 생성하여 저장하고, 이 값을 토스페이먼츠의 orderId로 사용합니다.
      toss_order_id: {
        type: DataTypes.CHAR(36), // UUID (e.g., 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
        allowNull: true, // 결제 시도 전에는 null일 수 있음
        unique: true, // 토스페이먼츠 orderId는 고유해야 함
        collate: 'utf8_general_ci',
      },
      user_uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        collate: 'utf8_general_ci',
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_address: {
        type: DataTypes.STRING(500),
        allowNull: false, // 주문시 주소 필수
      },
      // ⭐ 추가: 수령인 이름 및 연락처 필드 ⭐
      recipient_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      // ⭐ 추가: 추가 요청 사항 필드 ⭐
      additional_requests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        //.ENUM:이넘(열거형) => 대기 / 완료 / 취소
        // type: DataTypes.STRING(20), <= ENUM제약없이 상태값 넣고 싶을때는 이렇게 하면 됨.대신 검증은 코드로 해야 함. 
        type: DataTypes.ENUM('shipping', 'paid', 'delivered', 'cancelled', 'pending', 'payment_failed'), // ⭐ 'payment_failed' 상태 추가 제안 ⭐
        allowNull: false,
        defaultValue: 'pending', // 초기 주문 상태는 'pending'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
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
      // ⭐ 추가: 결제 관련 정보 ⭐
      payment_key: {
        type: DataTypes.STRING(255), // 토스페이먼츠에서 반환하는 paymentKey
        allowNull: true, // 결제 성공 시에만 저장
      },
      payment_method: {
        type: DataTypes.STRING(50), // 결제 수단 (예: '카드', '가상계좌', '휴대폰')
        allowNull: true, // 결제 성공 시에만 저장
      },
      payment_approved_at: {
        type: DataTypes.DATE, // 토스페이먼츠에서 결제 승인된 시간
        allowNull: true, // 결제 성공 시에만 저장
      },
      payment_error_code: {
        type: DataTypes.STRING(100), // 결제 실패 시 토스페이먼츠 에러 코드
        allowNull: true,
      },
      payment_error_message: {
        type: DataTypes.STRING(500), // 결제 실패 시 토스페이먼츠 에러 메시지
        allowNull: true,
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
