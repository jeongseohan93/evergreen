// features/admin/pages/salePage/SaleMemoModal.jsx
import React from 'react';

const SaleMemoModal = ({
    showMemoModal,
    selectedMemoData,
    closeMemoModal,
    formatCurrency
}) => {
    if (!showMemoModal || !selectedMemoData) return null;

    const renderMemoContent = () => {
        // ... (이전과 동일)
        if (selectedMemoData.offline_sales && selectedMemoData.offline_sales.length > 0) {
            // 일간 매출의 경우 해당 날짜의 모든 오프라인 매출과 메모
            return (
                <div className="memo-list space-y-3">
                    {selectedMemoData.offline_sales.map((sale, index) => (
                        <div key={index} className="memo-item border p-3 rounded-md bg-gray-50">
                            <div className="memo-header flex justify-between items-center mb-1">
                                <strong className="text-gray-800">오프라인 매출 #{index + 1}</strong>
                                <span className="flex items-center">
                                    <span className="text-sm font-bold text-[#306f65]">{formatCurrency(sale.offline_amount)}</span>
                                    <span className="text-sm font-bold text-black">원</span>
                                </span>
                            </div>
                            {sale.memo ? (
                                <div className="memo-text text-sm text-gray-600 whitespace-pre-wrap">
                                    {sale.memo}+
                                </div>
                            ) : (
                                <p className="no-memo text-sm text-gray-500 italic">메모 없음</p>
                            )}
                        </div>
                    ))}
                </div>
            );
        } else if (selectedMemoData.memos && selectedMemoData.memos.length > 0) {
            // 월간 매출의 경우 여러 메모
            return (
                <div className="memo-list space-y-3">
                    {selectedMemoData.memos.map((memoItem, index) => (
                        <div key={index} className="memo-item border p-3 rounded-md bg-gray-50">
                            <h5 className="font-medium text-gray-800 mb-1">{memoItem.date}</h5>
                            <div className="memo-text text-sm text-gray-600 whitespace-pre-wrap">
                                {memoItem.memo}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p className="no-memo text-gray-500 italic">메모가 없습니다.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeMemoModal}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold font-aggro">매출 메모</h3>
                    <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={closeMemoModal}>
                        &times;
                    </button>
                </div>
                {/* 이곳에 max-h-와 overflow-y-auto 클래스 추가 */}
                <div className="modal-body space-y-3 max-h-80 overflow-y-auto pr-2"> 
                    <p className="text-sm">
                        <strong>날짜:</strong> <span className="text-[#306f65]">{selectedMemoData.date || (selectedMemoData.month ? `${selectedMemoData.month}월` : '') || (selectedMemoData.year ? `${selectedMemoData.year}년` : '')}</span>
                    </p>
                    <p className="text-sm">
                        <strong>오프라인 매출:</strong> <span className="text-[#306f65]">{formatCurrency(selectedMemoData.offline_amount)}</span>
                        <span>원</span>
                    </p>
                    <div>
                        <h4 className="font-aggro font-bold mt-10">상세:</h4>
                        {renderMemoContent()}
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={closeMemoModal}
                        className="px-4 py-2 bg-[#306f65] text-white rounded-md text-sm"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaleMemoModal;