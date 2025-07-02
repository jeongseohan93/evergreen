// src/app/routes/adminRoutes.js
import { Outlet } from 'react-router-dom';
import AdminOutlet from './adminOutlet';
import DashboardPage from '@/features/admin/pages/DashBoardPage';
import { PrivateRoute } from '@/shared';
import UserManage from '@/features/admin/pages/userPage/UserManage';
import UserEdit from '@/features/admin/pages/userPage/UserEdit';
import ReportManage from '@/features/admin/pages/reportPage/ReportManage';
import ReportWrite from '@/features/admin/pages/reportPage/ReportWrite';
import ReportDetail from '@/features/admin/pages/reportPage/ReportDetail';
import ReportEdit from '@/features/admin/pages/reportPage/ReportEdit';


const adminRoutes = [
  {
    path: '/admin',
    element: ( //element의 공통조건: 관리자 로그인
      <PrivateRoute role={['admin']} isLoggedIn={true}>
        <AdminOutlet />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <DashboardPage /> },
      {
        path: 'user',
        children: [
          { path: '', element: <UserManage /> },
          { path: 'edit/:userUuid', element: <UserEdit /> },
        ]
      },
      {
        path: 'report',
        children: [
          { path: '', element: <ReportManage /> },
          { path: 'write', element: <ReportWrite /> },
          { path: ':reportId', element: <ReportDetail /> },
          { path: ':reportId/edit', element: <ReportEdit /> },
        ]
      }
    ]
  }
];

export default adminRoutes;