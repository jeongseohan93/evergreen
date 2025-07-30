// frontend/src/features/mypage/api/mypage.js
import { apiService } from "@/shared";
import store from '../../../app/store'; // ⭐ Redux Store 임포트 경로 확인

// 마이페이지 대시보드 요약 정보를 가져오는 함수
export const fetchMypageSummaryApi = async () => {
    try {
        const state = store.getState();
        const userUuid = state.auth.user?.user_uuid; // Redux store에서 user_uuid 가져오기

        if (!userUuid) {
            // user_uuid가 없으면 프론트엔드에서 에러를 발생시켜 처리
            throw new Error('사용자 UUID를 찾을 수 없습니다. 로그인 상태를 확인하세요.');
        }

        // 백엔드 API: GET /api/mypage?userUuid=...
        const response = await apiService.get(`/mypage?userUuid=${userUuid}`); // ⭐ userUuid를 쿼리 파라미터로 추가
        return response.data.data;
    } catch (error) {
        console.error('마이페이지 요약 정보 불러오기 실패:', error.response?.data?.message || error.message);
        throw error;
    }
};

// 모든 주문 목록을 가져오는 함수
export const fetchAllOrdersApi = async () => {
    try {
        const state = store.getState();
        const userUuid = state.auth.user?.user_uuid; // Redux store에서 user_uuid 가져오기

        if (!userUuid) {
            throw new Error('사용자 UUID를 찾을 수 없습니다. 로그인 상태를 확인하세요.');
        }

        // 백엔드 API: GET /api/mypage/orders?userUuid=...
        const response = await apiService.get(`/mypage/orders?userUuid=${userUuid}`); // ⭐ userUuid를 쿼리 파라미터로 추가
        return response.data.data;
    } catch (error) {
        console.error('주문 목록 불러오기 실패:', error.response?.data?.message || error.message);
        throw error;
    }
};

// 특정 주문 상세 정보를 가져오는 함수
export const fetchOrderDetailApi = async (orderId) => {
    try {
        const state = store.getState();
        const userUuid = state.auth.user?.user_uuid; // Redux store에서 user_uuid 가져오기

        if (!userUuid) {
            throw new Error('사용자 UUID를 찾을 수 없습니다. 로그인 상태를 확인하세요.');
        }

        // 백엔드 API: GET /api/mypage/orders/:orderId?userUuid=...
        const response = await apiService.get(`/mypage/orders/${orderId}?userUuid=${userUuid}`); // ⭐ userUuid를 쿼리 파라미터로 추가
        return response.data.data;
    } catch (error) {
        console.error(`주문 상세 (ID: ${orderId}) 불러오기 실패:`, error.response?.data?.message || error.message);
        throw error;
    }
};