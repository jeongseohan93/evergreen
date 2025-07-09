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
                <div className="bg-white border border-[#306f65] rounded-lg p-4 mb-4 mt-10 flex items-center justify-between">
                    <div className="delay-stats">
                        <h3 className="font-aggro text-xl font-bold text-[#306f65]">⚠️ 지연 배송 현황</h3>
                        <div className="delay-count">
                            <strong>{delayStats.delayed} / {delayStats.total} 건 ({delayStats.delayedPercentage}%)</strong>
                        </div>
                    </div>
                    <button 
                        onClick={toggleDelayedFilter}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-[#306f65] flex items-center justify-center gap-2 ml-4
                            ${showDelayedOnly
                                ? 'bg-[#306f65] text-white hover:text-[#306f65] hover:bg-white'
                                : 'bg-[#306f65] text-white hover:text-[#306f65] hover:bg-white'}
                        `}
                    >
                        {showDelayedOnly ? '전체 보기' : '지연 배송만 보기'}
                    </button>
                </div>
            )}

            <div className="mb-5">
                <div className="bg-white border border-[#306f65] rounded-lg p-6">
                    <button 
                        onClick={toggleDateFilter}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300
                            ${showDateFilter
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-[#306f65] text-white hover:bg-[#58bcb5]'}
                        `}
                    >
                        {showDateFilter ? '날짜 필터 닫기' : '+ 날짜별 조회'}
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${showDateFilter ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        {showDateFilter && (
                            <div className="mb-5 text-center p-4 bg-gray-50 rounded-lg mt-4">
                                <label htmlFor="dateFilter" className="mr-3 font-bold">주문일 선택:</label>
                                <input
                                    type="date"
                                    id="dateFilter"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="px-3 py-2 border border-gray-300 rounded mr-2 focus:outline-none focus:border-[#306f65]"
                                />
                                {selectedDate && (
                                    <button 
                                        onClick={clearDateFilter}
                                        className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-2"
                                    >
                                        초기화
                                    </button>
                                )}
                                {selectedDate && (
                                    <div className="mt-10 text-gray-600">
                                        📅 {selectedDate} 주문건 조회
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliveryFilterSection;