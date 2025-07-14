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
  const response = await apiService.post('/auth/me');
  return response.data;
};

export const signUp = async (formData) => {
  const response = await apiService.post('/auth/signup', formData);
  return response.data;
}

export const findId = async (phone) => {
  const response = await apiService.post('/auth/findid', { phone });
  return response.data;
}

export const sendVerificationCode = async ({ email, phone }) => {
    const response = await apiService.post('/auth/checkemailsent', { email, phone });
    return response.data;
  }

export const resetPasswordWithCode = async ({ email, code, newPassword }) => {
  const response = await apiService.post('/auth/reset-password', { email, code, newPassword });
  return response.data;
};


