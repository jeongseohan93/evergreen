// src/features/admin/components/order/DeliveryList.jsx

import React from 'react';

const DeliveryList = ({
    filteredDeliveries,
    showDelayedOnly,
    selectedDate,
    editingDelivery,
    getStatusText,
    getStatusClass,
    handleDeliveryStatusUpdate,
    handleCompleteDelivery,
    handleCancelDelivery,
    onEditClick
}) => {
    return (
        <>
            {filteredDeliveries.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <span className="text-gray-500 text-lg">
                        {showDelayedOnly && selectedDate 
                            ? `${selectedDate} 날짜의 지연 배송이 없습니다.`
                            : showDelayedOnly 
                            ? '지연 배송이 없습니다.'
                            : selectedDate 
                            ? `${selectedDate} 날짜의 주문이 없습니다.`
                            : '배송 내역이 없습니다.'
                        }
                    </span>
                </div>
            ) : (
                <div className="bg-white border border-[#306f65] rounded-lg p-6 overflow-x-auto">
                    <h2 className="text-2xl font-bold font-aggro text-gray-800 mb-6">전체 배송 목록</h2>
                    <table className="w-full table-fixed border border-gray-300 bg-white rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r border-gray-300 last:border-r-0">고객</th>
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r border-gray-300 last:border-r-0">전화</th>
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r border-gray-300 last:border-r-0">주문일</th>
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r border-gray-300 last:border-r-0">운송번호</th>
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r border-gray-300 last:border-r-0">배송상태</th>
                                <th className="p-2 text-center text-sm font-semibold border-b border-gray-300 border-r-0">작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map(delivery => (
                                <tr key={delivery.order_id} className={delivery.status !== 'delivered' ? 'bg-red-50' : ''}>
                                    <td className="p-2 text-center border-b border-gray-300 border-r border-gray-300 last:border-r-0">{delivery.User?.name || 'N/A'}</td>
                                    <td className="p-2 text-center border-b border-gray-300 border-r border-gray-300 last:border-r-0">{delivery.User?.phone || 'N/A'}</td>
                                    <td className="p-2 text-center border-b border-gray-300 border-r border-gray-300 last:border-r-0">{new Date(delivery.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 text-center border-b border-gray-300 border-r border-gray-300 last:border-r-0">{delivery.tracking_number || '-'}</td>
                                    <td className="p-2 text-center border-b border-gray-300 border-r border-gray-300 last:border-r-0">
                                        <span className={`status-badge ${getStatusClass(delivery.status)}`}>{getStatusText(delivery.status)}</span>
                                    </td>
                                    <td className="p-2 text-center border-b border-gray-300 border-r-0">
                                        {/* 수정/완료/취소 버튼만 한 줄에 나란히 */}
                                        <span>
                                            <button 
                                                onClick={() => onEditClick(delivery)}
                                                className="bg-[#58bcb5] rounded px-2 py-1 text-sm text-white border border-[#306f65]"
                                            >수정</button>
                                            {delivery.status === 'shipping' && (
                                                <button 
                                                    onClick={() => handleCompleteDelivery(delivery.order_id)}
                                                    className="bg-[#306f65] ml-1 rounded px-2 py-1 text-sm text-white border border-[#306f65]"
                                                >완료</button>
                                            )}
                                            {delivery.status !== 'cancelled' && delivery.status !== 'delivered' && (
                                                <button 
                                                    onClick={() => handleCancelDelivery(delivery.order_id)}
                                                    className="bg-red-500 ml-1 mt-1 rounded px-2 py-1 text-sm text-white border border-[#306f65]"
                                                >취소</button>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default DeliveryList;