// features/admin/pages/salePage/SaleAddForm.jsx
import React from 'react';

const SaleAddForm = ({
    newSale,
    handleSaleInputChange,
    handleAddSale,
    loading,
    error,
    toggleSaleForm, // 폼 닫기용
    selectSaleDateToday
}) => {

    // 폼 제출 핸들러 정의
    const onSubmitForm = (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        // handleAddSale 함수에 이벤트 객체(e)와 함께 현재의 newSale 객체를 전달
        handleAddSale(e, newSale); 
    };

    return (
        <div className="sale-form-section">
            <h3 className="text-xl font-semibold mb-3">매출 입력</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="sale-form">
                <form onSubmit={onSubmitForm}> {/* onSubmit 핸들러를 onSubmitForm으로 변경 */}
                    <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                            <label htmlFor="sale_date" className="block text-sm font-medium text-gray-700">날짜 선택:</label>
                            <div className="date-button-selector flex items-center space-x-2 mt-1">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                                    onClick={selectSaleDateToday}
                                >
                                    오늘
                                </button>
                                <input
                                    type="date" // type을 date로 변경하여 달력 UI 활용
                                    id="sale_date"
                                    name="sale_date"
                                    value={newSale.sale_date}
                                    onChange={handleSaleInputChange}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="offline_amount" className="block text-sm font-medium text-gray-700">오프라인 매출:</label>
                            <input
                                type="number"
                                id="offline_amount"
                                name="offline_amount"
                                value={newSale.offline_amount}
                                onChange={handleSaleInputChange}
                                placeholder="오프라인 매출 금액"
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="memo" className="block text-sm font-medium text-gray-700">메모:</label>
                        <textarea
                            id="memo"
                            name="memo"
                            value={newSale.memo}
                            onChange={handleSaleInputChange}
                            placeholder="메모 (선택사항)"
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="form-actions flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={toggleSaleForm}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                            disabled={loading}
                        >
                            취소
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm">
                            {loading ? '처리 중...' : '매출 저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaleAddForm;