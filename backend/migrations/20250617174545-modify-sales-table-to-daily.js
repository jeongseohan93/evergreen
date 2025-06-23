'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 기존 테이블 삭제 (데이터가 있다면 백업 필요)
    await queryInterface.dropTable('sales');
    
    // 새로운 구조로 테이블 생성
    await queryInterface.createTable('sales', {
      sale_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sale_date: {
        type: Sequelize.CHAR(10), // YYYY-MM-DD 형식
        allowNull: false,
      },
      online_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      offline_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cancel_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      memo: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });

    // sale_date의 unique 제약조건 제거
    try {
      await queryInterface.removeConstraint('sales', 'sales_sale_date_key');
    } catch (error) {
      console.log('sales_sale_date_key 제거 실패, 다른 이름 시도:', error.message);
      try {
        await queryInterface.removeConstraint('sales', 'sales_sale_date_unique');
      } catch (error2) {
        console.log('sales_sale_date_unique 제거 실패, 인덱스 제거 시도:', error2.message);
        try {
          await queryInterface.removeIndex('sales', 'sales_sale_date');
        } catch (error3) {
          console.log('모든 시도 실패, 수동으로 처리 필요:', error3.message);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 기존 구조로 복원
    await queryInterface.dropTable('sales');
    
    await queryInterface.createTable('sales', {
      sale_date: {
        type: Sequelize.CHAR(7), // YYYY-MM 형식
        allowNull: false,
        primaryKey: true,
      },
      online_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      offline_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cancel_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      memo: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });

    // 롤백: sale_date에 unique 제약조건 다시 추가
    try {
      await queryInterface.addConstraint('sales', {
        fields: ['sale_date'],
        type: 'unique',
        name: 'sales_sale_date_unique'
      });
    } catch (error) {
      console.log('unique 제약조건 추가 실패:', error.message);
    }
  }
};
