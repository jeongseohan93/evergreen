// src/api/wishlistApi.js

import { apiService } from "@/shared"; 

// ... (exports.addWishList 함수는 이미 있다고 가정) ...

/**
 * @desc 사용자 관심 상품 목록 조회 API 호출
 * @returns {Promise<Object>} 성공 여부와 관심 상품 목록 배열을 포함하는 Promise
 */
export const getWishlistItemsApi = async () => {
    try {
        // 백엔드 라우트가 /users/wishlists (GET 요청)으로 설정된다고 가정합니다.
        const response = await apiService.get('/users/wishlists');
        return response.data; // { success: true, items: [...] } 형태 예상
    } catch (error) {
        console.error("관심 상품 목록 조회 API 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};

/**
 * @desc 관심 상품 삭제 API 호출
 * @param {number} wishlistId - 삭제할 관심 상품 항목의 ID (wishlist_id)
 * @returns {Promise<Object>} 성공 여부와 메시지를 포함하는 Promise
 */
export const deleteWishlistItemApi = async (wishlistId) => {
    try {
        // 백엔드 라우트가 /users/wishlists/:wishlistId (DELETE 요청)으로 설정된다고 가정합니다.
        const response = await apiService.delete(`/users/wishlists/${wishlistId}`);
        return response.data; // { success: true, message: '...' } 형태 예상
    } catch (error) {
        console.error("관심 상품 삭제 API 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};