// 리액트 라우터에서 필요한 컴포넌트들 불러옴
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './features/mainPage/MainPage'


// AppRoutes 컴포넌트: 앱의 모든 페이지 경로(라우팅)를 정의하는 곳
function AppRoutes() {
  return (
    // BrowserRouter로 감싸면 URL 변경에 따라 페이지가 바뀌게 해줌
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
