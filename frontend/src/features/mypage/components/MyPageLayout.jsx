// src/features/mypage/pages/MyPageLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import MyPageNavGrid from '../components/MypageNavGrid'; // 메뉴 컴포넌트
import { Header, SubHeader, Footer } from '@/app';

const MyPageLayout = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                {/* 마이페이지 공통 메뉴 */}
                <MyPageNavGrid />

                {/* 👇 메뉴 클릭 시 이 Outlet 부분의 내용만 바뀝니다. */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPageLayout;