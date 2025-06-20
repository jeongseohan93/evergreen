// src/app/routes/appRoutes.js
import Home from '@/features/home/pages/Home';

import { PrivateRoute } from '@/shared';
import { AccessDeniedPage } from '@/shared';

import MyPageLayout from '@/features/mypage/layouts/MypageLayout';
import MyPage from '@/features/mypage/pages/MyPage';
import AccountInfoPage from '@/features/mypage/pages/AccountInfoPage';
import OrderHistoryPage from '@/features/mypage/pages/OrderHistoryPage';
import PointsPage from '@/features/mypage/pages/PointsPage';
import PostManagementPage from '@/features/mypage/pages/PostManagementPage';
import WishlistPage from '@/features/mypage/pages/WishlistPage';
import AddressBookPage from '@/features/mypage/pages/AddressBookPage';
import CartPage from '@/features/cart/pages/CartPage';

const appRoutes = [
  // 일반 사용자 및 관리자 모두 접근 가능한 로그인 후 페이지
  { path: '/', element: <Home />},
  // { path: '/profile', component: MyProfilePage, exact: true, requiresAuth: true, roles: ['user', 'admin'] },
  
  
  {
    path: '/403',
    element: <AccessDeniedPage />
  },

      {
        path: '/mypage',
        element: (
        <PrivateRoute role={['user', 'admin']} isLoggedIn={true}>
          <MyPageLayout />
        </PrivateRoute>), // 이름 통일
        children: [
          { path: '', element: <MyPage /> }, 
          { path: 'account', element: <AccountInfoPage /> },
          { path: 'orders', element: <OrderHistoryPage /> },
          { path: 'points', element: <PointsPage /> },
          { path: 'cart', element: <CartPage />},
          { path: 'posts', element: <PostManagementPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'address', element: <AddressBookPage /> }, 
        ]
      }
   
];

export default appRoutes;