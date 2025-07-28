// src/pages/FindIdResultPage.js

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, Footer, SubHeader } from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';

const FindIdResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // location.state에서 찾은 아이디(userId)를 가져옵니다.
    // state가 없는 경우(직접 URL로 접근 등)를 대비해 optional chaining(?.)을 사용합니다.
    const userId = location.state?.userId;

    // 만약 전달받은 아이디가 없다면, 아이디 찾기 페이지로 돌려보냅니다.
    useEffect(() => {
        if (!userId) {
            alert('잘못된 접근입니다. 아이디 찾기를 다시 시도해주세요.');
            navigate('/find-id');
        }
    }, [userId, navigate]);


    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <main className="flex flex-col items-center justify-center w-full px-4 py-16 bg-white">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-3xl font-bold mb-4">아이디 찾기 결과</h1>
                    <p className="text-gray-600 mb-10">요청하신 계정의 아이디를 확인해주세요.</p>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 mb-10">
                        <p className="text-lg">회원님의 아이디는</p>
                        <p className="text-2xl font-bold text-blue-600 my-2">{userId}</p>
                        <p className="text-lg">입니다.</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="py-3 px-12 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 transition-colors"
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => navigate('/findpassword')}
                            className="py-3 px-12 bg-gray-200 text-gray-800 text-lg font-bold rounded-md hover:bg-gray-300 transition-colors"
                        >
                            비밀번호 찾기
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default FindIdResultPage;