import React from 'react';

const PurchaseButton = ({ onPurchase }) => {
    return (
        <button
            className="w-full bg-gray-800 text-white py-3 rounded-lg text-lg font-bold mt-6 hover:bg-gray-700 transition-colors"
            onClick={onPurchase}
        >
            제품 구매하기
        </button>
    );
};

export default PurchaseButton;