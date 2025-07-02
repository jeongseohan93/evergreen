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
                <p>
                    {showDelayedOnly && selectedDate 
                        ? `${selectedDate} 날짜의 지연 배송이 없습니다.`
                        : showDelayedOnly 
                        ? '지연 배송이 없습니다.'
                        : selectedDate 
                        ? `${selectedDate} 날짜의 주문이 없습니다.`
                        : '배송 내역이 없습니다.'
                    }
                </p>
            ) : (
                <div className="delivery-grid">
                    {filteredDeliveries.map(delivery => (
                        <DeliveryCard
                            key={delivery.order_id}
                            delivery={delivery}
                            editingDelivery={editingDelivery}
                            getStatusText={getStatusText}
                            getStatusClass={getStatusClass}
                            handleDeliveryStatusUpdate={handleDeliveryStatusUpdate}
                            handleTrackParcel={handleTrackParcel}
                            handleCompleteDelivery={handleCompleteDelivery}
                            handleCancelDelivery={handleCancelDelivery}
                            toggleDeliveryEdit={toggleDeliveryEdit}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default DeliveryList;