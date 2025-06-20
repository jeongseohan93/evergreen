// src/stores/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/CartSlice';
import userReducer from './slices/UserSlice'; // 사용자 슬라이스 추가

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, // 사용자 상태 추가
    // 다른 슬라이스가 있다면 여기에 추가
  },
  devTools: process.env.NODE_ENV !== 'production',
});