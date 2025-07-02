// src/app/routes/appRoutes.js
import Home from '@/features/home/pages/Home';

import { PrivateRoute } from '@/shared';
import { AccessDeniedPage } from '@/shared';


import MyPage from '@/features/mypage/pages/MyPage';




import WishlistPage from '@/features/mypage/pages/WishlistPage';

import CartPage from '@/features/cart/pages/CartPage';
import OrderPage from '@/features/order/pages/OrderPage';


const appRoutes = [
  // 일반 사용자 및 관리자 모두 접근 가능한 로그인 후 페이지
  { path: '/', element: <Home />},
  // { path: '/profile', component: MyProfilePage, exact: true, requiresAuth: true, roles: ['user', 'admin'] },
  
  
  {
    path: '/403',
    element: <AccessDeniedPage />
  },

      { path: 'mypage', element: <MyPage />},
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'cart', element: <CartPage />},
      { path: 'order', element: <OrderPage />}
];

export default appRoutes;