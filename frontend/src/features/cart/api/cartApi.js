import { apiService } from '@/shared';

// 1. 장바구니에 상품 추가
export const addToCartApi = async (productId, quantity) => {
    return apiService.post('/cart', { productId, quantity });
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