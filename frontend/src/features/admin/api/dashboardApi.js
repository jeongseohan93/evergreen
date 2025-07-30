// src/features/admin/api/dashboardApi.js

import { apiService } from '@/shared'; // apiService 임포트
// 더 이상 getAllProducts를 여기서 직접 호출하지 않으므로 productApi 임포트는 제거합니다.
// import { getAllProducts } from './productApi'; 

// 대시보드 요약 통계 데이터를 서버로부터 불러오는 함수
// 이제 이 함수가 모든 대시보드 통계(총 상품 수, 오늘의 주문/매출/신규 회원)를
// 단일 /admin/dashboard/summary 엔드포인트에서 가져옵니다.
export const fetchDashboardSummary = async () => {
    try {
        // 모든 대시보드 통계 데이터를 가져올 단일 백엔드 API 엔드포인트 호출
        // 백엔드에서는 이 엔드포인트에서 totalProducts, todayOrders, todaySales, newMembers를 모두 반환해야 합니다.
        const response = await apiService.get('/admin/dashboard/summary');

        
        // response.data.data에 모든 통계 데이터가 포함되어 있다고 가정합니다.
        if (response.status === 200 && response.data && response.data.data) {
            return {
                success: true,
                data: {
                    totalProducts: response.data.data.totalProducts || 0,
                    todayOrders: response.data.data.todayOrders || 0,
                    todaySales: response.data.data.todaySales || 0,
                    newMembers: response.data.data.newMembers || 0,
                },
                message: response.data.message || '대시보드 통계 데이터를 성공적으로 불러왔습니다.'
            };
        } else {
            // 응답이 성공적이지 않거나 데이터 구조가 예상과 다를 경우
            return {
                success: false,
                message: response.data?.message || '대시보드 통계 데이터를 불러오는 데 실패했습니다.'
            };
        }
    } catch (error) {
        console.error('API Error: fetchDashboardSummary', error);
        // 에러 발생 시 { success: false, message: ... } 형태로 반환하여 훅에서 처리하기 용이하게
        return { success: false, message: error.response?.data?.message || error.message || '대시보드 통계 데이터를 불러오는 데 실패했습니다.' };
    }
};
