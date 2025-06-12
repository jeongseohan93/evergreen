// src/stores/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../stores/slices/CartSlice'; // 🚨🚨🚨 이 부분이 문제입니다! 🚨🚨🚨

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // 다른 슬라이스가 있다면 여기에 추가
  },
  devTools: process.env.NODE_NODE_ENV !== 'production',
});