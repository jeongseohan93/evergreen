const { Model, DataTypes } = require('sequelize');

class ShippingAddress extends Model {
  static initiate(sequelize) {
    return super.init({
      // 배송지 항목의 고유 ID (기본 키)
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 어떤 유저의 배송지인지 식별
      // 외래키 설정은 Sequelize 모델에서 명시적으로 하지 않습니다. (추후 수동 설정)
      user_uuid: {
        type: DataTypes.CHAR(36), // UUID는 보통 CHAR(36)으로 표현됩니다.
        allowNull: false,
      },
      
      // 배송지명 (예: '집', '회사', '친구 집')
      address_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      // 수령인 이름
      recipient_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      // 수령인 연락처 (전화번호)
      recipient_phone: {
        type: DataTypes.STRING(20), // 전화번호 형식에 따라 길이 조정 가능
        allowNull: false,
      },

      // 우편번호
      zip_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      // 주소 (도로명 주소 등)
      address_main: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      // 상세 주소 (동/호수 등)
      address_detail: {
        type: DataTypes.STRING(255),
        allowNull: true, // 상세 주소는 없을 수도 있음
      },

      // 기본 배송지 여부
      // 한 사용자당 하나의 기본 배송지만 가질 수 있도록 로직 필요
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

    }, {
      sequelize,
      modelName: 'ShippingAddress', // 모델 이름
      tableName: 'shipping_addresses', // 실제 데이터베이스 테이블 이름 (복수형, 스네이크 케이스)
      timestamps: true, // createdAt, updatedAt 자동 생성
      underscored: true, // created_at, updated_at 필드명 사용
    });
  }

  // 외래키 설정을 나중에 수동으로 할 예정이므로 associate 메서드는 비워둡니다.
  static associate(db) {} 
}

module.exports = ShippingAddress;