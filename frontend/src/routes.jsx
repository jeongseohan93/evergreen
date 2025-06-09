// 리액트 라우터에서 필요한 컴포넌트들 불러옴
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './features/mainPage/mainPage'
import Login from './features/mainPage/LoginPage';

// AppRoutes 컴포넌트: 앱의 모든 페이지 경로(라우팅)를 정의하는 곳
function AppRoutes() {
  return (
    // BrowserRouter로 감싸면 URL 변경에 따라 페이지가 바뀌게 해줌
    <BrowserRouter>
      {/* Routes: 여러 개의 Route(경로)를 묶어서 관리 */}
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* 여기서 <Route path="/경로" element={<컴포넌트 />} /> 형태로 페이지를 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
