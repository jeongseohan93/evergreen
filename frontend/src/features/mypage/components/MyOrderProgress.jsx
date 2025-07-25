import React from 'react';

// 1. Order 모델의 status 값에 맞춰 orderStatus 객체를 정의합니다.
//    각 상태의 초기값은 0으로 설정합니다.
const defaultStatus = {
    pending: 0,         // 결제 대기
    paid: 0,            // 결제 완료 (이후 배송 준비 중으로 넘어갈 수 있음)
    shipping: 0,        // 배송 중
    delivered: 0,       // 배송 완료
    cancelled: 0,       // 취소됨
    payment_failed: 0,  // 결제 실패
};

// 2. props를 받을 때, orderStatus가 없으면(undefined이면) defaultStatus를 사용하도록 설정합니다.
const MyOrderProgress = ({ orderStatus = defaultStatus }) => {
    // Order 모델의 status 값과 매핑되는 레이블 및 값을 정의합니다.
    const statuses = [
        { label: '결제 대기', value: orderStatus.pending },
        { label: '결제 완료', value: orderStatus.paid },
        { label: '배송 중', value: orderStatus.shipping },
        { label: '배송 완료', value: orderStatus.delivered },
        { label: '취소됨', value: orderStatus.cancelled },
        { label: '결제 실패', value: orderStatus.payment_failed },
    ];

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
         
            <div className="flex justify-around text-center">
                {statuses.map((status, index) => (
                    <div key={index} className="flex-1 min-w-[80px] px-2"> {/* 각 항목의 너비를 유연하게 조정 */}
                        <p className="text-2xl font-bold">{status.value}</p>
                        <p className="text-sm text-gray-600">{status.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrderProgress;
