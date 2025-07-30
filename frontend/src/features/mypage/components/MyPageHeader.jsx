import React from 'react';

const MyPageHeader = () => {
    return (
        // ⭐ flex justify-center와 py-8을 추가하여 제목을 가운데 정렬하고 상하 여백을 늘렸습니다. ⭐
        <div className="flex justify-center mb-8 py-8"> 
            <h1 className="text-4xl font-bold text-gray-800">나의 주문 정보</h1>
        </div>
    );
};

export default MyPageHeader;
