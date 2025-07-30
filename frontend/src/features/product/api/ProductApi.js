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

/**
 * 특정 상품의 사용후기 목록을 조회하는 API 함수
 * @param {string | number} productId - 조회할 상품의 ID
 */
export const getProductReviewsApi = async (productId) => {
    try {
        // GET /api/boards/review?product_id=${productId}
        const response = await apiService.get(`/boards/review?product_id=${productId}`);
        return response.data; // { success: true, data: [...] } 객체를 반환
    } catch (error) {
        console.error(`상품 ID ${productId}의 사용후기 조회 실패:`, error);
        throw error;
    }
};

export const addWishList = async (productId) => { // 함수 이름: addWishList
    try {
        // 백엔드는 product_id를 req.body로 받을 것으로 예상합니다.
        const response = await apiService.post('/users/wishlists', { product_id: productId });
        return response.data; // { success: true, message: '...', item: {...} } 형태 예상
    } catch (error) {
        console.error("addWishList 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};

export const searchProductsApi = async ({ query = '', name = '', sub = '', sub2 = '', page = 1, limit = 10 }) => {
    try {
        // ⭐️ 기본 URL 경로를 '/products/category'로 시작합니다.
        let url = `/products/category?page=${page}&limit=${limit}`;

        if (query) url += `&query=${encodeURIComponent(query)}`;
        if (name) url += `&name=${encodeURIComponent(name)}`;
        // ⭐️ sub와 sub2 파라미터들을 URL에 추가합니다.
        if (sub) url += `&sub=${encodeURIComponent(sub)}`;
        if (sub2) url += `&sub2=${encodeURIComponent(sub2)}`;

        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error("상품 검색 API 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};

