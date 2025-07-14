// src/components/CardBundle.jsx

import React from 'react';
import { ProductCard } from '@/shared'; // 경로에 맞게 수정하세요
import tempImage from '@/assets/image/temp.png'

const CardBundle = () => {
    return (
        <div className="p-4 flex justify-center gap-10">
            {/* props를 올바른 데이터 타입으로 전달합니다. */}
            <ProductCard 
                imageUrl={tempImage} 
                name="낚시대" 
                price={20000}             // 숫자로 전달
                hashtags={['#머시기']}
                likes = {1}    // 배열로 전달
            />
        </div>
    )
}

export default CardBundle;