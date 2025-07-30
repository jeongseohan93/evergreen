// frontend/src/features/admin/api/saleApi.js
import { apiService } from '@/shared'; // apiService 경로가 '@/shared'라고 가정합니다.

export const addSale = async (saleData) => {
  try {
    // 백엔드 라우터: router.post('/add', saleController.addSale); 에 맞춰서 /admin/sale/add
    const response = await apiService.post('/admin/sale/add', saleData);
    // 백엔드 라우터에 따라 201 Created 또는 200 OK
    return { success: response.status === 201 || response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: addSale', error);
    throw error;
  }
};

export const getDailySales = async (year, month) => {
  try {
    // 백엔드 라우터: router.get('/daily', saleController.getDailySales); 에 맞춰서 /admin/sale/daily
    const response = await apiService.get('/admin/sale/daily', { params: { year, month } });
    return response.data.data || [];
  } catch (error) {
    console.error('API Error: getDailySales', error);
    throw error;
  }
};

export const getMonthlySales = async (year) => {
  try {
    // 백엔드 라우터: router.get('/monthly', saleController.getMonthlySales); 에 맞춰서 /admin/sale/monthly
    const response = await apiService.get('/admin/sale/monthly', { params: { year } });
    return response.data.data || [];
  } catch (error) {
    console.error('API Error: getMonthlySales', error);
    throw error;
  }
};

export const getYearlySales = async () => {
  try {
    // 백엔드 라우터: router.get('/yearly', saleController.getYearlySales); 에 맞춰서 /admin/sale/yearly
    const response = await apiService.get('/admin/sale/yearly');
    return response.data.data || [];
  } catch (error) {
    console.error('API Error: getYearlySales', error);
    throw error;
  }
};

export const getSaleByDate = async (saleDate) => {
  try {
    // 백엔드 라우터: router.get('/date/:sale_date', saleController.getSaleByDate); 에 맞춰서 /admin/sale/date/:sale_date
    const response = await apiService.get(`/admin/sale/date/${saleDate}`);
    return response.data.data || null;
  } catch (error) {
    console.error('API Error: getSaleByDate', error);
    throw error;
  }
};