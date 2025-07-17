// src/features/admin/components/order/DeliveryFilterSection.jsx

import React, { useState } from 'react';

const DeliveryFilterSection = ({
    delayStats,
    showDelayedOnly,
    showDateFilter,
    selectedDate,
    toggleDelayedFilter,
    toggleDateFilter,
    handleDateChange,
    clearDateFilter,
    searchKeyword, // 추가
    onSearchKeywordChange, // 추가
    onSearch, // 추가
    onClearSearch // 추가
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
                        {showDateFilter ? '검색 필터 닫기' : '+ 배송 검색'}
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${showDateFilter ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        {showDateFilter && (
                            <div className="mb-5 text-center p-4 bg-gray-50 rounded-lg mt-4 flex flex-row items-center justify-center gap-4">
                                {/* 배송 검색 UI */}
                                <div className="flex gap-2 w-full max-w-lg items-center">
                                    <input
                                        type="text"
                                        placeholder="받는 분, 운송번호, 고객 전화번호 등 입력"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                                        value={searchKeyword}
                                        onChange={onSearchKeywordChange}
                                        onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
                                    />
                                    <button
                                        className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
                                        onClick={onSearch}
                                    >
                                        검색
                                    </button>
                                    <button
                                        className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-gray-400 hover:bg-gray-500"
                                        onClick={onClearSearch}
                                    >
                                        초기화
                                    </button>
                                </div>
                                {/* 주문일 선택 UI */}
                                <div className="flex items-center ml-4">
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
                                </div>
                            </div>
                        )}
                        <div className="w-full text-center text-sm text-gray-400 mt-2">제명된 회원의 주문은 조회되지 않습니다.</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliveryFilterSection;