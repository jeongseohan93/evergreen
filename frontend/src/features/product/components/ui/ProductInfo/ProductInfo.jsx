// src/features/product/components/ui/ProductInfo/ProductInfo.jsx (최종 수정)
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ProductHeader from './ui/ProductHeader';
import PriceDisplay from './ui/PriceDisplay';
import ShippingDetails from './ui/ShippingDetails';
import DescriptionTags from './ui/DescriptionTags';
import QuantityInput from './ui/QuantityInput';
import TotalPriceSummary from './ui/TotalPriceSummary';
import PurchaseButton from './ui/PurchaseButton';

const ProductInfo = ({
    name, originalPrice, salePrice,
    shippingDomesticInternational, shippingMethod, shippingCost, shippingFreeCondition,
    tags,
}) => {
    // 🚨 product가 null일 때의 체크 및 이른 리턴 로직을 완전히 제거합니다.
    // 이제 이 컴포넌트는 모든 prop이 유효하게 전달된다고 가정하고 작동합니다.
    const navigate = useNavigate();
    const displayQuantity = 1;
    const displayTotalPrice = salePrice;

    const handleQuantityChange = (newQuantity) => {
        console.log("Quantity changed (not affecting state here):", newQuantity);
    };

    const handlePurchase = () => {
        navigate('/order');
    };

    const handleAddToCart = () => {
        navigate('/cart');
    }

    const handleToggleWishlist = () => {
        navigate('/wishlist');
    }

    return (
        <div className="w-full lg:w-1/2 p-4">
            <ProductHeader name={name} />
            <PriceDisplay originalPrice={originalPrice} salePrice={salePrice} />
            <ShippingDetails
                domesticInternational={shippingDomesticInternational}
                method={shippingMethod}
                cost={shippingCost}
                freeShippingCondition={shippingFreeCondition}
            />
            <DescriptionTags tags={tags} />
            <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="text-red-500 text-sm mb-2">! 수량을 선택해주세요.</p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-800 font-medium">{name}</span>
                    <QuantityInput quantity={displayQuantity} onQuantityChange={handleQuantityChange} />
                    <span className="text-gray-800 font-bold">
                        {displayTotalPrice.toLocaleString()}원
                    </span>
                </div>
            </div>
            <TotalPriceSummary total={displayTotalPrice} quantity={displayQuantity} />
            <PurchaseButton onPurchase={handlePurchase} />
            <div className="flex flex-row space-x-4 mt-6"> {/* flex-row는 기본값이지만 명시적으로 추가 */}
            {/* 장바구니 버튼 */}
            <button
                className="flex-1 py-3 px-6 rounded-lg text-lg font-bold
                           bg-blue-600 text-white
                           hover:bg-blue-700 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                           onClick={handleAddToCart}
            >
                장바구니
            </button>

            {/* 관심상품 버튼 */}
            <button
                className="flex-1 py-3 px-6 rounded-lg text-lg font-bold
                           bg-gray-200 text-gray-800
                           hover:bg-gray-300 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                           onClick={handleToggleWishlist}
            >
                관심상품
            </button>
        </div>
        </div>
    );
};

export default ProductInfo;