// controllers/admin/dashboardController.js

const Product = require('../../models/product'); // Product 모델 임포트
const Order = require('../../models/order');     // Order 모델 임포트
    
const { Op } = require('sequelize');             // Sequelize Op 연산자 임포트

exports.getDashboardSummary = async (req, res) => {
    try {
        // 오늘 날짜의 시작과 끝을 계산 (UTC 기준 또는 서버 시간대 기준)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 (자정)

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // 내일 날짜의 시작 (오늘의 끝)

        // 1. 총 상품 수 계산
        const totalProducts = await Product.count();

        // 2. 오늘의 주문 수 계산
        const todayOrders = await Order.count({
            where: {
                created_at: { // Order 모델은 created_at 사용
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        // 3. 오늘의 매출 계산
        const todaySales = await Order.sum('total_amount', {
            where: {
                created_at: { // Order 모델은 created_at 사용
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                },
            }
        });


        res.status(200).json({
            success: true,
            data: {
                totalProducts: totalProducts,
                todayOrders: todayOrders,
                todaySales: todaySales || 0,
                // 신규 회원 데이터는 더 이상 반환하지 않습니다.
                // newMembers: newMembers, 
            },
            message: '대시보드 통계 데이터를 성공적으로 불러왔습니다.'
        });

    } catch (error) {
        console.error('대시보드 통계 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '대시보드 통계 데이터를 불러오는 도중 오류가 발생했습니다.'
        });
    }
};
