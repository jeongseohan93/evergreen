// src/api/productApi.js

import { apiService } from '@/shared';

/**
 * 'best' 상품 목록을 조회하는 API 함수
 */
export const getBestProductsApi = async () => {
    try {
        // GET /api/products/best
        const response = await apiService.get('/products/best');
        return response.data; // { success: true, data: [...] } 객체를 반환
    } catch (error) {
        console.error("베스트 상품 조회 실패:", error);
        throw error;
    }
};