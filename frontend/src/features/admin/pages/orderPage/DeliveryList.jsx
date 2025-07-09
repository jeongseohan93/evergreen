// src/features/admin/components/order/DeliveryList.jsx

import React from 'react';
import DeliveryCard from './DeliveryCard'; // DeliveryCard 컴포넌트를 임포트합니다.

const DeliveryList = ({
    filteredDeliveries,
    showDelayedOnly,
    selectedDate,
    editingDelivery,
    getStatusText,
    getStatusClass,
    handleDeliveryStatusUpdate,
    handleTrackParcel,
    handleCompleteDelivery,
    handleCancelDelivery,
    toggleDeliveryEdit
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
                    <table className="w-full table-fixed border border-gray-200 bg-white rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-2 text-center text-sm font-semibold">주문번호</th>
                                <th className="p-2 text-center text-sm font-semibold">고객</th>
                                <th className="p-2 text-center text-sm font-semibold">이메일</th>
                                <th className="p-2 text-center text-sm font-semibold">전화</th>
                                <th className="p-2 text-center text-sm font-semibold">총 금액</th>
                                <th className="p-2 text-center text-sm font-semibold">주문일</th>
                                <th className="p-2 text-center text-sm font-semibold">운송장</th>
                                <th className="p-2 text-center text-sm font-semibold">택배사</th>
                                <th className="p-2 text-center text-sm font-semibold">상태</th>
                                <th className="p-2 text-center text-sm font-semibold">지연</th>
                                <th className="p-2 text-center text-sm font-semibold">액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map(delivery => (
                                <tr key={delivery.order_id} className={delivery.isDelayed ? 'bg-red-50' : ''}>
                                    <td className="p-2 text-center">{delivery.order_id}</td>
                                    <td className="p-2 text-center">{delivery.User?.name || 'N/A'}</td>
                                    <td className="p-2 text-center">{delivery.User?.email || 'N/A'}</td>
                                    <td className="p-2 text-center">{delivery.User?.phone || 'N/A'}</td>
                                    <td className="p-2 text-center">{delivery.total_amount?.toLocaleString()}원</td>
                                    <td className="p-2 text-center">{new Date(delivery.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 text-center">{delivery.tracking_number || '-'}</td>
                                    <td className="p-2 text-center">{delivery.delivery_company || '-'}</td>
                                    <td className="p-2 text-center">
                                        <span className={`status-badge ${getStatusClass(delivery.status)}`}>{getStatusText(delivery.status)}</span>
                                    </td>
                                    <td className="p-2 text-center text-red-500 font-bold">
                                        {delivery.isDelayed ? `⚠️ ${delivery.daysSinceOrder}일` : ''}
                                    </td>
                                    <td className="p-2 text-center">
                                        {/* 액션 버튼들: 수정, 추적, 완료, 취소 등 DeliveryCard에서 가져와서 여기에 맞게 배치 */}
                                        {editingDelivery[delivery.order_id] ? (
                                            <div className="flex flex-col gap-1 items-center">
                                                <select
                                                    defaultValue={delivery.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        const trackingNumber = delivery.tracking_number || '';
                                                        const deliveryCompany = delivery.delivery_company || '';
                                                        handleDeliveryStatusUpdate(delivery.order_id, newStatus, trackingNumber, deliveryCompany);
                                                    }}
                                                    className="border rounded px-2 py-1 text-xs"
                                                >
                                                    <option value="pending">대기</option>
                                                    <option value="paid">결제완료</option>
                                                    <option value="shipping">배송중</option>
                                                    <option value="delivered">배송완료</option>
                                                    <option value="cancelled">취소</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="운송장 번호"
                                                    defaultValue={delivery.tracking_number || ''}
                                                    onChange={(e) => {
                                                        const newTrackingNumber = e.target.value;
                                                        const deliveryCompany = delivery.delivery_company || '';
                                                        handleDeliveryStatusUpdate(delivery.order_id, delivery.status, newTrackingNumber, deliveryCompany);
                                                    }}
                                                    className="border rounded px-2 py-1 text-xs mt-1"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="택배사명"
                                                    defaultValue={delivery.delivery_company || ''}
                                                    onChange={(e) => {
                                                        const newDeliveryCompany = e.target.value;
                                                        const trackingNumber = delivery.tracking_number || '';
                                                        handleDeliveryStatusUpdate(delivery.order_id, delivery.status, trackingNumber, newDeliveryCompany);
                                                    }}
                                                    className="border rounded px-2 py-1 text-xs mt-1"
                                                />
                                                <button onClick={() => toggleDeliveryEdit(delivery.order_id)} className="bg-[#306f65] text-white rounded px-2 py-1 text-xs mt-1">완료</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1 items-center">
                                                <button 
                                                    onClick={() => toggleDeliveryEdit(delivery.order_id)}
                                                    className="edit-btn bg-gray-200 rounded px-2 py-1 text-xs"
                                                >수정</button>
                                                {delivery.tracking_number && (
                                                    <button 
                                                        onClick={() => handleTrackParcel(delivery.tracking_number)}
                                                        className="track-btn bg-blue-200 rounded px-2 py-1 text-xs"
                                                    >추적</button>
                                                )}
                                                {delivery.status === 'shipping' && (
                                                    <button 
                                                        onClick={() => handleCompleteDelivery(delivery.order_id)}
                                                        className="complete-btn bg-green-200 rounded px-2 py-1 text-xs"
                                                    >완료</button>
                                                )}
                                                {delivery.status !== 'cancelled' && delivery.status !== 'delivered' && (
                                                    <button 
                                                        onClick={() => handleCancelDelivery(delivery.order_id)}
                                                        className="cancel-btn bg-red-200 rounded px-2 py-1 text-xs"
                                                    >취소</button>
                                                )}
                                            </div>
                                        )}
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