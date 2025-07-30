import { apiService } from '@/shared';

// 1. 장바구니에 상품 추가
export const addToCartApi = async (productId, quantity) => {
    try {
        // 백엔드 API /cart 엔드포인트를 호출합니다.
        const response = await apiService.post('/cart', { productId, quantity });
        
        // ⭐️ 중요: axios 응답 전체가 아닌, 실제 데이터가 담긴 .data를 반환합니다.
        return response.data; 
    } catch (error) {
        console.error("addToCartApi 호출 실패:", error.response?.data?.message || error.message);
        // 실패 시에도 에러 응답의 .data를 반환하여 일관성을 유지할 수 있습니다.
        throw error.response?.data || error;
    }
};

// 2. 내 장바구니 조회
export const getCartApi = async () => {
    return apiService.get('/cart');
};

// 3. 장바구니 상품 수량 수정
export const updateCartItemApi = async (cartId, quantity) => {
    return apiService.patch(`/cart/${cartId}`, { quantity });
};

// 4. 장바구니 상품 삭제
export const removeCartItemApi = async (cartId) => {
    return apiService.delete(`/cart/${cartId}`);
};