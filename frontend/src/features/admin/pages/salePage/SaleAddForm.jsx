// features/admin/pages/salePage/SaleAddForm.jsx
import React from 'react';

const SaleAddForm = ({
    newSale,
    handleSaleInputChange,
    handleAddSale,
    loading,
    error,
    toggleSaleForm,
    selectSaleDateToday
}) => {
    const onSubmitForm = (e) => {
        e.preventDefault();
        handleAddSale(e, newSale);
    };

    return (
        <div className="mb-6 p-6 bg-white rounded-lg">
            <form onSubmit={onSubmitForm} className="mt-2 space-y-4">
                <h3 className="text-2xl font-bold font-aggro text-gray-800 mb-4">매출 입력</h3>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="sale_date" className="block text-sm font-medium text-[#58bcb5] mb-2">날짜 *</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                id="sale_date"
                                name="sale_date"
                                value={newSale.sale_date}
                                onChange={handleSaleInputChange}
                                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent text-sm"
                                required
                            />
                            <button
                                type="button"
                                className="px-3 py-2 bg-[#306f65] hover:bg-[#26574f] text-white rounded-md text-sm"
                                onClick={selectSaleDateToday}
                            >
                                오늘
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="offline_amount" className="block text-sm font-medium text-[#58bcb5] mb-2">오프라인 매출 *</label>
                        <input
                            type="number"
                            id="offline_amount"
                            name="offline_amount"
                            value={newSale.offline_amount}
                            onChange={handleSaleInputChange}
                            placeholder="오프라인 매출 금액"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent text-sm"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                    <textarea
                        id="memo"
                        name="memo"
                        value={newSale.memo}
                        onChange={handleSaleInputChange}
                        placeholder="메모 (선택사항)"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent text-sm"
                    />
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
                    >
                        {loading ? '처리 중...' : '매출 저장'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SaleAddForm;