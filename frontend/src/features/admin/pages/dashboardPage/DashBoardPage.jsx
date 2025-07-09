// src/features/admin/pages/dashboardPage/DashBoardPage.jsx

import React from 'react';
// useDashboardStats 훅의 경로를 현재 컴포넌트 위치에 맞춰 조정합니다.
// pages/dashboardPage에서 components/dashboard/hooks/useDashboardStats까지의 상대 경로
import useDashboardStats from '../../components/dashboard/hooks/useDashboardStats'; 

const DashBoardPage = () => {
    // useDashboardStats 훅을 호출하여 필요한 상태와 함수들을 가져옵니다.
    const { stats, loading, error, todayDate, fetchStats } = useDashboardStats();

    // 숫자를 한국 화폐 단위로 포맷하는 헬퍼 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    // 로딩 상태 처리
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-600">
                <p>대시보드 데이터를 불러오는 중...</p>
                {/* 필요하다면 로딩 스피너 추가 */}
            </div>
        );
    }

    // 에러 상태 처리
    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>대시보드 데이터를 불러오는 데 실패했습니다: {error}</p>
                <button
                    onClick={fetchStats} // 에러 시 새로고침 버튼
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 데이터가 성공적으로 로드되었을 때 UI 렌더링
    return (
        <div className="p-6">
           <br/> <h1> 프론트엔드 마스터가 되었음에, 기뻐하는 정서한의 모습</h1> <br/><br/><br/><br/>
            <p className="text-gray-600 mb-6">정서한이 프론트 다 해주면 좋겠다.</p>
          <p className="text-xl font-semibold text-gray-700 mb-4"> {todayDate}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* 총 상품 수 카드 */}
                <div className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col justify-between items-start">
                    <h3 className="text-lg font-semibold text-blue-800">총 상품 수</h3>
                    <p className="text-4xl font-bold text-blue-700 mt-2">{stats.totalProducts.toLocaleString()}</p>
                </div>

                {/* 오늘의 주문 카드 */}
                <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col justify-between items-start">
                    <h3 className="text-lg font-semibold text-green-800">오늘의 주문</h3>
                    <p className="text-4xl font-bold text-green-700 mt-2">{stats.todayOrders.toLocaleString()}</p>
                </div>

                {/* 오늘의 매출 카드 */}
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col justify-between items-start">
                    <h3 className="text-lg font-semibold text-yellow-800">오늘의 매출</h3>
                    <p className="text-4xl font-bold text-yellow-700 mt-2">{formatCurrency(stats.todaySales)}</p>
                </div>

              
            </div>

        </div>
    );
};

export default DashBoardPage;
