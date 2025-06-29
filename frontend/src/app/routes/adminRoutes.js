// src/app/routes/adminRoutes.js
import DashboardPage from '@/features/admin/pages/DashBoardPage';
import { PrivateRoute } from '@/shared';
import UserManage from '@/features/admin/pages/userPage/userManage';
import UserEdit from '@/features/admin/pages/userPage/userEdit';
import ReportManage from '@/features/admin/pages/reportPage/reportManage';
import ReportWrite from '@/features/admin/pages/reportPage/reportWrite';
import ReportDetail from '@/features/admin/pages/reportPage/reportDetail';
import ReportEdit from '@/features/admin/pages/reportPage/reportEdit';


const adminRoutes = [
  
      { path: '/admin', element: (  <PrivateRoute role={['admin']} isLoggedIn={true}>
                                          <DashboardPage />
                                    </PrivateRoute>),},
      { path: '/admin/user', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <UserManage />
          </PrivateRoute>
        ),
      },
      { path: '/admin/user/edit/:userUuid', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <UserEdit />
          </PrivateRoute>
        ),
      },
      { path: '/admin/report', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <ReportManage />
          </PrivateRoute>
        ),
      },
      { path: '/admin/report/write', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <ReportWrite />
          </PrivateRoute>
        ),
      },
      { path: '/admin/report/:reportId', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <ReportDetail />
          </PrivateRoute>
        ),
      },
      { path: '/admin/report/:reportId/edit', element: (
          <PrivateRoute role={['admin']} isLoggedIn={true}>
            <ReportEdit />
          </PrivateRoute>
        ),
      },
  
];

export default adminRoutes;