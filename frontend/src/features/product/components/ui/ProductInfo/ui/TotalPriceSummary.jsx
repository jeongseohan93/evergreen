import React from 'react';

const TotalPriceSummary = ({ total, quantity }) => {
    return (
        <div className="flex items-center justify-end mt-4 pr-1"> {/* 스크린샷처럼 오른쪽 여백 약간 주기 */}
            <span className="text-xl font-extrabold text-gray-900">
                TOTAL {total.toLocaleString()}원
            </span>
            <span className="text-sm text-gray-600 ml-2">({quantity}개)</span>
        </div>
    );
};

export default TotalPriceSummary;