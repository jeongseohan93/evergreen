'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Order 테이블에 배송 관련 필드들 추가
    await queryInterface.addColumn('orders', 'tracking_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: '운송장 번호'
    });

    await queryInterface.addColumn('orders', 'delivery_company', {
      type: Sequelize.STRING(30),
      allowNull: true,
      comment: '택배사명'
    });

    await queryInterface.addColumn('orders', 'delivered_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: '배송 완료 시간'
    });

    await queryInterface.addColumn('orders', 'cancelled_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: '배송 취소 시간'
    });

    await queryInterface.addColumn('orders', 'cancel_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: '취소 사유'
    });

    // status ENUM 값 수정 (기존 데이터가 있다면 주의)
    // MySQL에서는 ENUM 수정이 복잡하므로 별도 처리 필요
    try {
      await queryInterface.changeColumn('orders', 'status', {
        type: Sequelize.ENUM('pending', 'paid', 'shipping', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      });
    } catch (error) {
      console.log('Status ENUM 수정 중 오류 (기존 데이터가 있을 수 있음):', error.message);
      // 기존 데이터가 있다면 수동으로 처리 필요
    }
  },

  async down (queryInterface, Sequelize) {
    // 롤백: 추가된 컬럼들 제거
    await queryInterface.removeColumn('orders', 'tracking_number');
    await queryInterface.removeColumn('orders', 'delivery_company');
    await queryInterface.removeColumn('orders', 'delivered_at');
    await queryInterface.removeColumn('orders', 'cancelled_at');
    await queryInterface.removeColumn('orders', 'cancel_reason');

    // status ENUM을 원래대로 되돌리기
    try {
      await queryInterface.changeColumn('orders', 'status', {
        type: Sequelize.ENUM('pending', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      });
    } catch (error) {
      console.log('Status ENUM 롤백 중 오류:', error.message);
    }
  }
};
