// src/features/mypage/pages/MyPage.jsx

import React from 'react';
import MyPageHeader from '../components/MyPageHeader';
import MyPointSummary from '../components/MyPointSummary';
import MyOrderProgress from '../components/MyOrderProgress';

const MyPage = () => {
    const userData = { /* ... 임시 데이터 ... */ };

    return (
        <>
           
            <MyPageHeader />
            <MyPointSummary
                availablePoints={userData.availablePoints}
                // ...
            />
            <MyOrderProgress
                orderStatus={userData.orderStatus}
            />
        </>
    );
};

export default MyPage;