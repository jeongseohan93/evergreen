import { apiService } from '@/shared';

export const getProductsByPickApi = async (pickValue) => {
    try {
        const response = await apiService.get(`/products/pick/${pickValue}`); 
        return response.data; 
    } catch (error) {
        console.error(`'${pickValue}' 상품 조회 실패:`, error);
        throw error;
    }
};