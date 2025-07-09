import { apiService } from '@/shared';

export const lookProduct = async (keyword = []) => {
    try {
        const queryString = keyword.join(',');

        const response = await apiService.get(`/products/category?keywords=${queryString}`); 

        return response.data;
    } catch(error) {
        console.error("Home 상품 조회 실패:", error);
        throw error;
    }
};