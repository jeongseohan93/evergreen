// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind CSS 포함
import App from './app/App'; // App 컴포넌트 가져오기
import { Provider } from 'react-redux'; // Redux Provider
import store from './app/store'; // Redux 스토어
import { BrowserRouter } from 'react-router-dom';

// ⭐️ react-toastify 관련 임포트 추가
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // ⭐️ 기본 CSS 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* ⭐️ ToastContainer를 여기에 추가합니다. */}
        <ToastContainer 
          position="top-right" // 알림 위치 (top-left, top-right, bottom-left, bottom-right, top-center, bottom-center)
          autoClose={3000} // 알림이 자동으로 닫히는 시간 (ms)
          hideProgressBar={false} // 진행 바 숨김 여부
          newestOnTop={false} // 새 알림이 항상 위에 표시될지 여부
          closeOnClick // 클릭 시 닫기
          rtl={false} // RTL (Right-To-Left) 언어 지원 여부
          pauseOnFocusLoss // 창에서 포커스를 잃으면 알림 일시 정지
          draggable // 드래그 가능 여부
          pauseOnHover // 마우스 오버 시 일시 정지
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);