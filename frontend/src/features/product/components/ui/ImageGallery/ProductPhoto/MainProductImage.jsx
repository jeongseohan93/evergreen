import React from 'react';
const MainProductImage = ({ imageUrl }) => { // className props를 추가하여 유연하게 사용
    return (
        // 🚨 이 div도 flex items-center justify-center를 유지하며 이미지를 중앙에 배치합니다.
        // 전달받은 className을 추가하여 외부에서 크기를 제어할 수 있도록 합니다.
        <div className={`relative mb-4 flex items-center justify-center bg-gray-100`}>
            <img
                src={imageUrl}
                alt="메인 상품 이미지"
                // 🚨 이미지가 부모 컨테이너에 맞게 채워지도록 object-contain 또는 object-cover 선택
                // object-contain을 사용하면 이미지가 잘리지 않고 전체가 보이며, 여백이 생길 수 있습니다.
                // object-cover를 사용하면 이미지가 컨테이너를 꽉 채우지만, 일부가 잘릴 수 있습니다.
                className="w-full h-full object-contain rounded-lg shadow-md"
            />
            {/* 스크린샷의 "LIKE 0"과 "마우스를 올려보세요" 박스는 이 이미지 위에 absolute로 배치할 수도 있습니다. */}
        </div>
    );
};

export default MainProductImage;