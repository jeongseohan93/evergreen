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
            message: '날짜는YYYY-MM-DD 형식으로 입력해주세요.'
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
        endDate.setHours(23, 59, 59, 999); // 해당 날짜의 마지막 시간까지 포함

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

        // 새로운 오프라인 매출 레코드 생성 (Sale 테이블은 오프라인 매출만 기록)
        const newSale = await Sale.create({
            sale_date,
            online_amount: 0, // Sale 테이블은 오프라인 매출만 저장하므로 0
            offline_amount: parseInt(offline_amount),
            cancel_amount: 0, // Sale 테이블은 오프라인 매출만 저장하므로 0
            total_amount: parseInt(offline_amount), // Sale 테이블의 total_amount는 오프라인 매출과 동일
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
        const startDate = new Date(year, month - 1, 1); // 해당 월의 첫 날 00:00:00
        const endDate = new Date(year, month, 0);       // 해당 월의 마지막 날 00:00:00 (다음 달 0일)
        endDate.setHours(23, 59, 59, 999); // 해당 월의 마지막 날 23:59:59.999까지 포함

        console.log(`[getDailySales] Request received for Year: ${year}, Month: ${month}`); // 요청 확인
        console.log(`[getDailySales] Date Range (JS Date): ${startDate.toISOString()} to ${endDate.toISOString()}`);

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
        console.log('[getDailySales] dailyOnlineSales fetched:', dailyOnlineSales.map(s => s.toJSON()));

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
        console.log('[getDailySales] dailyCancelSales fetched:', dailyCancelSales.map(s => s.toJSON()));

        // 해당 월의 일별 오프라인 매출 조회 (Op.like 대신 Op.between 사용)
        const dailyOfflineSales = await Sale.findAll({
            where: {
                sale_date: {
                    [Op.between]: [
                        `${year}-${month.toString().padStart(2, '0')}-01`, // 해당 월의 첫 날 문자열
                        `${year}-${month.toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}` // 해당 월의 마지막 날 문자열
                    ]
                }
            },
            order: [['sale_date', 'ASC']]
        });
        console.log('[getDailySales] dailyOfflineSales fetched:', dailyOfflineSales.map(s => s.toJSON()));


        // 일별 데이터 합치기
        const dailySalesMap = new Map();

        // 해당 월의 모든 날짜에 대해 기본 데이터 생성
        for (let day = 1; day <= endDate.getDate(); day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dailySalesMap.set(dateStr, {
                date: dateStr,
                online_amount: 0,
                offline_amount: 0,
                offline_sales: [], // 특정 날짜의 오프라인 매출 상세를 담을 배열
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
            if (dailySalesMap.has(sale.sale_date)) { // sale.sale_date는 이미YYYY-MM-DD 문자열
                const existing = dailySalesMap.get(sale.sale_date);
                // 누적 합산
                existing.offline_amount = (existing.offline_amount || 0) + (sale.offline_amount || 0);
                // 오프라인 매출 정보를 배열에 추가
                existing.offline_sales.push({
                    sale_id: sale.sale_id,
                    offline_amount: sale.offline_amount || 0,
                    memo: sale.memo || null,
                    // sale 테이블에 created_at이 없으므로 제거 (timestamps: false)
                    // created_at: sale.created_at
                });
            }
        });

        // 총 매출 계산
        dailySalesMap.forEach(sale => {
            sale.total_amount = sale.online_amount + sale.offline_amount - sale.cancel_amount;
        });

        const dailySales = Array.from(dailySalesMap.values());
        console.log('[getDailySales] Final aggregated dailySales:', dailySales);

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
        const yearStartDate = new Date(year, 0, 1); // 해당 년도의 첫 날 00:00:00
        const yearEndDate = new Date(year, 11, 31, 23, 59, 59, 999); // 해당 년도의 마지막 날 23:59:59.999

        console.log(`[getMonthlySales] Request received for Year: ${year}`);

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
                    [Op.between]: [yearStartDate, yearEndDate]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'ASC']]
        });
        console.log('[getMonthlySales] monthlyOnlineSales fetched:', monthlyOnlineSales.map(s => s.toJSON()));


        // 해당 년도의 월별 취소 매출 계산
        const monthlyCancelSales = await Order.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'cancel_amount']
            ],
            where: {
                status: 'cancelled',
                created_at: {
                    [Op.between]: [yearStartDate, yearEndDate]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'ASC']]
        });
        console.log('[getMonthlySales] monthlyCancelSales fetched:', monthlyCancelSales.map(s => s.toJSON()));


        // 오프라인 매출 조회 (Sale.sale_date는 CHAR(10)이므로, SUBSTRING 사용)
        const monthlyOfflineSales = await Sale.findAll({
            attributes: [
                // 🚨 수정: group by 컬럼인 'YYYY-MM'을 직접 가져옴.
                [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 7), 'month_year_str'], // 'YYYY-MM' 부분 추출
                [Sequelize.fn('SUM', Sequelize.col('offline_amount')), 'offline_amount'],
                // 🚨🚨🚨 수정: GROUP_CONCAT의 SEPARATOR 구문 오류 수정
                [Sequelize.literal(`GROUP_CONCAT(CONCAT_WS('|||', sale_date, offline_amount, memo) SEPARATOR '|||')`), 'memos_aggregated']
            ],
            where: {
                sale_date: {
                    [Op.between]: [`${year}-01-01`, `${year}-12-31`]
                }
            },
            group: [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 7)], // 'YYYY-MM'으로 그룹
            order: [[Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 7), 'ASC']]
        });
        console.log('[getMonthlySales] monthlyOfflineSales fetched:', monthlyOfflineSales.map(s => s.toJSON()));


        // 월별 데이터 합치기
        const monthlySalesMap = new Map();

        // 1월부터 12월까지 기본 데이터 생성
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            monthlySalesMap.set(month, {
                year: parseInt(year),
                month: month,
                sale_date: `${year}-${monthStr}`, // 이 필드는 월별 집계에서는 크게 의미 없을 수 있음
                online_amount: 0,
                offline_amount: 0,
                cancel_amount: 0,
                total_amount: 0,
                order_count: 0,
                memos: [] // 월별 메모를 담을 배열 (일별 메모와는 다른 집계 방식)
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
            // 🚨 수정: month_year_str에서 월만 추출
            const month = parseInt(sale.dataValues.month_year_str.substring(5, 7)); // 'YYYY-MM'에서 'MM' 추출
            if (monthlySalesMap.has(month)) {
                const existing = monthlySalesMap.get(month);
                existing.offline_amount += parseInt(sale.dataValues.offline_amount || 0);

                // 집계된 메모 문자열 처리
                const aggregatedMemos = sale.dataValues.memos_aggregated;
                if (aggregatedMemos) {
                    // 🚨 변경: GROUP_CONCAT의 구분자 '|||'로 분리
                    // 각 항목이 'sale_date|||offline_amount|||memo' 형태이고, 전체는 이 항목들이 '|||'로 구분됨.
                    // 즉, '항목1|||항목2|||항목3' 이런 형태.
                    // 따라서 split('|||')을 하면 [날짜1, 금액1, 메모1, 날짜2, 금액2, 메모2, ...] 이렇게 됨.
                    const memoParts = aggregatedMemos.split('|||');
                    for (let i = 0; i < memoParts.length; i += 3) { // 3개씩 묶어서 처리
                        const date = memoParts[i];
                        const amount = parseFloat(memoParts[i + 1]);
                        const memo = memoParts[i + 2]; // 메모 내용
                        if (date && !isNaN(amount) && memo !== undefined) {
                            existing.memos.push({
                                date: date,
                                offline_amount: amount,
                                memo: memo
                            });
                        }
                    }
                }
            }
        });

        // 총 매출 계산
        monthlySalesMap.forEach(sale => {
            sale.total_amount = sale.online_amount + sale.offline_amount - sale.cancel_amount;
        });

        const monthlySales = Array.from(monthlySalesMap.values()).sort((a, b) => a.month - b.month);
        console.log('[getMonthlySales] Final aggregated monthlySales:', monthlySales);

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
        console.log('[getYearlySales] Request received.');

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
        console.log('[getYearlySales] yearlyOnlineSales fetched:', yearlyOnlineSales.map(s => s.toJSON()));


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
        console.log('[getYearlySales] yearlyCancelSales fetched:', yearlyCancelSales.map(s => s.toJSON()));


        // 모든 년도의 연간 오프라인 매출 계산 (Sale.sale_date는 CHAR(10)이므로, SUBSTRING 사용)
        const yearlyOfflineSales = await Sale.findAll({
            attributes: [
                [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4), 'year'], // 'YYYY' 부분 추출
                [Sequelize.fn('SUM', Sequelize.col('offline_amount')), 'offline_amount']
            ],
            group: [Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4)],
            order: [[Sequelize.fn('SUBSTRING', Sequelize.col('sale_date'), 1, 4), 'ASC']]
        });
        console.log('[getYearlySales] yearlyOfflineSales fetched:', yearlyOfflineSales.map(s => s.toJSON()));


        // 연간 데이터 합치기
        const yearlySalesMap = new Map();

        const allYears = new Set();
        yearlyOnlineSales.forEach(sale => allYears.add(parseInt(sale.dataValues.year)));
        yearlyCancelSales.forEach(sale => allYears.add(parseInt(sale.dataValues.year)));
        yearlyOfflineSales.forEach(sale => allYears.add(parseInt(sale.dataValues.year)));

        Array.from(allYears).sort((a, b) => a - b).forEach(year => {
            yearlySalesMap.set(year, {
                year: year,
                online_amount: 0,
                offline_amount: 0,
                cancel_amount: 0,
                total_amount: 0,
                order_count: 0
            });
        });

        yearlyOnlineSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            if (yearlySalesMap.has(year)) {
                const existing = yearlySalesMap.get(year);
                existing.online_amount = parseInt(sale.dataValues.online_amount);
                existing.order_count = parseInt(sale.dataValues.order_count);
            }
        });

        yearlyCancelSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            if (yearlySalesMap.has(year)) {
                const existing = yearlySalesMap.get(year);
                existing.cancel_amount = parseInt(sale.dataValues.cancel_amount);
            }
        });

        yearlyOfflineSales.forEach(sale => {
            const year = parseInt(sale.dataValues.year);
            if (yearlySalesMap.has(year)) {
                const existing = yearlySalesMap.get(year);
                existing.offline_amount = parseInt(sale.dataValues.offline_amount);
            }
        });

        yearlySalesMap.forEach(sale => {
            sale.total_amount = sale.online_amount + sale.offline_amount - sale.cancel_amount;
        });

        const yearlySales = Array.from(yearlySalesMap.values());
        console.log('[getYearlySales] Final aggregated yearlySales:', yearlySales);

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

// 특정 날짜의 매출 상세 조회 (findOne -> findAll로 변경)
exports.getSaleByDate = async (req, res) => {
    const { sale_date } = req.params;

    if (!sale_date) {
        return res.status(400).json({
            success: false,
            message: '매출 날짜를 입력해주세요.'
        });
    }

    try {
        const sales = await Sale.findAll({
            where: { sale_date },
            order: [['sale_id', 'ASC']] // createdAt 대신 sale_id로 정렬
        });
        console.log(`[getSaleByDate] Request received for date: ${sale_date}`);
        console.log('[getSaleByDate] sales fetched:', sales.map(s => s.toJSON()));


        if (sales.length === 0) {
            console.log('[getSaleByDate] No sales found for date:', sale_date);
            // 🚨 수정: 매출이 없는 경우에도 빈 offline_sales 배열과 0 금액으로 응답하여 프론트엔드가 에러 대신 빈 모달을 처리하도록 함
            return res.status(200).json({
                success: true,
                message: '해당 날짜의 매출 데이터를 찾을 수 없습니다.',
                data: {
                    date: sale_date,
                    offline_amount: 0,
                    offline_sales: []
                }
            });
        }

        const formattedSalesData = {
            date: sale_date,
            offline_amount: sales.reduce((sum, s) => sum + (s.offline_amount || 0), 0),
            offline_sales: sales.map(s => ({
                sale_id: s.sale_id,
                offline_amount: s.offline_amount || 0,
                memo: s.memo || null,
                // sale 테이블에 created_at이 없으므로 제거
                // created_at: s.created_at
            })),
        };
        console.log('[getSaleByDate] Final result:', formattedSalesData);

        res.status(200).json({
            success: true,
            data: formattedSalesData
        });
    } catch (error) {
        console.error('매출 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '매출을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

