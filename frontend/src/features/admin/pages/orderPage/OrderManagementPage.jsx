// src/features/admin/pages/orderPage/OrderManagementPage.jsx

import React from 'react';
import useDeliveryManagement from '../../components/order/hooks/useDeliveryManagement'; 

// 새로 만들 컴포넌트들을 임포트합니다.
import DeliveryFilterSection from '../../pages/orderPage/DeliveryFilterSection';
import DeliveryList from '../../pages/orderPage/DeliveryList';
import TrackingModal from '../../pages/orderPage/TrackingModal';

const OrderManagementPage = () => {
    const {
        loading,
        error,
        editingDelivery,
        trackingInfo,
        showTrackingModal,
        showDelayedOnly,
        showDateFilter,
        selectedDate,
        
        handleDeliveryStatusUpdate,
        handleTrackParcel,
        handleCompleteDelivery,
        handleCancelDelivery,
        toggleDeliveryEdit,
        getStatusText,
        getStatusClass,
        getDelayStats,
        getFilteredDeliveries,
        toggleDelayedFilter,
        toggleDateFilter,
        handleDateChange,
        clearDateFilter,
        setShowTrackingModal
    } = useDeliveryManagement();

    const delayStats = getDelayStats(); // 지연 통계는 필터 섹션과 목록 모두에 필요할 수 있으니 여기서 계산
    const filteredDeliveries = getFilteredDeliveries(); // 필터링된 배송 목록

    return (
        <div className="delivery-dashboard-container">
            {loading && <p>로딩 중...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="delivery-section">
                <h2>배송 관리</h2>
                
                {/* 필터 섹션 컴포넌트 */}
                <DeliveryFilterSection
                    delayStats={delayStats}
                    showDelayedOnly={showDelayedOnly}
                    showDateFilter={showDateFilter}
                    selectedDate={selectedDate}
                    toggleDelayedFilter={toggleDelayedFilter}
                    toggleDateFilter={toggleDateFilter}
                    handleDateChange={handleDateChange}
                    clearDateFilter={clearDateFilter}
                />

                {/* 배송 목록 컴포넌트 */}
                <DeliveryList
                    filteredDeliveries={filteredDeliveries}
                    showDelayedOnly={showDelayedOnly}
                    selectedDate={selectedDate}
                    editingDelivery={editingDelivery}
                    getStatusText={getStatusText}
                    getStatusClass={getStatusClass}
                    handleDeliveryStatusUpdate={handleDeliveryStatusUpdate}
                    handleTrackParcel={handleTrackParcel}
                    handleCompleteDelivery={handleCompleteDelivery}
                    handleCancelDelivery={handleCancelDelivery}
                    toggleDeliveryEdit={toggleDeliveryEdit}
                />
            </div>

            {/* 추적 모달 컴포넌트 */}
            <TrackingModal
                showTrackingModal={showTrackingModal}
                trackingInfo={trackingInfo}
                setShowTrackingModal={setShowTrackingModal}
            />
        </div>
    );
};

export default OrderManagementPage;