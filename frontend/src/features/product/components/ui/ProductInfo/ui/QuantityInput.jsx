import React from 'react';

const QuantityInput = ({ quantity, onQuantityChange }) => {
    return (
        <div className="flex items-center border border-gray-300 rounded">
            <button
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onQuantityChange(quantity - 1)}
                disabled={quantity <= 1} // 수량이 1 미만으로 내려가지 않도록 비활성화
            >-</button>
            <input
                type="number"
                value={quantity}
                readOnly // 사용자가 직접 입력하지 못하도록 readOnly 설정
                className="w-12 text-center border-l border-r border-gray-300 outline-none text-gray-800"
            />
            <button
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => onQuantityChange(quantity + 1)}
            >+</button>
        </div>
    );
};

export default QuantityInput;