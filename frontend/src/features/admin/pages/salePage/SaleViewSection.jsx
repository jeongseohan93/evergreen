// features/admin/pages/salePage/SaleViewSection.jsx
import React from 'react';

const SaleViewSection = ({
    salesData,
    selectedSalePeriod,
    setSelectedSalePeriod,
    selectedSaleYear,
    selectedSaleMonth,
    handleYearChange,
    handleMonthSelect,
    selectToday,
    selectThisMonth,
    formatCurrency,
    openMemoModal, // 이 prop은 여전히 필요하지만, 연간일 때는 호출하지 않음
    loading,
    error
}) => {
    return (
        <div className="p-4 rounded-lg bg-white border border-[#306f65]">
            <h3 className="text-xl font-bold mb-3 font-aggro">매출 조회</h3>
            {loading && <p className="text-gray-600 mb-2">매출 데이터 불러오는 중...</p>}
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="sale-controls flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
                <div className="period-selector flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md text-sm ${selectedSalePeriod === 'daily' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-800 border hover:border-[#306f65] hover:bg-white hover:text-[#306f65]'}`}
                        onClick={() => setSelectedSalePeriod('daily')}
                    >
                        일간
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm ${selectedSalePeriod === 'monthly' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-800 border hover:border-[#306f65] hover:bg-white hover:text-[#306f65]'}`}
                        onClick={() => setSelectedSalePeriod('monthly')}
                    >
                        월간
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm ${selectedSalePeriod === 'yearly' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-800 border hover:border-[#306f65] hover:bg-white hover:text-[#306f65]'}`}
                        onClick={() => setSelectedSalePeriod('yearly')}
                    >
                        연간
                    </button>
                </div>

                {selectedSalePeriod === 'daily' && (
                    <div className="date-button-selector flex items-center space-x-2">
                        <div className="year-selector flex items-center space-x-1">
                            <button
                                className="px-2 py-1.5 bg-[#58bcb5] text-white rounded hover:bg-[#306f65] text-sm"
                                onClick={() => handleYearChange('prev')}
                            >
                                ◀
                            </button>
                            <span className="current-year font-semibold text-gray-800">{selectedSaleYear}년</span>
                            <button
                                className="px-2 py-1.5 bg-[#58bcb5] text-white rounded hover:bg-[#306f65] text-sm"
                                onClick={() => handleYearChange('next')}
                            >
                                ▶
                            </button>
                        </div>
                        <select
                            value={selectedSaleMonth}
                            onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded-md text-sm focus:border-[#306f65]"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                <option key={month} value={month}>
                                    {month}월
                                </option>
                            ))}
                        </select>
                        <button
                            className="px-3 py-2 bg-[#306f65] hover:bg-[#26574f] text-white rounded-md text-sm"
                            onClick={selectToday}
                        >
                            오늘
                        </button>
                    </div>
                )}

                {selectedSalePeriod === 'monthly' && (
                    <div className="date-button-selector flex items-center space-x-2">
                        <div className="year-selector flex items-center space-x-1">
                            <button
                                className="px-2 py-1.5 bg-[#58bcb5] text-white rounded hover:bg-[#306f65] text-sm"
                                onClick={() => handleYearChange('prev')}
                            >
                                ◀
                            </button>
                            <span className="current-year font-semibold text-gray-800">{selectedSaleYear}년</span>
                            <button
                                className="px-2 py-1.5 bg-[#58bcb5] text-white rounded hover:bg-[#306f65] text-sm"
                                onClick={() => handleYearChange('next')}
                            >
                                ▶
                            </button>
                        </div>
                        <button
                            className="px-3 py-2 bg-[#306f65] hover:bg-[#26574f] text-white rounded-md text-sm"
                            onClick={selectThisMonth}
                        >
                            이번 년도
                        </button>
                    </div>
                )}
            </div>

            {/* 매출 데이터 표시 */}
            <div className="sale-data overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                                {selectedSalePeriod === 'daily' ? '날짜' : selectedSalePeriod === 'monthly' ? '월' : '년도'}
                            </th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">온라인 매출</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">오프라인 매출</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">취소 매출</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">총 매출</th>
                            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">주문 수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData[selectedSalePeriod].length === 0 && !loading && !error ? (
                            <tr>
                                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">데이터가 없습니다.</td>
                            </tr>
                        ) : (
                            salesData[selectedSalePeriod].map((sale, index) => (
                                <tr key={index} className="border-b last:border-b-0">
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        {selectedSalePeriod === 'daily' ? sale.date :
                                         selectedSalePeriod === 'monthly' ? `${sale.month}월` :
                                         `${sale.year}년`}
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{formatCurrency(sale.online_amount)}원</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        {/* 오프라인 매출 렌더링 로직 수정 */}
                                        {selectedSalePeriod === 'yearly' ? (
                                            // 연간일 경우 일반 텍스트로 표시
                                            formatCurrency(sale.offline_amount) + '원'
                                        ) : (
                                            // 일간 또는 월간일 경우 버튼으로 표시 (기존 로직 유지)
                                            <button
                                                className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                                                onClick={() => openMemoModal(sale, selectedSalePeriod)} // openMemoModal에 periodType 전달
                                                disabled={!sale.offline_amount || sale.offline_amount === 0}
                                            >
                                                {formatCurrency(sale.offline_amount)}원
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{formatCurrency(sale.cancel_amount)}원</td>
                                    <td className="py-2 px-4 text-sm text-gray-700 font-semibold">{formatCurrency(sale.total_amount)}원</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{sale.order_count}건</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SaleViewSection;