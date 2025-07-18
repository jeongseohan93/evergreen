// src/features/product/components/ui/ProductInfo/ProductInfo.jsx (최종 수정)

import React from 'react';

// ✅ 부모로부터 받은 quantity, setQuantity, onAddToCart를 props로 받습니다.
const ProductInfo = ({
    name,
    originalPrice,
    salePrice,
    shippingCost,
    tags,
    quantity,
    setQuantity,
    onAddToCart,
    onPurchase 
}) => {
    const totalPrice = salePrice * quantity; // 총 가격을 수량에 맞춰 계산

    // ✅ 수량 변경 핸들러
    const handleQuantityChange = (amount) => {
        // 부모가 내려준 setQuantity를 호출하여 실제 상태를 변경
        setQuantity(prev => Math.max(1, prev + amount)); // 최소 수량은 1
    };

    return (
        <div className="w-full lg:w-1/2 p-8 flex flex-col">
            {/* 상품명, 가격, 배송정보 등은 props로 받은 데이터를 표시 */}
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <div className="mb-6">
                <span className="text-xl text-gray-400 line-through mr-3">{originalPrice.toLocaleString()}원</span>
                <span className="text-3xl font-bold text-red-600">{salePrice.toLocaleString()}원</span>
            </div>
            {/* ... (다른 정보들) ... */}
            
            <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-800 font-medium">{name}</span>
                    {/* 수량 변경 UI */}
                    <div className="flex items-center">
                        <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 border">-</button>
                        <input type="number" value={quantity} readOnly className="w-12 h-8 text-center border-t border-b" />
                        <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 border">+</button>
                    </div>
                </div>
            </div>

            {/* 총 상품 금액 */}
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-bold">총 상품 금액</span>
                <span className="text-2xl font-bold text-red-500">{totalPrice.toLocaleString()}원</span>
            </div>

            <button
                onClick={onPurchase}
                className="w-full py-4 mt-6 rounded-lg text-lg font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
                주문하기
            </button>

            {/* 구매, 장바구니, 관심상품 버튼 */}
            <div className="flex space-x-4 mt-6">
                {/* ✅ 장바구니 버튼 클릭 시, 부모로부터 받은 onAddToCart 함수를 실행합니다. */}
                <button
                    onClick={onAddToCart}
                    className="flex-1 py-3 px-6 rounded-lg text-lg font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                    장바구니 담기
                </button>
                <button className="flex-1 py-3 px-6 rounded-lg text-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300">
                    관심상품 담기
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;