// 배송 현황, 배송 완료 여부, 배송 취소
const Order = require('../../models/order');
const OrderItem = require('../../models/orderItem');
const User = require('../../models/user');
const Product = require('../../models/product');
// const axios = require('axios'); // 삭제

// 모든 주문의 배송 현황 조회
exports.getAllDeliveries = async (req, res) => {
    try {
        // 먼저 기본 orders 데이터만 가져오기
        const orders = await Order.findAll({
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                attributes: ['name', 'phone', 'email'],
            }],
        });

        console.log('Found orders:', orders.length); // 디버깅용

        // User가 존재하는 주문만 필터링
        const filteredOrders = orders.filter(order => order.User);

        // 지연 배송 판단 로직 추가
        const ordersWithDelayInfo = filteredOrders.map(order => {
            const orderDate = new Date(order.created_at);
            const today = new Date();
            const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
            
            // 3일 이상 지난 주문이 아직 배송중이거나 미완료인 경우 지연으로 판단
            const isDelayed = daysDiff >= 3 && ['pending', 'paid', 'shipping'].includes(order.status);
            
            return {
                ...order.toJSON(),
                daysSinceOrder: daysDiff,
                isDelayed: isDelayed,
                delayDays: isDelayed ? daysDiff - 2 : 0 // 지연 일수 (3일 이상부터)
            };
        });

        res.status(200).json({
            success: true,
            data: ordersWithDelayInfo
        });
    } catch (error) {
        console.error('배송 현황 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '배송 현황을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

// 특정 주문의 배송 상태 업데이트
exports.updateDeliveryStatus = async (req, res) => {
    const { order_id, status, tracking_number, delivery_company } = req.body;

    if (!order_id || !status) {
        return res.status(400).json({
            success: false,
            message: '주문 ID와 배송 상태는 필수입니다.'
        });
    }

    try {
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '해당 주문을 찾을 수 없습니다.'
            });
        }

        // 배송 상태 업데이트
        order.status = status;
        
        // 운송장 번호와 택배사 정보 추가 (필요시)
        if (tracking_number) {
            order.tracking_number = tracking_number;
        }
        if (delivery_company) {
            order.delivery_company = delivery_company;
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: '배송 상태가 업데이트되었습니다.',
            data: {
                order_id: order.order_id,
                status: order.status,
                tracking_number: order.tracking_number,
                delivery_company: order.delivery_company
            }
        });
    } catch (error) {
        console.error('배송 상태 업데이트 오류:', error);
        res.status(500).json({
            success: false,
            message: '배송 상태 업데이트 중 오류가 발생했습니다.'
        });
    }
};

// 배송 완료 처리
exports.completeDelivery = async (req, res) => {
    const { order_id } = req.body;

    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: '주문 ID는 필수입니다.'
        });
    }

    try {
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '해당 주문을 찾을 수 없습니다.'
            });
        }

        order.status = 'delivered';
        order.delivered_at = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            message: '배송이 완료 처리되었습니다.',
            data: {
                order_id: order.order_id,
                status: order.status,
                delivered_at: order.delivered_at
            }
        });
    } catch (error) {
        console.error('배송 완료 처리 오류:', error);
        res.status(500).json({
            success: false,
            message: '배송 완료 처리 중 오류가 발생했습니다.'
        });
    }
};

// 배송 취소 처리
exports.cancelDelivery = async (req, res) => {
    const { order_id, reason } = req.body;

    if (!order_id) {
        return res.status(400).json({
            success: false,
            message: '주문 ID는 필수입니다.'
        });
    }

    try {
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '해당 주문을 찾을 수 없습니다.'
            });
        }

        order.status = 'cancelled';
        order.cancelled_at = new Date();
        order.cancel_reason = reason || '관리자에 의한 취소';
        await order.save();

        res.status(200).json({
            success: true,
            message: '배송이 취소되었습니다.',
            data: {
                order_id: order.order_id,
                status: order.status,
                cancelled_at: order.cancelled_at,
                cancel_reason: order.cancel_reason
            }
        });
    } catch (error) {
        console.error('배송 취소 처리 오류:', error);
        res.status(500).json({
            success: false,
            message: '배송 취소 처리 중 오류가 발생했습니다.'
        });
    }
};

// 주문(배송) 정보 전체 수정
exports.updateDeliveryInfo = async (req, res) => {
    const { id } = req.params;
    const { total_amount, tracking_number, delivery_company, status } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: '주문 ID는 필수입니다.'
        });
    }

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: '해당 주문을 찾을 수 없습니다.'
            });
        }

        // 값이 있으면 수정
        if (total_amount !== undefined) order.total_amount = total_amount;
        if (tracking_number !== undefined) order.tracking_number = tracking_number;
        if (delivery_company !== undefined) order.delivery_company = delivery_company;
        if (status !== undefined) order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: '배송 정보가 성공적으로 수정되었습니다.',
            data: {
                order_id: order.order_id,
                total_amount: order.total_amount,
                tracking_number: order.tracking_number,
                delivery_company: order.delivery_company,
                status: order.status
            }
        });
    } catch (error) {
        console.error('배송 정보 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '배송 정보 수정 중 오류가 발생했습니다.'
        });
    }
};

