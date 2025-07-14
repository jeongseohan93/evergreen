import React from 'react';

// 1. 기본으로 사용할 orderStatus 객체를 미리 정의합니다.
const defaultStatus = {
    beforeDeposit: 0,
    preparingDelivery: 0,
    shipping: 0,
    delivered: 0,
    canceled: 0,
    exchanged: 0,
    returned: 0,
};

// 2. props를 받을 때, orderStatus가 없으면(undefined이면) defaultStatus를 사용하도록 설정합니다.
const MyOrderProgress = ({ orderStatus = defaultStatus }) => {
    const statuses = [
        { label: '입금전', value: orderStatus.beforeDeposit },
        { label: '배송준비중', value: orderStatus.preparingDelivery },
        { label: '배송중', value: orderStatus.shipping },
        { label: '배송완료', value: orderStatus.delivered },
        { label: '취소', value: orderStatus.canceled },
        { label: '교환', value: orderStatus.exchanged },
        { label: '반품', value: orderStatus.returned },
    ];

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">나의 주문처리 현황</h3>
            <div className="flex justify-around text-center">
                {statuses.map((status, index) => (
                    <div key={index}>
                        <p className="text-2xl font-bold">{status.value}</p>
                        <p className="text-sm text-gray-600">{status.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrderProgress;