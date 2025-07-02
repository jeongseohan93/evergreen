import React from 'react';

const PriceDisplay = ({ originalPrice, salePrice }) => {
    return (
        <div className="mb-4">
            <p className="text-sm text-gray-500 line-through">소비자가 {originalPrice.toLocaleString()}원</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">판매가 {salePrice.toLocaleString()}원</p>
        </div>
    );
};

export default PriceDisplay;