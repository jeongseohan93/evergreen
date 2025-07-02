// src/features/admin/components/order/DeliveryCard.jsx

import React from 'react';

const DeliveryCard = ({
    delivery,
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
        <div key={delivery.order_id} className={`delivery-card ${delivery.isDelayed ? 'delayed-order' : ''}`}>
            {delivery.isDelayed && (
                <div className="delay-warning">
                    ⚠️ {delivery.delayDays}일 지연
                </div>
            )}

            <div className="delivery-header">
                <h3>주문 #{delivery.order_id}</h3>
                <span className={`status-badge ${getStatusClass(delivery.status)}`}>
                    {getStatusText(delivery.status)}
                </span>
            </div>
            
            <div className="delivery-info">
                <p><strong>고객:</strong> {delivery.User?.name || 'N/A'}</p>
                <p><strong>이메일:</strong> {delivery.User?.email || 'N/A'}</p>
                <p><strong>전화:</strong> {delivery.User?.phone || 'N/A'}</p>
                <p><strong>총 금액:</strong> {delivery.total_amount?.toLocaleString()}원</p>
                <p><strong>주문일:</strong> {new Date(delivery.created_at).toLocaleDateString()}</p>
                
                {delivery.isDelayed && (
                    <p className="delay-days">
                        <strong>⚠️ {delivery.daysSinceOrder}일째 미완료</strong>
                    </p>
                )}
                
                {delivery.tracking_number && (
                    <p><strong>운송장:</strong> {delivery.tracking_number}</p>
                )}
                {delivery.delivery_company && (
                    <p><strong>택배사:</strong> {delivery.delivery_company}</p>
                )}
            </div>

            <div className="delivery-items">
                <h4>주문 상품</h4>
                {delivery.OrderItems?.map(item => (
                    <div key={item.order_item_id} className="delivery-item">
                        <span>{item.Product?.name || '상품명 없음'}</span>
                        <span>{item.quantity}개</span>
                        <span>{item.price?.toLocaleString()}원</span>
                    </div>
                ))}
            </div>

            <div className="delivery-actions">
                {editingDelivery[delivery.order_id] ? (
                    <div className="delivery-edit-form">
                        <div className="status-update-section">
                            <label>배송 상태:</label>
                            <select
                                defaultValue={delivery.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    const trackingNumber = delivery.tracking_number || '';
                                    const deliveryCompany = delivery.delivery_company || '';
                                    handleDeliveryStatusUpdate(delivery.order_id, newStatus, trackingNumber, deliveryCompany);
                                }}
                            >
                                <option value="pending">대기</option>
                                <option value="paid">결제완료</option>
                                <option value="shipping">배송중</option>
                                <option value="delivered">배송완료</option>
                                <option value="cancelled">취소</option>
                            </select>
                            <div className="status-note">
                                <small>💡 <strong>참고:</strong> 실제 운영에서는 상태 전환이 제한됩니다.</small>
                                <small>• 배송완료 → 취소 불가</small>
                                <small>• 취소 → 다른 상태로 변경 불가</small>
                                <small>• 현재는 개발 모드로 자유롭게 변경 가능</small>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="운송장 번호"
                            defaultValue={delivery.tracking_number || ''}
                            onChange={(e) => {
                                const newTrackingNumber = e.target.value;
                                const deliveryCompany = delivery.delivery_company || '';
                                handleDeliveryStatusUpdate(delivery.order_id, delivery.status, newTrackingNumber, deliveryCompany);
                            }}
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
                        />
                        <button onClick={() => toggleDeliveryEdit(delivery.order_id)}>
                            완료
                        </button>
                    </div>
                ) : (
                    <div className="delivery-action-buttons">
                        <button 
                            onClick={() => toggleDeliveryEdit(delivery.order_id)}
                            className="edit-btn"
                        >
                            수정
                        </button>
                        {delivery.tracking_number && (
                            <button 
                                onClick={() => handleTrackParcel(delivery.tracking_number)}
                                className="track-btn"
                            >
                                추적
                            </button>
                        )}
                        {delivery.status === 'shipping' && (
                            <button 
                                onClick={() => handleCompleteDelivery(delivery.order_id)}
                                className="complete-btn"
                            >
                                완료
                            </button>
                        )}
                        {delivery.status !== 'cancelled' && delivery.status !== 'delivered' && (
                            <button 
                                onClick={() => handleCancelDelivery(delivery.order_id)}
                                className="cancel-btn"
                            >
                                취소
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryCard;