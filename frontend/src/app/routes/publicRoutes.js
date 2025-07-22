// src/app/routes/publicRoutes.js
import LoginPage from '@/features/authentication/pages/LoginPage';
import RegisterPage from '@/features/authentication/pages/SignAgreePage' // 회원가입 페이지가 있다면
import FindIdPage from '@/features/authentication/pages/FindIdPage';
import FindIdResultPage from '@/features/authentication/pages/FindIdResultPage';
import FindPasswordPage from '@/features/authentication/pages/FindPasswordPage';
import SignPage from '@/features/authentication/pages/SignPage';
import SignAgreePage from '@/features/authentication/pages/SignAgreePage';

import PrivacyPolicyPage from '@/features/policies/pages/PrivacyPolicyPage';
import HelpPage from '@/features/policies/pages/HelpPage';
import TermsPage from '@/features/policies/pages/TermsPage';

import AboutPage from "@/features/about/pages/AboutPage";

import SearchPage from '@/features/product/pages/SearchPage';

import ProductDetailPage from '@/features/product/pages/ProductDetailPage';

import CategorySearchPage from '@/features/product/pages/CategorySearchPage';

import NoticeListPage from '@/features/community/pages/NoticeListPage'; //공지사항 목록
import ReviewListPage from '@/features/community/pages/ReviewListPage'; //리뷰(사용후기) 목록
import FreeListPage from '@/features/community/pages/FreeListPage'; //자유게시판 목록
import QnaListPage from '@/features/community/pages/QnaListPage'; //질문게시판 목록
import ReportListPage from '@/features/community/pages/ReportListPage'; //조행기게시판 목록

const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signagree', element: <SignAgreePage />},
  { path: '/signup', element: <SignPage/>},
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
  
  {
    path: '/board',
    children: [
      { path: 'notice', element: <NoticeListPage /> },
      { path: 'review', element: <ReviewListPage /> },
      { path: 'free', element: <FreeListPage /> },
      { path: 'qna', element: <QnaListPage />},
      { path: 'report', element: <ReportListPage />}, // 조행기게시판: /board/report
    ],
  },

  { path: '/search', element: <SearchPage /> },
  { path: "/products/:productId", element: <ProductDetailPage /> },
  {path: '/categorysearch', element: <CategorySearchPage />},

];

export default publicRoutes;