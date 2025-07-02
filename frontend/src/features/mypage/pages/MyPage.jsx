// src/features/mypage/pages/MyPage.jsx
import React from 'react';
import { Header, SubHeader, Footer } from '@/app'; // Header, Footer는 이미 있다고 가정

import MyPageHeader from '../components/MyPageHeader';
import MyPointSummary from '../components/MyPointSummary';
import MyOrderProgress from '../components/MyOrderProgress';
import MyPageNavGrid from '../components/MypageNavGrid';

const MyPage = () => {
    // 실제로는 사용자 데이터 (적립금, 주문 현황 등)를 API로 받아와야 합니다.
    // 여기서는 UI 구현을 위해 임시 데이터를 하드코딩합니다.
    const userData = {
        availablePoints: 1000,
        totalPoints: 1000,
        usedPoints: 0,
        totalOrders: { count: 0, times: 0 }, // 0(0회)

        orderStatus: {
            beforeDeposit: 0,
            preparingDelivery: 0,
            shipping: 0,
            delivered: 0,
            canceled: 0,
            exchanged: 0,
            returned: 0,
        },
    };

    return (
        <>
            <Header />
            {/* SubHeader가 있다면 여기에 추가 */}
            <SubHeader />

            <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                {/* MY PAGE 헤더 및 타이틀 */}
                <MyPageHeader />

                {/* 포인트/주문 요약 섹션 */}
                <MyPointSummary
                    availablePoints={userData.availablePoints}
                    totalPoints={userData.totalPoints}
                    usedPoints={userData.usedPoints}
                    totalOrders={userData.totalOrders}
                />

                {/* 나의 주문처리 현황 섹션 */}
                <MyOrderProgress
                    orderStatus={userData.orderStatus}
                />

                {/* 하단 내비게이션 그리드 */}
                <MyPageNavGrid />
            </div>

            <Footer />
        </>
    );
};

export default MyPage;