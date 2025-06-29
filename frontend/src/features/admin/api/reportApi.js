import { apiService } from '@/shared';

const BASE_URL = '/adminReport'; //server.js에 있는 라우터 주소

// 전체 조행기 목록 조회
export const getAllReports = async () => {
  const response = await apiService.get(`${BASE_URL}`);
  return response.data;
};

// 특정 조행기 상세 조회
export const getReportById = async (reportId) => {
  const response = await apiService.get(`${BASE_URL}/${reportId}`);
  return response.data;
};

// 조행기 생성
export const createReport = async ({ title, contents }) => {
  const response = await apiService.post(`${BASE_URL}`, { title, contents });
  return response.data;
};

// 조행기 수정
export const updateReport = async (reportId, { title, contents }) => {
  const response = await apiService.put(`${BASE_URL}/${reportId}`, { title, contents });
  return response.data;
};

// 조행기 삭제
export const deleteReport = async (reportId) => {
  const response = await apiService.delete(`${BASE_URL}/${reportId}`);
  return response.data;
};

// 이미지 업로드
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiService.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url; // 업로드된 이미지의 URL 반환
};
