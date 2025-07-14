// models/banner.js
const { Model, DataTypes } = require('sequelize');

class Banner extends Model {
  static initiate(sequelize) {
    return super.init({
      banner_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '배너 이미지 파일 경로',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true, // 배너 제목은 선택 사항
        comment: '배너 제목',
      },
      link_url: {
        type: DataTypes.STRING,
        allowNull: true, // 클릭 시 이동할 링크 URL은 선택 사항
        comment: '배너 클릭 시 이동할 URL',
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 기본 정렬 순서 (낮을수록 먼저 노출)
        comment: '배너 노출 순서',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // 기본적으로 활성화 상태
        comment: '배너 활성화 여부',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '배너 생성일',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        // onUpdate는 Sequelize의 Model.init에서는 직접 설정하지 않고
        // Hooks나 Database 트리거를 사용하는게 일반적이야.
        // 여기서는 기존 Product 모델과 동일하게 단순 defaultValue만 유지할게.
        comment: '배너 최종 수정일',
      },
    }, {
      sequelize, // 필수: sequelize 인스턴스 전달
      modelName: 'Banner', // 모델 이름
      tableName: 'banners', // 실제 데이터베이스 테이블 이름
      timestamps: true, // 직접 created_at, updated_at 필드를 쓸 경우 false로
      underscored: true, // `updatedAt` 대신 `updated_at`을 쓰려면 true (여기서는 false로 유지)
    });
  }

  
}

module.exports = Banner;