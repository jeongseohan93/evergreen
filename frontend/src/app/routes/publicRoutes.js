// src/app/routes/publicRoutes.js
import LoginPage from '@/features/authentication/pages/LoginPage';
import RegisterPage from '@/features/authentication/pages/RegisterPage' // 회원가입 페이지가 있다면
import FindIdPage from '@/features/authentication/pages/FindIdPage';
import FindPasswordPage from '@/features/authentication/pages/FindPasswordPage';

import PrivacyPolicyPage from '@/features/policies/pages/PrivacyPolicyPage';
import HelpPage from '@/features/policies/pages/HelpPage';
import TermsPage from '@/features/policies/pages/TermsPage';

import AboutPage from "@/features/about/pages/AboutPage";

import NoticeListPage from '@/features/community/pages/notice/NoticeListPage';
import EventPage from '@/features/community/pages/event/EventPage';
import SupportListPage from '@/features/community/pages/support/SupportListPage'; 
import ReviewListPage from '@/features/community/pages/review/ReviewListPage';

import SearchPage from '@/features/product/pages/SearchPage';




const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage />},
  { path: '/findid', element: <FindIdPage /> },
  { path: '/findpassword', element: <FindPasswordPage /> },

  {
    path: '/aboutus',
    children: [
      { path: 'company', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'guide', element: <HelpPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },
  
  { path: '/search', element: <SearchPage /> },

  {
    path: '/community',
    children: [
      { path: 'notice', element: <NoticeListPage /> },
      { path: 'review', element: <ReviewListPage /> },
      { path: 'support', element: <SupportListPage /> },
      { path: 'event', element: <EventPage />},
    ],
  },

];

export default publicRoutes;