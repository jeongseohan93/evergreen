import { apiService } from '@/shared';

export const addCategory = async (categoryName) => {
  try {
    // 경로 수정: /admin/categories -> /admin/product/categories
    const response = await apiService.post('/admin/product/categories', { name: categoryName });
    return { success: response.status === 201, message: response.data.message };
  } catch (error) {
    console.error('API Error: addCategory', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    // 경로 수정: /admin/categories/:id -> /admin/product/categories/:id
    const response = await apiService.delete(`/admin/product/categories/${categoryId}`);
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: deleteCategory', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    // 경로 수정: /admin/categories -> /admin/product/categories
    const response = await apiService.get('/admin/product/categories');
    // 백엔드가 response.data.data에 카테고리 배열을 담아 보내므로, 이에 맞춰 수정
    return response.data.data || []; 
  } catch (error) {
    console.error('API Error: fetchCategories', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, newName) => {
  try {
    // 백엔드 경로: PUT /admin/product/categories/:id
    const response = await apiService.put(`/admin/product/categories/${categoryId}`, { name: newName }); 
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: updateCategory', error);
    throw error;
  }
};
