import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005';

// 상품 관련 API 서비스
export const productApi = {
  // 모든 상품 조회
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/productAll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 상품 검색
  searchProducts: async (keyword) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/productSearch?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 재고 수정
  updateStock: async (productId, stock) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/product/productStock`, {
        product_id: productId,
        stock: stock
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 상품 추가
  addProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/product/productAdd`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 카테고리 조회
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/product/categories`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 카테고리 추가
  addCategory: async (categoryName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/product/categories`, {
        name: categoryName
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 카테고리 삭제
  deleteCategory: async (categoryId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/product/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 