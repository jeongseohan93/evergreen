// src/components/ui/ProductCard/ProductCard.jsx

import React from 'react';

const ProductCard = ({
  imageSrc,
  productName,
  price,
  hashtags,
}) => {
  // 가격을 한글 원화 포맷으로 변환 (예: 220,000원)
  const formattedPrice = price.toLocaleString('ko-KR') + '원';

  return (
    // productCard: flex, flex-col, items-center, w-full, max-w-xs (조절 가능),
    //                border, rounded-lg, p-4, shadow-md, transition, transform, hover:-translate-y-1, bg-white, cursor-pointer
    <div className="flex flex-col items-center w-full max-w-xs border border-gray-200 rounded-lg p-4 shadow-md transition-transform duration-200 hover:-translate-y-1 bg-white cursor-pointer">
      {/* productImageWrapper: w-full, h-48 (높이 조절), overflow-hidden, rounded-md, mb-3, relative (object-cover 사용 시) */}
      <div className="w-full h-48 overflow-hidden rounded-md mb-3 relative">
        {/* productImage: w-full, h-full, object-cover */}
        <img
          src={imageSrc}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      {/* productName: text-lg, font-bold, mb-1, text-gray-800, text-center, break-words, leading-tight */}
      <h3 className="text-lg font-bold mb-1 text-gray-800 text-center break-words leading-tight">
        {productName}
      </h3>
      {/* productPrice: text-xl, font-bold, text-red-500 (이미지 색상 참고), mb-4, text-center */}
      <p className="text-xl font-bold text-red-500 mb-4 text-center">
        {formattedPrice}
      </p>
      {/* productHashtags: flex, flex-wrap, justify-center, gap-1, w-full, px-1 */}
      <div className="flex flex-wrap justify-center gap-1 w-full px-1">
        {hashtags.map((tag, index) => (
          // hashtag: bg-gray-100, text-gray-600, px-2, py-1, rounded, text-sm, whitespace-nowrap
          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;