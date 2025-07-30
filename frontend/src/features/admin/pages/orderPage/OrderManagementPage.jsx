// src/features/admin/pages/orderPage/OrderManagementPage.jsx

import React, { useState } from 'react';
import useDeliveryManagement from '../../components/order/hooks/useDeliveryManagement'; 
import DeliveryFilterSection from '../../pages/orderPage/DeliveryFilterSection';
import DeliveryList from '../../pages/orderPage/DeliveryList';
import DeliveryModifyForm from '../../pages/orderPage/DeliveryModifyForm';
import * as userApi from '../../api/userApi';

const OrderManagementPage = () => {
    const {
        loading,
        error,
        editingDelivery: editingDeliveryMap,
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
        fetchAllDeliveries, // 추가
    } = useDeliveryManagement();

    const delayStats = getDelayStats();
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [editingDelivery, setEditingDelivery] = useState(null);

    const handleSearchKeywordChange = (e) => setSearchInput(e.target.value);
    const handleSearch = () => {
        setSearchKeyword(searchInput.trim());
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearchKeyword('');
    };

    const filteredDeliveries = getFilteredDeliveries(searchKeyword);

    const handleEditClick = async (delivery) => {
        // user_uuid로 사용자 정보 조회
        let userInfo = null;
        try {
            if (delivery.user_uuid) {
                const userRes = await userApi.getUserById(delivery.user_uuid);
                userInfo = userRes?.user || userRes; // userRes.user 또는 userRes 자체
            }
        } catch (e) {
            userInfo = null;
        }
        setEditingDelivery({ ...delivery, User: userInfo });
    };
    const handleEditCancel = () => setEditingDelivery(null);
    const handleEditSuccess = () => {
        setEditingDelivery(null);
        fetchAllDeliveries();
    };

    // 상태 기반 조건부 렌더링
    if (editingDelivery) {
        return (
            <DeliveryModifyForm
                delivery={editingDelivery}
                onCancel={handleEditCancel}
                onSuccess={handleEditSuccess}
            />
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {loading && <p>로딩 중...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="delivery-section">
                <h2 className="font-aggro text-4xl font-bold">배송 관리</h2>
                <DeliveryFilterSection
                    delayStats={delayStats}
                    showDelayedOnly={showDelayedOnly}
                    showDateFilter={showDateFilter}
                    selectedDate={selectedDate}
                    toggleDelayedFilter={toggleDelayedFilter}
                    toggleDateFilter={toggleDateFilter}
                    handleDateChange={handleDateChange}
                    clearDateFilter={clearDateFilter}
                    searchKeyword={searchInput}
                    onSearchKeywordChange={handleSearchKeywordChange}
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
                />
                <DeliveryList
                    filteredDeliveries={filteredDeliveries}
                    showDelayedOnly={showDelayedOnly}
                    selectedDate={selectedDate}
                    editingDelivery={editingDeliveryMap}
                    getStatusText={getStatusText}
                    getStatusClass={getStatusClass}
                    handleDeliveryStatusUpdate={handleDeliveryStatusUpdate}
                    handleCompleteDelivery={handleCompleteDelivery}
                    handleCancelDelivery={handleCancelDelivery}
                    onEditClick={handleEditClick}
                />
            </div>
        </div>
    );
};

export default OrderManagementPage;