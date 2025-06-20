import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005';

export const saleApi = {
    // 매출 입력 (오프라인 매출 + 온라인 매출 자동 계산)
    addSale: async (saleData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/sale/add`, saleData);
            return response.data;
        } catch (error) {
            console.error('매출 추가 API 오류:', error);
            throw error;
        }
    },

    // 일간 매출 조회
    getDailySales: async (year, month) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/sale/daily?year=${year}&month=${month}`);
            return response.data;
        } catch (error) {
            console.error('일간 매출 조회 API 오류:', error);
            throw error;
        }
    },

    // 월간 매출 조회
    getMonthlySales: async (year) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/sale/monthly?year=${year}`);
            return response.data;
        } catch (error) {
            console.error('월간 매출 조회 API 오류:', error);
            throw error;
        }
    },

    // 연간 매출 조회
    getYearlySales: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/sale/yearly`);
            return response.data;
        } catch (error) {
            console.error('연간 매출 조회 API 오류:', error);
            throw error;
        }
    },

    // 특정 날짜의 매출 상세 조회
    getSaleByDate: async (saleDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/sale/date/${saleDate}`);
            return response.data;
        } catch (error) {
            console.error('매출 상세 조회 API 오류:', error);
            throw error;
        }
    },
}; 