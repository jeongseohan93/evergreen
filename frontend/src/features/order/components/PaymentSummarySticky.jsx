// src/features/order/components/PaymentSummarySticky.jsx

import React from 'react'; // useState, ChevronUp, ChevronDown, HelpCircle는 더 이상 필요 없으므로 제거

const PaymentSummarySticky = ({ payment }) => {
    // 섹션 확장/축소 상태 관리 제거

    // payment 객체가 유효하지 않을 경우 로딩 메시지 표시
    if (!payment) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md flex justify-center items-center h-32">
                <p className="text-gray-700">결제 정보 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4">

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center"> 
                    <h2 className="text-xl font-bold text-gray-800">최종 결제 금액</h2> 
                    <div className="flex items-center text-blue-600 font-bold text-2xl"> 
                        {(payment.totalPaymentAmount || 0).toLocaleString()}원
                  
                    </div>
                </div>
     
            </div>

       
        </div>
    );
};

export default PaymentSummarySticky;
