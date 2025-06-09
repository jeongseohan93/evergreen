/**
 * store.js
 * 
 * 이 파일은 Redux의 전역 상태 저장소(스토어)를 생성하는 곳입니다.
 * 여러 개의 slice(기능별 reducer)를 하나로 합쳐서,
 * 앱 전체에서 사용할 수 있도록 전역 상태 관리의 출발점 역할을 합니다.
 *
 * 보통 이 파일에서 configureStore로 스토어를 만들고,
 * App.jsx에서 Provider로 감싸 전역 상태를 적용합니다.
 *
 * 즉, Redux를 사용하는 리액트 앱에서
 * '전역 상태 관리의 중심지(허브)' 역할을 하는 파일입니다.
 */
import { configureStore } from '@reduxjs/toolkit';


const store = configureStore({
  
});

export default store;
