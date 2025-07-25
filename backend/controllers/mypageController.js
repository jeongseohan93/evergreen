// backend/controllers/mypageController.js

const { Order, OrderItem, Product, User } = require('../models'); // 필요한 모델 임포트
const Sequelize = require('sequelize'); // Sequelize 라이브러리를 직접 import
const { Op } = Sequelize; // Op는 Sequelize 객체에서 가져옴

// 로그인된 사용자의 마이페이지 대시보드 요약 정보를 조회
exports.getMypageSummary = async (req, res, next) => {
    // ⭐ 중요: 실제 구현 시 이 userUuid는 인증 미들웨어를 통해 req.user.user_uuid 등으로 받아와야 합니다.
    // 현재는 프론트엔드에서 쿼리 파라미터로 userUuid를 전달하는 임시 방편을 사용합니다.
    const userUuid = req.query.userUuid; 

    if (!userUuid) {
        console.warn("경고: userUuid가 쿼리 파라미터에 없습니다. 프론트엔드에서 userUuid를 보내는지 확인하세요.");
        return res.status(400).json({ success: false, message: '사용자 정보가 필요합니다.' });
    }

    try {
        // 1. 사용자 정보 조회 (user_id -> user_uuid, nickname -> name, created_at -> createdAt으로 수정)
        const user = await User.findOne({
            where: { user_uuid: userUuid },
            // ⭐⭐⭐ 이 부분을 수정했습니다! ⭐⭐⭐
            // 'user_id' -> 'user_uuid'
            // 'nickname' -> 'name' (User 모델에 'nickname' 컬럼이 없음)
            // 'created_at' -> 'createdAt' (User 모델의 `timestamps: true, underscored: false` 설정에 따름)
            attributes: ['user_uuid', 'name', 'email', 'createdAt'] 
        });
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
        }

        // 2. 주문 상태별 개수 집계
        const orderStatusCountsRaw = await Order.findAll({
            where: { user_uuid: userUuid },
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        // 기본 주문 상태 초기화
        const orderStatusCounts = {
            pending: 0,         // 결제 대기
            paid: 0,            // 결제 완료
            shipping: 0,        // 배송 중
            delivered: 0,       // 배송 완료
            cancelled: 0,       // 취소됨
            payment_failed: 0,  // 결제 실패
        };

        // 집계된 데이터로 orderStatusCounts 업데이트
        orderStatusCountsRaw.forEach(item => {
            if (orderStatusCounts.hasOwnProperty(item.status)) {
                orderStatusCounts[item.status] = item.dataValues.count;
            }
        });

        // 3. 최근 주문 목록 조회
        const recentOrders = await Order.findAll({
            where: { user_uuid: userUuid },
            attributes: [
                'order_id', 'total_amount', 'status', 'created_at', // Order 모델의 createdAt은 created_at일 수 있음. 확인 필요.
            ],
            include: [{
                model: OrderItem,
                as: 'OrderItems',
                attributes: ['product_id', 'quantity', 'price'],
                include: [{
                    model: Product,
                    as: 'Product',
                    attributes: ['name', 'small_photo'] 
                }],
                limit: 1 // 각 주문의 대표 상품 하나만 가져오기
            }],
            order: [['created_at', 'DESC']], // 최신 주문부터
            limit: 3 // 최근 3개 주문만
        });

        const summarizedRecentOrders = recentOrders.map(order => {
            const representativeItem = order.OrderItems && order.OrderItems.length > 0 ? order.OrderItems[0] : null;
            const productInfo = representativeItem && representativeItem.Product ? {
                product_name: representativeItem.Product.name,
                product_thumbnail: representativeItem.Product.small_photo,
                total_product_types: order.OrderItems.length 
            } : null;

            return {
                order_id: order.order_id,
                total_amount: order.total_amount,
                status: order.status,
                created_at: order.created_at, // Order 모델의 created_at 컬럼명에 따라 유지 또는 변경
                representative_product: productInfo, // 대표 상품 정보
            };
        });

        res.status(200).json({
            success: true,
            message: '마이페이지 대시보드 정보를 성공적으로 불러왔습니다.',
            data: {
                userSummary: {
                    nickname: user.name, // ⭐ 프론트엔드에서 nickname을 사용한다면 user.name을 nickname으로 보냄
                    email: user.email,
                },
                orderStatusCounts: orderStatusCounts, 
                recentOrders: summarizedRecentOrders,
            }
        });

    } catch (error) {
        console.error('마이페이지 대시보드 조회 오류:', error);
        next(error);
    }
};

// 로그인된 사용자의 모든 주문 목록을 조회 (OrderHistoryPage에서 사용)
exports.getAllOrders = async (req, res, next) => {
    const userUuid = req.query.userUuid;

    if (!userUuid) {
        console.warn("경고: userUuid가 쿼리 파라미터에 없습니다. 프론트엔드에서 userUuid를 보내는지 확인하세요.");
        return res.status(400).json({ success: false, message: '사용자 정보가 필요합니다.' });
    }

    try {
        const orders = await Order.findAll({
            where: { user_uuid: userUuid },
            attributes: [
                'order_id', 'toss_order_id', 'total_amount', 'status', 'created_at', // Order 모델의 created_at 컬럼명에 따라 유지 또는 변경
                'order_address', 'recipient_name', 'recipient_phone', 'additional_requests',
                'tracking_number', 'delivery_company', 'delivered_at', 'cancelled_at', 'cancel_reason',
                'payment_key', 'payment_method', 'payment_approved_at', 'payment_error_code', 'payment_error_message',
            ],
            include: [{
                model: OrderItem,
                as: 'OrderItems',
                attributes: ['product_id', 'quantity', 'price'],
                include: [{
                    model: Product,
                    as: 'Product',
                    attributes: ['name', 'price', 'small_photo'] 
                }]
            }],
            order: [['created_at', 'DESC']], // 주문일 기준 최신순 정렬 (Order 모델의 created_at 컬럼명에 따라 유지 또는 변경)
        });

        const ordersWithRepresentativeProduct = orders.map(order => {
            const representativeItem = order.OrderItems && order.OrderItems.length > 0 ? order.OrderItems[0] : null;
            const productInfo = representativeItem && representativeItem.Product ? {
                product_name: representativeItem.Product.name,
                product_thumbnail: representativeItem.Product.small_photo,
                total_product_types: order.OrderItems.length 
            } : null;

            return {
                ...order.toJSON(), 
                representative_product: productInfo,
            };
        });

        res.status(200).json({ success: true, data: ordersWithRepresentativeProduct });
    } catch (error) {
        console.error('사용자 모든 주문 목록 조회 오류:', error);
        next(error);
    }
};

// 로그인된 사용자의 특정 주문 상세 정보를 조회
exports.getOrderDetail = async (req, res, next) => {
    const { orderId } = req.params;
    const userUuid = req.query.userUuid;

    if (!orderId || isNaN(orderId)) {
        return res.status(400).json({ success: false, message: '유효한 주문 ID가 필요합니다.' });
    }
    if (!userUuid) {
        console.warn("경고: userUuid가 쿼리 파라미터에 없습니다. 프론트엔드에서 userUuid를 보내는지 확인하세요.");
        return res.status(400).json({ success: false, message: '사용자 정보가 필요합니다.' });
    }

    try {
        const order = await Order.findOne({
            where: {
                order_id: orderId,
                user_uuid: userUuid 
            },
            include: [
                {
                    model: OrderItem,
                    as: 'OrderItems',
                    include: [{
                        model: Product,
                        as: 'Product',
                        attributes: ['product_id', 'name', 'price', 'small_photo'] 
                    }]
                },
            ]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: '주문을 찾을 수 없거나 접근 권한이 없습니다.' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('주문 상세 조회 오류:', error);
        next(error);
    }
};