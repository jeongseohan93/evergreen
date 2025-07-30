import { apiService } from '@/shared';

// 전체 회원 조회
export const getAllUsers = async () => {
  const response = await apiService.get('/admin/user/users');
  return response.data;
};

// 회원 상세 조회
export const getUserById = async (userUuid) => {
  const response = await apiService.get(`/admin/user/users/${userUuid}`);
  return response.data;
};

// 회원 정보 수정
export const updateUser = async (userUuid, updateData) => {
  const response = await apiService.put(`/admin/user/users/${userUuid}`, updateData);
  return response.data;
};

// 회원 제명(삭제)
export const deleteUser = async (userUuid) => {
  const response = await apiService.delete(`/admin/user/users/${userUuid}`);
  return response.data;
};

// 회원 제명 해제(복구)
export const restoreUser = async (userUuid) => {
  const response = await apiService.post(`/admin/user/users/${userUuid}/restore`);
  return response.data;
};
