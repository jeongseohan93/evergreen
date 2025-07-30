// frontend/src/features/mypage/pages/MyPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageHeader from '../components/MyPageHeader';
import MyOrderProgress from '../components/MyOrderProgress'; 
import { fetchMypageSummaryApi } from '../api/mypage'; 
import { useSelector } from 'react-redux';
import axios from 'axios'; 

const MyPage = () => {
    const [orderStatusCounts, setOrderStatusCounts] = useState(null);
    const [userSummary, setUserSummary] = useState(null); 
    // const [recentOrders, setRecentOrders] = useState(null); // ⭐ recentOrders 상태 제거
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userUuid = useSelector(state => state.auth.user?.user_uuid);

    useEffect(() => {
        const getMypageSummary = async () => {
            if (!userUuid) {
                setError('로그인이 필요합니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const backendDataPayload = await fetchMypageSummaryApi(); 
                
                console.log('MyPage.jsx - fetchMypageSummaryApi 반환값 (backendDataPayload):', backendDataPayload);

                if (backendDataPayload && typeof backendDataPayload === 'object') {
                    setOrderStatusCounts(backendDataPayload.orderStatusCounts); 
                    setUserSummary(backendDataPayload.userSummary);
                    // setRecentOrders(backendDataPayload.recentOrders); // ⭐ recentOrders 상태 업데이트 로직 제거
                } else {
                    setError('API 응답 데이터 형식이 올바르지 않습니다.');
                    console.error('API 응답 데이터 형식이 올바르지 않습니다:', backendDataPayload);
                }

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message || '데이터를 불러오는 데 실패했습니다.');
                    console.error('Failed to fetch mypage summary - AxiosError:', err.response?.data || err.message);
                } else {
                    setError(err.message || '데이터를 불러오는 데 실패했습니다.');
                    console.error('Failed to fetch mypage summary:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        getMypageSummary();
    }, [userUuid]);

    if (loading) {
        return <div className="text-center py-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">에러: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <MyPageHeader userSummary={userSummary} /> 
            
            {orderStatusCounts && <MyOrderProgress orderStatus={orderStatusCounts} />}
            
            {/* '나의 최근 주문' 섹션이 삭제되었습니다. */}
            {/* 필요하다면 여기에 다른 마이페이지 콘텐츠를 추가할 수 있습니다. */}
        </div>
    );
};

export default MyPage;