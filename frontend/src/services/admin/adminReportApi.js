//실제로 데이터베이스에 직접 접근하거나 비즈니스 로직을 처리하는 것이 아니라,
//백엔드 API와 통신(HTTP 요청)만 담당

import axios from "axios"; //API 요청을 쉽게 보낼 수 있게 해주는 라이브러리

//백엔드 포트번호 명시. api가 실제로 데이터베이스에 접근하기 위해서는 프록시를 설정하거나,
//이런식으로 명시해줘야 함.
const API_BASE_URL = 'http://localhost:3005';

// 조행기 관련 API 서비스
export const reportApi = {
    // 모든 조행기 목록 조회
    getAllReports: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/adminReport/admin/report`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // 조행기 상세 조회
    getReportById: async (reportId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/adminReport/admin/report/${reportId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // 조행기 수정
    updateReport: async (reportId, { title, content }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/adminReport/admin/report/${reportId}`, {
          title,
          content
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // 조행기 삭제
    deleteReport: async (reportId) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/adminReport/admin/report/${reportId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
};