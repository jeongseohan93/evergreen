// 리액트 라우터에서 필요한 컴포넌트들 불러옴
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './features/adminPage/dashBoard'
import ReportManage from './features/adminPage/reportPage/reportManage'
import ReportDetail from './features/adminPage/reportPage/reportDetail'
import ReportEdit from './features/adminPage/reportPage/reportEdit'
import Login from './features/mainPage/LoginPage'
import Main from './features/mainPage/mainPage'

// AppRoutes 컴포넌트: 앱의 모든 페이지 경로(라우팅)를 정의하는 곳
function AppRoutes() {
  return (
    // BrowserRouter로 감싸면 URL 변경에 따라 페이지가 바뀌게 해줌
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
        //react 컴포넌트는 무조건 대문자로 시작!
        <Route path='/admin/report' element={<ReportManage/>}/>
        <Route path="/admin/report/:reportId" element={<ReportDetail />} />
        <Route path="/admin/report/:reportId/edit" element={<ReportEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
