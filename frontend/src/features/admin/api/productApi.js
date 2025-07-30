// src/features/admin/api/productApi.js
import { apiService } from '@/shared';

// getAllProducts 함수 수정: categoryId 인자를 받도록 변경
export const getAllProducts = async (categoryId = null) => { // categoryId 기본값 null
  try {
    let url = '/admin/product/productAll'; // 기존 URL
    if (categoryId) { // categoryId가 제공되면 쿼리 파라미터 추가
      url += `?categoryId=${categoryId}`;
    }
    const response = await apiService.get(url); 
    // 응답 구조가 response.data.data 인지 확인 필요. 만약 직접 배열이면 response.data
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    console.error('API Error: getAllProducts', error);
    // 에러 발생 시 throw 대신 객체 반환으로 통일하는 것이 useProductManagement 훅에서 처리하기 용이
    return { success: false, message: error.response?.data?.message || '상품 불러오기 실패' }; 
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await apiService.get(`/admin/product/productSearch`, { params: { keyword } }); 
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    console.error('API Error: searchProducts', error);
    return { success: false, message: error.response?.data?.message || '상품 검색 실패' };
  }
};

export const updateStock = async (product_id, newStock) => {
  try {
    const response = await apiService.post('/admin/product/productStock', { product_id, stock: newStock }); 
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: updateStock', error);
    return { success: false, message: error.response?.data?.message || '재고 수정 실패' };
  }
};

export const addProduct = async (newProductData) => {
  try {
    const response = await apiService.post('/admin/product/productAdd', newProductData); 
    return { success: response.status === 201, message: response.data.message };
  } catch (error) {
    console.error('API Error: addProduct', error);
    return { success: false, message: error.response?.data?.message || '상품 추가 실패' };
  }
};

export const updateProduct = async (productId, updatedData) => {
    try {
        const response = await apiService.put(`/admin/product/productMod/${productId}`, updatedData);
        return { success: response.status === 200 && response.data.success, data: response.data.data, message: response.data.message };
    } catch (error) {
        console.error('updateProduct API Error:', error);
        return { success: false, message: error.response?.data?.message || '상품 수정 실패' };
    }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await apiService.delete(`/admin/product/productDel/${productId}`);
    // 백엔드에서 success: true, message: '상품이 성공적으로 삭제되었습니다.' 형태로 응답한다고 가정
    return { success: response.status === 200 && response.data.success, message: response.data.message };
  } catch (error) {
    console.error('API Error: deleteProduct', error);
    // 에러 응답 구조에 따라 메시지를 가져오거나 기본 메시지 반환
    return { success: false, message: error.response?.data?.message || '상품 삭제 실패' };
  }
};

export const uploadProductImage = async (imageFile) => {
  try {
    // FormData 객체를 사용하여 파일을 전송
    const formData = new FormData();
    // 'productImage'는 백엔드 Multer 설정의 필드 이름과 일치해야 해.
    formData.append('productImage', imageFile);

    const response = await apiService.post('/admin/product/upload-image', formData, {
      headers: {
        // FormData를 사용할 때는 'Content-Type': 'multipart/form-data' 헤더가 필요해.
        // axios는 FormData 객체를 넘기면 자동으로 이 헤더를 설정해주지만, 명시적으로 추가해도 돼.
        'Content-Type': 'multipart/form-data',
      },
    });

    // 백엔드에서 success: true, imageUrl: '/uploads/파일명.jpg' 형태로 응답한다고 가정
    return { success: response.data.success, imageUrl: response.data.imageUrl, message: response.data.message };
  } catch (error) {
    console.error('API Error: uploadProductImage', error);
    return { success: false, message: error.response?.data?.message || '이미지 업로드 실패' };
  }
};

export const getCategories = async () => {
    try {
        // 백엔드 라우트가 '/admin/product/categories'인지 확인
        const response = await apiService.get('/admin/product/categories');
        return { success: true, data: response.data.data || [] }; // 응답 구조에 맞게 수정
    } catch (error) {
        console.error('API Error: getCategories', error);
        return { success: false, message: error.response?.data?.message || '카테고리 불러오기 실패' };
    }
};