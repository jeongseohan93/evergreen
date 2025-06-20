//실제로 데이터베이스에 직접 접근하거나 비즈니스 로직을 처리하는 것이 아니라,
//백엔드 API와 통신(HTTP 요청)만 담당

import axios from "axios"; //API 요청을 쉽게 보낼 수 있게 해주는 라이브러리

// .env에서 API BASE URL을 받아옴
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000, // 5초 타임아웃
  headers: {
    'Content-Type': 'application/json'
  }
});

// 조행기 관련 API 서비스
export const reportApi = {
    /**
     * 조행기 작성
     * @param {Object} data - 조행기 데이터 (title, contents)
     * @returns {Promise<Object>} 작성된 조행기 데이터
     */
    createReport: async (data) => {
      try {
        const response = await api.post('/adminReport/admin/report', data);
        return response.data;
      } catch (error) {
        console.error('조행기 작성 API 오류:', error.response?.data || error.message);
        throw error;
      }
    },

    /**
     * 모든 조행기 목록 조회
     * @returns {Promise<Array>} 조행기 목록 배열
     */
    getAllReports: async () => {
      try {
        console.log('조행기 목록 조회 API 호출');
        const response = await api.get('/adminReport/admin/report');
        console.log('조행기 목록 조회 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error('조행기 목록 조회 API 오류:', error.response?.data || error.message);
        throw error;
      }
    },

    /**
     * 조행기 상세 조회
     * @param {number|string} reportId - 조회할 조행기의 ID
     * @returns {Promise<Object>} 조행기 상세 데이터
     */
    getReportById: async (reportId) => {
      try {
        console.log('상세 조회 API 호출:', `/adminReport/admin/report/${reportId}`);
        const response = await api.get(`/adminReport/admin/report/${reportId}`);
        console.log('상세 조회 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error('조행기 상세 조회 API 오류:', error.response?.data || error.message);
        throw error;
      }
    },

    /**
     * 조행기 수정
     * @param {number|string} reportId - 수정할 조행기의 ID
     * @param {FormData} formData - 수정할 조행기 데이터
     * @returns {Promise<Object>} 수정된 조행기 데이터
     */
    updateReport: async (reportId, formData) => {
      try {
        const response = await api.put(`/adminReport/admin/report/${reportId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        console.error('조행기 수정 API 오류:', error.response?.data || error.message);
        throw error;
      }
    },

    /**
     * 조행기 삭제
     * @param {number|string} reportId - 삭제할 조행기의 ID
     * @returns {Promise<Object>} 삭제 결과
     */
    deleteReport: async (reportId) => {
      try {
        const response = await api.delete(`/adminReport/admin/report/${reportId}`);
        return response.data;
      } catch (error) {
        console.error('조행기 삭제 API 오류:', error.response?.data || error.message);
        throw error;
      }
    },
};

/**
 * 이미지 파일 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<string>} 업로드된 이미지의 URL
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(
    `${BASE_URL}/adminReport/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
  );
  return response.data.imageUrl;
}
