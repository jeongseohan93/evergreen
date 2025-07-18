// src/api/userApi.js
import { apiService } from "@/shared"; // apiService가 axios 인스턴스라고 가정

export const getMyInfoApi = async () => { // async 키워드 추가
    try {
        const response = await apiService.get('/users/infor');
        return response.data; // 👈 get 요청도 response.data를 반환하도록 일관성 유지
    } catch (error) {
        console.error("getMyInfoApi 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};

export const updateMyInfoApi = async (data) => {
    try {
        const response = await apiService.put('/users/infor', data);
        return response.data; // 서버에서 보낸 데이터 (success, message 등) 반환 (현재 코드와 동일)
    } catch (error) {
        console.error("updateMyInfoApi 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};