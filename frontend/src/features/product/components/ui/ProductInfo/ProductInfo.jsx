import React from 'react';

const ProductInfo = ({
    name,
    originalPrice,
    salePrice,
    tags,
    quantity,
    setQuantity,
    onAddToCart,
    onPurchase,
    onAddWishList,
    brand,
    sub2_category_name,
    model_name,
    deposit // 적립금 prop 추가
}) => {
    const totalPrice = salePrice * quantity;

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount)); // 최소 수량은 1
    };

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <div className="flex items-baseline mb-4">
                {originalPrice > salePrice && (
                    <span className="text-xl text-gray-400 line-through mr-2">{originalPrice.toLocaleString()}원</span>
                )}
                <span className="text-4xl font-extrabold text-red-600">{salePrice.toLocaleString()}원</span>
            </div>

            {/* 원산지, 적립금, 브랜드, 모델 정보 섹션 - 간격 재조정 */}
            <div className="border-b border-gray-200 py-2 mb-4">
                {brand && (
                    <div className="flex text-gray-700 text-base mb-1"> {/* 'text-sm' -> 'text-base'로 복귀, px-1 제거 */}
                        <span className="font-semibold w-28 flex-shrink-0">원산지</span> {/* w-24 -> w-28로 너비 증가 */}
                        <span>{brand}</span>
                    </div>
                )}
                {deposit && ( // 적립금 추가
                    <div className="flex text-gray-700 text-base mb-1">
                        <span className="font-semibold w-28 flex-shrink-0">적립금</span>
                        <span>{deposit.toLocaleString()}원</span>
                    </div>
                )}
                {sub2_category_name && (
                    <div className="flex text-gray-700 text-base mb-1">
                        <span className="font-semibold w-28 flex-shrink-0">브랜드</span>
                        <span>{sub2_category_name}</span>
                    </div>
                )}
                {model_name && (
                    <div className="flex text-gray-700 text-base mb-1">
                        <span className="font-semibold w-28 flex-shrink-0">모델</span> {/* '모델명' -> '모델'로 변경 */}
                        <span>{model_name}</span>
                    </div>
                )}
            </div>

            {/* 태그 섹션 */}
            {tags && tags.length > 0 && (
                <div className="border-b border-gray-200 py-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-800">수량</span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="수량 감소"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-16 h-10 text-center text-lg font-medium text-gray-800 border-l border-r border-gray-300 focus:outline-none"
                    />
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="수량 증가"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 p-4 bg-blue-50 rounded-lg shadow-inner">
                <span className="text-xl font-bold text-gray-800">총 상품 금액</span>
                <span className="text-3xl font-extrabold text-blue-700">{totalPrice.toLocaleString()}원</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                    onClick={onPurchase}
                    className="flex-1 py-4 rounded-lg text-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                >
                    바로 구매
                </button>
                <button
                    onClick={onAddToCart}
                    className="flex-1 py-4 rounded-lg text-lg font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md"
                >
                    장바구니 담기
                </button>
                <button
                    onClick={onAddWishList}
                    className="flex-1 py-4 rounded-lg text-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-md"
                >
                    <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                    관심상품
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;