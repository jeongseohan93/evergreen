// src/api/productApi.js

import { apiService } from '@/shared';

// ... 기존 getAllProductsApi, getBestProductsApi 함수 ...

/**
 * 특정 ID의 상품 상세 정보를 조회하는 API 함수
 * @param {string | number} productId - 조회할 상품의 ID
 */
export const getProductByIdApi = async (productId) => {
    try {
        // GET /api/products/:productId
        const response = await apiService.get(`/products/${productId}`);
        return response.data; // { success: true, data: {...} } 객체를 반환
    } catch (error) {
        console.error(`ID가 ${productId}인 상품 조회 실패:`, error);
        throw error;
    }
};