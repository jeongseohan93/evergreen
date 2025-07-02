import React from 'react';

const MyOrderProgress = ({ orderStatus }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-bold text-gray-800 p-4 border-b border-gray-200">나의 주문처리 현황 <span className="text-sm font-normal text-gray-500">(최근 3개월 기준)</span></h2>
            <div className="p-6 flex flex-col md:flex-row justify-between items-stretch">
                {/* 주문 단계별 현황 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 flex-grow">
                    <div className="text-center p-2">
                        <p className="text-md font-semibold text-gray-700 mb-1">입금전</p>
                        <span className="text-2xl font-bold text-gray-900">{orderStatus.beforeDeposit}</span>
                    </div>
                    <div className="text-center p-2">
                        <p className="text-md font-semibold text-gray-700 mb-1">배송준비중</p>
                        <span className="text-2xl font-bold text-gray-900">{orderStatus.preparingDelivery}</span>
                    </div>
                    <div className="text-center p-2">
                        <p className="text-md font-semibold text-gray-700 mb-1">배송중</p>
                        <span className="text-2xl font-bold text-gray-900">{orderStatus.shipping}</span>
                    </div>
                    <div className="text-center p-2">
                        <p className="text-md font-semibold text-gray-700 mb-1">배송완료</p>
                        <span className="text-2xl font-bold text-gray-900">{orderStatus.delivered}</span>
                    </div>
                </div>

                {/* 취소/교환/반품 현황 */}
                <div className="md:border-l border-gray-200 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0">
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>· 취소 : <span className="font-bold">{orderStatus.canceled}</span></li>
                        <li>· 교환 : <span className="font-bold">{orderStatus.exchanged}</span></li>
                        <li>· 반품 : <span className="font-bold">{orderStatus.returned}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyOrderProgress;