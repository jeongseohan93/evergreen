// frontend/src/features/mypage/pages/OrderHistoryPage.jsx

import React, { useEffect, useState } from 'react';

import OrderHistorySummary from '../components/OrderHistorySummary'; 

import { fetchAllOrdersApi } from '../api/mypage'; 

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAllOrdersApi(); 
                setOrders(data);
            } catch (err) {
                setError('주문 내역을 불러오는데 실패했습니다.');
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, []); 

    if (loading) {
        return (
            // Fragment로 감싸는 것은 유지
            <> 
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-600">주문 목록을 불러오는 중...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            // Fragment로 감싸는 것은 유지
            <>
                <div className="flex justify-center items-center h-48">
                    <p className="text-red-500">{error}</p>
                </div>
            </>
        );
    }

    return (
        // Fragment로 감싸는 것은 유지
        <>
            {/* <MyPageNavGrid /> ⭐ 이 부분도 삭제! MyPageLayout에서 처리된다고 가정 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-[#306f65] mb-6 text-center">나의 주문 내역</h2>
                {orders.length === 0 ? (
                    <p className="text-center text-gray-600">아직 주문 내역이 없습니다.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <OrderHistorySummary key={order.order_id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default OrderHistoryPage;