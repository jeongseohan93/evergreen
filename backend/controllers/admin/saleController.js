const Sale = require("../../models/sale");
const Order = require('../../models/order');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

// 매출 입력 (오프라인 매출 + 온라인 매출 자동 계산)
exports.addSale = async (req, res) => {
    const { sale_date, offline_amount, memo } = req.body;
    
    // 필수 필드 검증
    if (!sale_date || offline_amount === undefined) {
        return res.status(400).json({
            success: false,
            message: '날짜와 오프라인 매출은 필수 입력 항목입니다.'
        });
    }
    
    // 날짜 형식 검증 (YYYY-MM-DD 형식)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(sale_date)) {
        return res.status(400).json({
            success: false,
            message: '날짜는 YYYY-MM-DD 형식으로 입력해주세요.'
        });
    }
    
    // 오프라인 매출이 숫자인지 확인
    if (isNaN(offline_amount) || offline_amount < 0) {
        return res.status(400).json({
            success: false,
            message: '오프라인 매출은 0 이상의 숫자여야 합니다.'
        });
    }
    
    try {
        // 해당 일의 온라인 매출 계산 (paid 상태의 주문들)
        const startDate = new Date(sale_date);
        const endDate = new Date(sale_date);
        endDate.setHours(23, 59, 59, 999);
        
        const onlineOrders = await Order.findAll({
            where: {
                status: 'paid',
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        
        const online_amount = onlineOrders.reduce((sum, order) => sum + order.total_amount, 0);
        
        // 취소된 주문들의 매출 계산
        const cancelledOrders = await Order.findAll({
            where: {
                status: 'cancelled',
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        
        const cancel_amount = cancelledOrders.reduce((sum, order) => sum + order.total_amount, 0);
        
        // 총 매출 계산
        const total_amount = online_amount + parseInt(offline_amount) - cancel_amount;
        
        // 새로운 오프라인 매출 레코드 생성 (기존 데이터와 관계없이)
        const newSale = await Sale.create({
            sale_date,
            online_amount: 0, // 오프라인 매출만 저장하므로 0
            offline_amount: parseInt(offline_amount),
            cancel_amount: 0, // 오프라인 매출만 저장하므로 0
            total_amount: parseInt(offline_amount), // 오프라인 매출만 저장하므로 offline_amount와 동일
            memo: memo || null
        });
        
        res.status(201).json({
            success: true,
            message: '오프라인 매출이 성공적으로 추가되었습니다.',
            data: newSale
        });
    } catch (error) {
        console.error('매출 추가 오류:', error);
        res.status(500).json({
            success: false,
            message: '매출 추가 중 오류가 발생했습니다.'
        });
    }
};

// 일간 매출 조회
exports.getDailySales = async (req, res) => {
    const { year, month } = req.query;
    
    if (!year || !month) {
        return res.status(400).json({
            success: false,
            message: '년도와 월을 입력해주세요.'
        });
    }
    
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        // 해당 월의 일별 온라인 매출 계산
        const dailyOnlineSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'online_amount'],
                [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'order_count']
            ],
            where: {
                status: 'paid',
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 해당 월의 일별 취소 매출 계산
        const dailyCancelSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'cancel_amount']
            ],
            where: {
                status: 'cancelled',
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 해당 월의 일별 오프라인 매출 조회
        const dailyOfflineSales = await Sale.findAll({
            where: {
                sale_date: {
                    [Op.like]: `${year}-${month.toString().padStart(2, '0')}-%`
                }
            },
            order: [['sale_date', 'ASC']]
        });
        
        // 일별 데이터 합치기
        const dailySalesMap = new Map();
        
        // 해당 월의 모든 날짜에 대해 기본 데이터 생성
        for (let day = 1; day <= endDate.getDate(); day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dailySalesMap.set(dateStr, {
                date: dateStr,
                online_amount: 0,
                offline_amount: 0,
                offline_sales: [],
                cancel_amount: 0,
                total_amount: 0,
                order_count: 0
            });
        }
        
        // 온라인 매출 데이터 추가
        dailyOnlineSales.forEach(sale => {
            const dateStr = sale.dataValues.date;
            if (dailySalesMap.has(dateStr)) {
                const existing = dailySalesMap.get(dateStr);
                existing.online_amount = parseInt(sale.dataValues.online_amount);
                existing.order_count = parseInt(sale.dataValues.order_count);
            }
        });
        
        // 취소 매출 데이터 추가
        dailyCancelSales.forEach(sale => {
            const dateStr = sale.dataValues.date;
            if (dailySalesMap.has(dateStr)) {
                const existing = dailySalesMap.get(dateStr);
                existing.cancel_amount = parseInt(sale.dataValues.cancel_amount);
            }
        });
        
        // 오프라인 매출 데이터 추가 (여러 건을 배열로 저장하고, 합산도 같이)
        dailyOfflineSales.forEach(sale => {
            if (dailySalesMap.has(sale.sale_date)) {
                const existing = dailySalesMap.get(sale.sale_date);
                // 누적 합산
                existing.offline_amount = (existing.offline_amount || 0) + (sale.offline_amount || 0);
                // 오프라인 매출 정보를 배열에 추가
                existing.offline_sales.push({
                    sale_id: sale.sale_id,
                    offline_amount: sale.offline_amount || 0,
                    memo: sale.memo || null,
                    created_at: sale.created_at
                });
            }
        });
        
        // 총 매출 계산
        dailySalesMap.forEach(sale => {
            sale.total_amount = sale.online_amount + sale.offline_amount - sale.cancel_amount;
        });
        
        const dailySales = Array.from(dailySalesMap.values());
        
        res.status(200).json({
            success: true,
            data: dailySales
        });
    } catch (error) {
        console.error('일간 매출 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '일간 매출을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

// 월간 매출 조회
exports.getMonthlySales = async (req, res) => {
    const { year } = req.query;
    
    if (!year) {
        return res.status(400).json({
            success: false,
            message: '년도를 입력해주세요.'
        });
    }
    
    try {
        // 해당 년도의 월별 온라인 매출 계산
        const monthlyOnlineSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'online_amount'],
                [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'order_count']
            ],
            where: {
                status: 'paid',
                created_at: {
                    [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31, 23, 59, 59)]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 해당 년도의 월별 취소 매출 계산
        const monthlyCancelSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'cancel_amount']
            ],
            where: {
                status: 'cancelled',
                created_at: {
                    [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31, 23, 59, 59)]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 해당 년도의 월별 오프라인 매출 조회
        const monthlyOfflineSales = await Sale.findAll({
            where: {
                sale_date: {
                    [Op.like]: `${year}-%`
                }
            },
            order: [['sale_date', 'ASC']]
        });
        
        // 월별 데이터 합치기
        const monthlySalesMap = new Map();
        
        // 1월부터 12월까지 기본 데이터 생성
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            monthlySalesMap.set(month, {
                year: parseInt(year),
                month: month,
                sale_date: `${year}-${monthStr}`,
                online_amount: 0,
                offline_amount: 0,
                cancel_amount: 0,
                total_amount: 0,
                order_count: 0
            });
        }
        
        // 온라인 매출 데이터 추가
        monthlyOnlineSales.forEach(sale => {
            const month = parseInt(sale.dataValues.month);
            if (monthlySalesMap.has(month)) {
                const existing = monthlySalesMap.get(month);
                existing.online_amount = parseInt(sale.dataValues.online_amount);
                existing.order_count = parseInt(sale.dataValues.order_count);
            }
        });
        
        // 취소 매출 데이터 추가
        monthlyCancelSales.forEach(sale => {
            const month = parseInt(sale.dataValues.month);
            if (monthlySalesMap.has(month)) {
                const existing = monthlySalesMap.get(month);
                existing.cancel_amount = parseInt(sale.dataValues.cancel_amount);
            }
        });
        
        // 오프라인 매출 데이터 추가 (일별 데이터를 월별로 집계)
        monthlyOfflineSales.forEach(sale => {
            const month = parseInt(sale.sale_date.split('-')[1]);
            if (monthlySalesMap.has(month)) {
                const existing = monthlySalesMap.get(month);
                existing.offline_amount += sale.offline_amount || 0;
                // 메모 정보 추가 (배열로 저장)
                if (!existing.memos) {
                    existing.memos = [];
                }
                if (sale.memo) {
                    existing.memos.push({
                        date: sale.sale_date,
                        memo: sale.memo
                    });
                }
            }
        });
        
        // 총 매출 계산
        monthlySalesMap.forEach(sale => {
            sale.total_amount = sale.online_amount + sale.offline_amount - sale.cancel_amount;
        });
        
        const monthlySales = Array.from(monthlySalesMap.values());
        
        res.status(200).json({
            success: true,
            data: monthlySales
        });
    } catch (error) {
        console.error('월간 매출 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '월간 매출을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

// 연간 매출 조회
exports.getYearlySales = async (req, res) => {
    try {
        // 모든 년도의 연간 온라인 매출 계산
        const yearlyOnlineSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('created_at')), 'year'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'online_amount'],
                [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'order_count']
            ],
            where: {
                status: 'paid'
            },
            group: [Sequelize.fn('YEAR', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 모든 년도의 연간 취소 매출 계산
        const yearlyCancelSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('created_at')), 'year'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'cancel_amount']
            ],
            where: {
                status: 'cancelled'
            },
            group: [Sequelize.fn('YEAR', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('created_at')), 'ASC']]
        });
        
        // 모든 년도의 연간 오프라인 매출 계산
        const yearlyOfflineSales = await Sale.findAll({
            attributes: [
                [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4), 'year'],
                [Sequelize.fn('SUM', Sequelize.col('offline_amount')), 'offline_amount']
            ],
            group: [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4)],
            order: [[Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4), 'ASC']]
        });
        
        // 연간 데이터 합치기
        const yearlySalesMap = new Map();
        
        // 온라인 매출 데이터 추가
        yearlyOnlineSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            yearlySalesMap.set(year, {
                year: year,
                online_amount: parseInt(sale.dataValues.online_amount),
                offline_amount: 0,
                cancel_amount: 0,
                total_amount: parseInt(sale.dataValues.online_amount),
                order_count: parseInt(sale.dataValues.order_count)
            });
        });
        
        // 취소 매출 데이터 추가
        yearlyCancelSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            if (yearlySalesMap.has(year)) {
                const existing = yearlySalesMap.get(year);
                existing.cancel_amount = parseInt(sale.dataValues.cancel_amount);
                existing.total_amount = existing.online_amount + existing.offline_amount - existing.cancel_amount;
            }
        });
        
        // 오프라인 매출 데이터 추가
        yearlyOfflineSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            if (yearlySalesMap.has(year)) {
                const existing = yearlySalesMap.get(year);
                existing.offline_amount = parseInt(sale.dataValues.offline_amount);
                existing.total_amount = existing.online_amount + existing.offline_amount - existing.cancel_amount;
            }
        });
        
        const yearlySales = Array.from(yearlySalesMap.values());
        
        res.status(200).json({
            success: true,
            data: yearlySales
        });
    } catch (error) {
        console.error('연간 매출 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '연간 매출을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

// 특정 날짜의 매출 상세 조회
exports.getSaleByDate = async (req, res) => {
    const { sale_date } = req.params;
    
    if (!sale_date) {
        return res.status(400).json({
            success: false,
            message: '매출 날짜를 입력해주세요.'
        });
    }
    
    try {
        const sale = await Sale.findOne({
            where: { sale_date }
        });
        
        if (!sale) {
            return res.status(404).json({
                success: false,
                message: '해당 날짜의 매출 데이터를 찾을 수 없습니다.'
            });
        }
        
        res.status(200).json({
            success: true,
            data: sale
        });
    } catch (error) {
        console.error('매출 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '매출을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};
