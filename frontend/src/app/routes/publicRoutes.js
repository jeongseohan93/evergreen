// src/app/routes/publicRoutes.js
import LoginPage from '@/features/authentication/pages/LoginPage';
import RegisterPage from '@/features/authentication/pages/RegisterPage' // 회원가입 페이지가 있다면
import FindIdPage from '@/features/authentication/pages/FindIdPage';
import FindIdResultPage from '@/features/authentication/pages/FindIdResultPage';
import FindPasswordPage from '@/features/authentication/pages/FindPasswordPage';
import SignPage from '@/features/authentication/pages/SignPage';
import SignAgreePage from '@/features/authentication/pages/SignAgreePage';

import PrivacyPolicyPage from '@/features/policies/pages/PrivacyPolicyPage';
import HelpPage from '@/features/policies/pages/HelpPage';
import TermsPage from '@/features/policies/pages/TermsPage';

import AboutPage from "@/features/about/pages/AboutPage";

import NoticeListPage from '@/features/community/pages/notice/NoticeListPage';
import EventPage from '@/features/community/pages/event/EventPage';
import SupportListPage from '@/features/community/pages/support/SupportListPage'; 
import ReviewListPage from '@/features/community/pages/review/ReviewListPage';

import SearchPage from '@/features/product/pages/SearchPage';

import ProductDetailPage from '@/features/product/pages/ProductDetailPage';

import CategorySearchPage from '@/features/product/pages/CategorySearchPage';




const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage />},
  { path: '/findid', element: <FindIdPage /> },
  { path: "/findid/result", element: <FindIdResultPage />}, 
  { path: '/findpassword', element: <FindPasswordPage /> },

  {
    path: '/about',
    children: [
      { path: 'company', element: <AboutPage /> },
    ],
  },

  {
    path: '/shopinfo',
    children: [
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'guide', element: <HelpPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },
  
  { path: '/search', element: <SearchPage /> },
  { path: '/productdetail', element: <ProductDetailPage /> },

  {
    path: '/community',
    children: [
      { path: 'notice', element: <NoticeListPage /> },
      { path: 'review', element: <ReviewListPage /> },
      { path: 'support', element: <SupportListPage /> },
      { path: 'event', element: <EventPage />},
    ],
  },

  {path: '/categorysearch', element: <CategorySearchPage />},

];

export default publicRoutes;