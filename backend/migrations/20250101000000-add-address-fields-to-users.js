'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'zipCode', {
      type: Sequelize.STRING(10),
      allowNull: true,
      comment: '우편번호'
    });

    await queryInterface.addColumn('users', 'addressMain', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: '기본주소'
    });

    await queryInterface.addColumn('users', 'addressDetail', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: '상세주소'
    });

    // 기존 address 컬럼이 있다면 제거 (선택사항)
    try {
      await queryInterface.removeColumn('users', 'address');
    } catch (error) {
      console.log('address 컬럼이 존재하지 않거나 이미 제거되었습니다.');
    }
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 새로운 컬럼들 제거
    await queryInterface.removeColumn('users', 'zipCode');
    await queryInterface.removeColumn('users', 'addressMain');
    await queryInterface.removeColumn('users', 'addressDetail');

    // 기존 address 컬럼 복원 (선택사항)
    try {
      await queryInterface.addColumn('users', 'address', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '주소'
      });
    } catch (error) {
      console.log('address 컬럼 복원 중 오류가 발생했습니다.');
    }
  }
}; 