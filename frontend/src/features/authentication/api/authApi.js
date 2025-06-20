import { apiService } from '@/shared';

export const loginUser = async (loginInfo) => {
  const response = await apiService.post('/auth/login', loginInfo);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiService.post('/auth/logout');
  return response.data;
};

export const checkAuth = async () => {
  const response = await apiService.get('/auth/me');
  return response.data;
};
