// src/app/routes/adminRoutes.js
import DashboardPage from '@/features/admin/pages/DashBoardPage';
import { PrivateRoute } from '@/shared';


const adminRoutes = [
  
      { path: '/admin', element: (  <PrivateRoute role={['admin']} isLoggedIn={true}>
                                          <DashboardPage />
                                    </PrivateRoute>),},
      
  
];

export default adminRoutes;