import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005';

// 상품 관련 API 서비스
export const productApi = {
  // 모든 상품 조회
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/products`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 상품 검색
  searchProducts: async (keyword) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/products/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 재고 수정
  updateStock: async (productId, stock) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/products/stock`, {
        product_id: productId,
        stock: stock
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 