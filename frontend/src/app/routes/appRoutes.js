// src/app/routes/appRoutes.js
import Home from '@/features/home/pages/Home';

import { PrivateRoute } from '@/shared';
import { AccessDeniedPage } from '@/shared';

import MyPageLayout from '@/features/mypage/components/MyPageLayout';
import MyPage from '@/features/mypage/pages/MyPage';
import ProfilePage from '@/features/mypage/pages/AccountInfoPage';
import WishlistPage from '@/features/mypage/pages/WishlistPage';
import MileagePage from '@/features/mypage/pages/PointsPage';
import BoardPage from '@/features/mypage/pages/PostManagementPage';
import AddressPage from '@/features/mypage/pages/AddressBookPage';
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
  
   {
    path: 'mypage', // 부모 경로. 앞에 '/'가 없어야 중첩됩니다.
    element: (
      <PrivateRoute>
        <MyPageLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MyPage /> },
      { path: 'orders', element: <OrderPage /> },       // -> /mypage/orders
      { path: 'profile', element: <ProfilePage /> },     // -> /mypage/profile
      { path: 'wishlist', element: <WishlistPage /> },   // -> /mypage/wishlist
      { path: 'mileage', element: <MileagePage /> },     // -> /mypage/mileage
      { path: 'board', element: <BoardPage /> },         // -> /mypage/board
      { path: 'addresses', element: <AddressPage /> },   // -> /mypage/addresses
    ],
  },

      { path: 'cart', element: <CartPage />},
      { path: 'order', element: <OrderPage />}
];

export default appRoutes;