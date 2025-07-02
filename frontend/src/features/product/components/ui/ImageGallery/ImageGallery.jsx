// ProductImageGallery.jsx (수정된 버전)
import React, { useState } from 'react';
// MainProductImage 컴포넌트만 필요합니다.
// ProductThumbnailList는 이제 사용하지 않으므로 import에서 제거합니다.
import MainProductImage from './ProductPhoto/MainProductImage';

const ImageGallery = ({imageUrl}) => {
    // 썸네일 목록이 없으므로, images 배열의 첫 번째 이미지를 항상 메인 이미지로 사용합니다.
    // images 배열이 비어있지 않다고 가정합니다.


    // handleThumbnailClick 함수는 더 이상 필요하지 않습니다.
    // const handleThumbnailClick = (image) => {
    //     setMainImage(image);
    // };

    return (
        // 🚨 이 div의 w-full lg:w-1/2 p-4는 그대로 두고,
        // 이 안에 있는 MainProductImage가 내부 공간을 채우도록 합니다.
        // 스크린샷의 비율을 고려하여 h-auto 또는 특정 높이를 주면 좋습니다.
        <div className="w-full lg:w-1/2 p-4">
            {/* 🚨 MainProductImage에 flex-grow를 주어 남은 공간을 최대한 차지하게 합니다. */}
            {/* height도 명시적으로 설정하여 이미지 컨테이너의 크기를 결정합니다. */}
            <MainProductImage imageUrl={imageUrl} className="flex-grow h-[450px] lg:h-[550px]" />
            {/* 위에 설정된 height는 예시입니다. 실제 이미지와 레이아웃에 맞춰 조정해주세요. */}

            {/* ProductThumbnailList는 완전히 제거됩니다. */}
            {/* <ProductThumbnailList
                thumbnails={images}
                onThumbnailClick={handleThumbnailClick}
                activeThumbnail={mainImage}
            /> */}

            {/* "LIKE 0"과 "마우스를 올려보세요" 박스는 스크린샷 위치에 맞게 조정 */}
            {/* 이 부분은 MainProductImage 내부에 absolute로 배치하는 것이 더 정확할 수 있습니다. */}
            <div className="text-sm text-gray-500 mt-2">
                <span className="font-bold">LIKE 0</span> (좋아요 아이콘 등)
            </div>
            <div className="text-xs text-gray-400 mt-1">
                <span className="bg-black text-white px-2 py-1 rounded-full inline-block">마우스를 올려보세요.</span>
            </div>
        </div>
    );
};

export default ImageGallery;


