// src/features/admin/api/productApi.js
import { apiService } from '@/shared';

export const getAllProducts = async () => {
  try {
    // 상품 전체 조회: 백엔드 경로 '/productAll'에 맞춰 수정
    const response = await apiService.get('/admin/product/productAll'); 
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    console.error('API Error: getAllProducts', error);
    throw error;
  }
};

export const searchProducts = async (keyword) => {
  try {
    // 상품 검색: 백엔드 경로 '/productSearch'에 맞춰 수정
    const response = await apiService.get(`/admin/product/productSearch`, { params: { keyword } }); 
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    console.error('API Error: searchProducts', error);
    throw error;
  }
};

export const updateStock = async (product_id, newStock) => {
  try {
    // 재고 수정: 백엔드 경로 '/productStock'에 맞춰 수정 (POST 요청이므로 body에 productId와 stock 전달)
    const response = await apiService.post('/admin/product/productStock', { product_id, stock: newStock }); 
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: updateStock', error);
    throw error;
  }
};

export const addProduct = async (newProductData) => {
  try {
    // 상품 추가: 백엔드 경로 '/productAdd'에 맞춰 수정
    const response = await apiService.post('/admin/product/productAdd', newProductData); 
    return { success: response.status === 201, message: response.data.message };
  } catch (error) {
    console.error('API Error: addProduct', error);
    throw error;
  }
};