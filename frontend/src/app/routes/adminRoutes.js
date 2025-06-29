// src/app/routes/adminRoutes.js
import { Outlet } from 'react-router-dom';
import AdminOutlet from './AdminOutlet';
import DashboardPage from '@/features/admin/pages/DashBoardPage';
import { PrivateRoute } from '@/shared';
import UserManage from '@/features/admin/pages/userPage/userManage';
import UserEdit from '@/features/admin/pages/userPage/userEdit';
import ReportManage from '@/features/admin/pages/reportPage/reportManage';
import ReportWrite from '@/features/admin/pages/reportPage/reportWrite';
import ReportDetail from '@/features/admin/pages/reportPage/reportDetail';
import ReportEdit from '@/features/admin/pages/reportPage/reportEdit';


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