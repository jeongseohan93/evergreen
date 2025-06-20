import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userInfo: null,
  role: null,
  loading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 로그인 시작
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 로그인 성공
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo;
      state.role = action.payload.role;
      state.loading = false;
      state.error = null;
    },
    // 로그인 실패
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.role = null;
      state.loading = false;
      state.error = action.payload;
    },
    // 로그아웃
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.role = null;
      state.loading = false;
      state.error = null;
    },
    // 사용자 정보 업데이트
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUserInfo 
} = userSlice.actions;

export default userSlice.reducer; 