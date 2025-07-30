import React from 'react';
import MainProductImage from './ProductPhoto/MainProductImage';

const ImageGallery = ({imageUrl}) => {
   
    return (
       
        <div className="w-full p-4"> {/* 여기서 더 이상 lg:w-1/2는 필요 없습니다. 상위에서 이미 너비가 정해졌기 때문입니다. */}
            
            <MainProductImage 
                imageUrl={imageUrl} 
                // 이미지 높이를 이전보다 줄입니다. 필요에 따라 더 조절하세요.
                className="flex-grow h-[400px] lg:h-[500px]" 
            />
            
        </div>
    );
};

export default ImageGallery;