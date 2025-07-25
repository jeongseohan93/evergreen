// backend/controllers/orderController.js

const { Order, OrderItem, sequelize, ShippingAddress } = require('../models'); // Order와 OrderItem 모델 임포트
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // UUID 생성을 위해 uuid 라이브러리 필요 (npm install uuid)

/**
 * @desc 결제 전 대기 상태의 주문 생성 (프론트엔드에서 호출)
 * @route POST /api/order/create-for-payment
 * @access Private (로그인한 사용자만 접근 가능)
 */
exports.createOrderForPayment = async (req, res, next) => {
  console.log('req.body:', req.body);
  // TODO: 실제 서비스에서는 req.user.uuid 등으로 로그인된 사용자 정보를 가져와야 합니다.
  // 현재는 임시로 userUuid를 req.body에서 받습니다.
  const { items, user_uuid, order_address, recipient_name, recipient_phone, additional_requests } = req.body;

  // 1. 필수 데이터 유효성 검사 (간단한 예시)
  if (!items || items.length === 0 || !user_uuid || !order_address || !recipient_name || !recipient_phone) {
    return res.status(400).json({ success: false, message: '필수 주문 정보가 누락되었습니다.' });
  }

  // 2. 총 주문 금액 계산 및 검증
  // ⭐ 중요: 프론트엔드에서 받은 금액을 그대로 사용하지 않고, 백엔드에서 다시 계산/검증해야 합니다. ⭐
  let totalAmount = 0;
  // TODO: 실제 상품 가격은 DB에서 조회하여 위변조를 방지해야 합니다.
  // 현재는 프론트엔드에서 받은 item.price를 사용하지만, 실제로는 DB에서 상품 ID로 가격을 조회해야 합니다.
  items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  // 토스페이먼츠에 보낼 고유한 orderId 생성 (UUID 사용)
  const tossOrderId = uuidv4();
  const orderName = items.length > 1 ? `${items[0].name} 외 ${items.length - 1}건` : items[0].name;

  let transaction; // 트랜잭션 변수 선언

  try {
    transaction = await sequelize.transaction(); // 트랜잭션 시작

    // 3. Order 테이블에 주문 정보 저장 (상태: pending)
    const newOrder = await Order.create({
      toss_order_id: tossOrderId, // 토스페이먼츠용 주문 ID
      user_uuid: user_uuid,
      total_amount: totalAmount,
      order_address: order_address,
      recipient_name: recipient_name,
      recipient_phone: recipient_phone,
      additional_requests: additional_requests,
      status: 'pending', // 초기 상태는 'pending' (결제 대기)
    }, { transaction });

    // 4. OrderItem 테이블에 각 상품 정보 저장
    const orderItemsData = items.map(item => ({
      order_id: newOrder.order_id, // 새로 생성된 주문의 ID 사용
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price, // 이 가격도 실제로는 DB에서 조회하는 것이 안전
      user_uuid: user_uuid, // user_uuid 필드 반드시 포함
    }));
    await OrderItem.bulkCreate(orderItemsData, { transaction });

    await transaction.commit(); // 트랜잭션 커밋 (모든 작업 성공 시)

    // 5. 프론트엔드에 orderId, amount, orderName 반환
    res.status(201).json({
      success: true,
      message: '주문이 성공적으로 생성되었습니다. 결제를 진행해주세요.',
      orderId: tossOrderId, // 프론트엔드에 toss_order_id를 orderId로 반환
      amount: totalAmount,
      orderName: orderName,
    });

  } catch (error) {
    if (transaction) await transaction.rollback(); // 에러 발생 시 트랜잭션 롤백
    console.error("주문 생성 중 오류 발생:", error);
    next(error); // 에러 핸들링 미들웨어로 전달
  }
};

exports.getAddressDefault = async ( req, res ) => {
    const token = req.cookies.access_token;
        
        try {
            if (!token) {
                // 💡 200 대신 401 Unauthorized 반환 (일관성 유지를 위해)
                return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const defaultAddress = await ShippingAddress.findOne({
            where: {
                user_uuid: decoded.user_uuid,
                is_default: true,
            },
        });

        if (defaultAddress) {
            res.json({ success: true, data: defaultAddress });
        } else {
            // 기본 배송지가 없을 경우
            res.status(200).json({ success: true, data: null, message: '기본 배송지가 설정되어 있지 않습니다.' });
        }
          } catch (error) {
        console.error('기본 배송지 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류 발생' });
    }
}

exports.getAllAddressDefault = async ( req, res ) => {
        const token = req.cookies.access_token;
        
        try {
            if (!token) {
                // 💡 200 대신 401 Unauthorized 반환 (일관성 유지를 위해)
                return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const addresses = await ShippingAddress.findAll({
            where: {
                user_uuid: decoded.user_uuid,
            },
            order: [['is_default', 'DESC'], ['createdAt', 'DESC']], // 기본 배송지를 먼저, 최신 순으로 정렬
        });

        res.json({ success: true, data: addresses });

          } catch (error) {
        console.error('사용자 배송지 목록 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류 발생' });
    }
};