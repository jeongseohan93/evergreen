// src/features/admin/components/order/DeliveryFilterSection.jsx

import React from 'react';

const DeliveryFilterSection = ({
    delayStats,
    showDelayedOnly,
    showDateFilter,
    selectedDate,
    toggleDelayedFilter,
    toggleDateFilter,
    handleDateChange,
    clearDateFilter
}) => {
    return (
        <>
            {delayStats.delayed > 0 && (
                <div className="delay-stats">
                    <h3>⚠️ 지연 배송 현황</h3>
                    <div className="delay-count">
                        {delayStats.delayed} / {delayStats.total} 건 ({delayStats.delayedPercentage}%)
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button 
                    onClick={toggleDelayedFilter}
                    className={`delay-filter-btn ${showDelayedOnly ? 'active' : ''}`}
                >
                    {showDelayedOnly ? '전체 보기' : '지연 배송만 보기'}
                </button>
                
                <button 
                    onClick={toggleDateFilter}
                    className={`delay-filter-btn ${showDateFilter ? 'active' : ''}`}
                    style={{ backgroundColor: showDateFilter ? '#6c757d' : '#17a2b8' }}
                >
                    {showDateFilter ? '날짜 필터 닫기' : '날짜별 조회'}
                </button>
            </div>

            {showDateFilter && (
                <div style={{ 
                    marginBottom: '20px', 
                    textAlign: 'center',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <label htmlFor="dateFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        주문일 선택:
                    </label>
                    <input
                        type="date"
                        id="dateFilter"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            marginRight: '10px'
                        }}
                    />
                    {selectedDate && (
                        <button 
                            onClick={clearDateFilter}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            초기화
                        </button>
                    )}
                    {selectedDate && (
                        <div style={{ marginTop: '10px', color: '#666' }}>
                            📅 {selectedDate} 주문건 조회
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DeliveryFilterSection;