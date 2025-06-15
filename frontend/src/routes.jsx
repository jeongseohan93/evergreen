// 리액트 라우터에서 필요한 컴포넌트들 불러옴
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './features/mainPage/MainPage'
import Admin from './features/adminPage/DashBoard'
import Login from './features/mainPage/LoginPage'
// AppRoutes 컴포넌트: 앱의 모든 페이지 경로(라우팅)를 정의하는 곳
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/search' element={<Search />} />
        <Route path='/aggerments' element={<AggerMents />} />
        <Route path='/guide' element={<GuildTabs />} />
        <Route path='/about' element={<About />} />
        <Route path='/privacy' element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
