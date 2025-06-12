// src/stores/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
  items: [],  // 실제 장바구니에 담긴 상품들의 배열 (선택 사항)
  count: 0,   // 장바구니에 담긴 상품의 총 개수
};

export const cartSlice = createSlice({
  name: 'cart', // 이 슬라이스의 이름입니다. 액션 타입에 사용됩니다 (예: 'cart/setCartItemCount')
  initialState, // 위에서 정의한 초기 상태
  reducers: {
    // 장바구니 아이템 개수를 직접 설정하는 액션
    setCartItemCount: (state, action) => {
      state.count = action.payload; // action.payload는 디스패치될 때 전달되는 값입니다.
    },
    // (선택 사항) 장바구니에 아이템을 추가하는 액션 예시
    addItemToCart: (state, action) => {
      state.items.push(action.payload); // 실제 구현에서는 중복 처리 등을 해야 합니다.
      state.count = state.items.length; // 아이템 배열의 길이로 개수 업데이트
    },
    // (선택 사항) 장바구니에서 아이템을 제거하는 액션 예시
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      state.count = state.items.length;
    },
    // (선택 사항) 장바구니를 완전히 비우는 액션
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

// `createSlice`가 자동으로 생성한 액션 생성자들을 내보냅니다.
// 컴포넌트에서 이들을 임포트하여 `dispatch()` 함수와 함께 사용합니다.
export const { setCartItemCount, addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;

// 리듀서 함수를 내보냅니다. 이 리듀서는 Redux 스토어에 등록됩니다.
export default cartSlice.reducer;