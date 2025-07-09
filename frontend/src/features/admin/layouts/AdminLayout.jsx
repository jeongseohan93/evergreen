// src/features/admin/layouts/AdminLayout.jsx

import React, { useState } from 'react';
import { HomeIcon, ShoppingBagIcon, UsersIcon, ChartBarIcon, CogIcon, FoldersIcon, FileTextIcon, PackageIcon } from 'lucide-react';

// === Import 경로 재수정 ===
// CategoryManager의 실제 위치에 맞게 경로를 설정 (pages/categoryPage 폴더 안에 있음)
import CategoryManager from '../pages/categoryPage/CategoryManager'; // <-- 이 경로가 맞습니다!

// 다른 컴포넌트들도 'pages' 폴더 하위에 있다면 기존 경로가 맞을 가능성이 높습니다.
import ProductManagePage from '../pages/productPage/ProductManagePage';
import SaleManagerPage from '../pages/salePage/SaleManagerPage';
import OrderManagementPage from '../pages/orderPage/OrderManagementPage';

import UserManage from '../pages/userPage/UserManage.jsx';
import UserEdit from '../pages/userPage/UserEdit.jsx';
import ReportManage from '../pages/reportPage/ReportManage.jsx';
import ReportDetail from '../pages/reportPage/ReportDetail.jsx';
import ReportEdit from '../pages/reportPage/ReportEdit.jsx';
import ReportWrite from '../pages/reportPage/ReportWrite.jsx';
import DashBoardPage from '../pages/dashboardPage/DashBoardPage';

import sh from '../../../assets/image/sh.png';
import toon from '../../../assets/image/toon.png';

// CategoryProductList는 이제 AdminLayout에서 직접 임포트할 필요 없음
// import CategoryProductList from '../pages/categoryPage/CategoryProductList';


import { logoutAsync } from '@/features/authentication/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


// === 임시 페이지 컴포넌트들 ===
const AdminDashboardPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
     <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div> <img src={sh} alt="정서한" className="sh" /></div> 이게 인생존망 원본 ㅋㅋ →
      <div> <img src={toon} alt="원본" className="toon" /></div>
    </div>
     <DashBoardPage />
  </div>
);


// AdminCategoriesPage: 이제 onCategoryClick prop을 전달할 필요 없음
const AdminCategoriesPage = () => (
  <div className="min-h-[400px]">
    <CategoryManager /> {/* onCategoryClick prop 제거 */}
  </div>
);


const AdminProductsPage = () => (
  <div className="min-h-[400px]">
    <ProductManagePage />
  </div>
);

const SalePage = () => (
  <div className="min-h-[400px]">
   <SaleManagerPage />
  </div>
);

const OrderPage = () => (
  <div className="min-h-[400px]">
   <OrderManagementPage />
  </div>
);

// === Header 컴포넌트 === (이전과 동일)
const AdminHeader = ({ onGoDashboard }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handleLogout을 AdminSidebar로 전달하기 위해 export
  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

};

// === Sidebar 컴포넌트 === (이전과 동일)
const AdminSidebar = ({ activeKey, setActiveKey, onGoDashboard, onLogout }) => {
  const menuItems = [
    { name: '대시보드', icon: HomeIcon, key: 'dashboard' },
    { name: '상품 관리', icon: ShoppingBagIcon, key: 'products' },
    { name: '주문 관리', icon: PackageIcon, key: 'orders' },
    { name: '카테고리', icon: FoldersIcon, key: 'categories' },
    { name: '회원 관리', icon: UsersIcon, key: 'users' },
    { name: '매출 관리', icon: ChartBarIcon, key: 'sale' },
    { name: '리포트 관리', icon: FileTextIcon, key: 'reports' },
    { name: '설정', icon: CogIcon, key: 'settings' },
  ];

  const handleClick = (key) => {
    setActiveKey(key);
  };

  return (
    <aside
      className="flex-col bg-[#306f65] text-white w-64 p-5 z-30"
    >
      <div className="flex items-center justify-between pb-6 border-b border-white mb-6">
        <h2
          className="text-2xl text-[#f2f2e8] font-aggro font-bold cursor-pointer hover:text-[#58bcb5]"
          onClick={onGoDashboard}
        >
          Admin Panel
        </h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleClick(item.key)}
                className={`flex items-center p-3 rounded-md transition duration-200 ease-in-out w-full text-left
                  ${activeKey === item.key
                    ? 'bg-[#f2f2e8] text-black text-xl font-aggro font-bold'
                    : 'text-gray-300 hover:bg-[#58bcb5] hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={onLogout}
              className="flex items-center p-3 rounded-md transition duration-200 ease-in-out w-full text-left text-gray-300 hover:bg-[#58bcb5] hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-3" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
              <span className="font-medium">로그아웃</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="pt-6 border-t border-white mt-6 text-sm text-white">
        <p>&copy; 2025.05 to 2025.07 <br/> Node.js 정복하다.</p>
      </div>
    </aside>
  );
};

// === AdminLayout 컴포넌트 (내부에서 콘텐츠 전환 관리) ===
const AdminLayout = () => {
  const [activeComponentKey, setActiveComponentKey] = useState('dashboard');
  const [userEditId, setUserEditId] = useState(null);
  const [reportDetailId, setReportDetailId] = useState(null);
  const [reportEditId, setReportEditId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

  // ⭐ 삭제: selectedCategoryIdForProductList 상태 제거 ⭐
  // const [selectedCategoryIdForProductList, setSelectedCategoryIdForProductList] = useState(null);


  // ⭐ 삭제: handleCategoryItemClick 함수 제거 ⭐
  // const handleCategoryItemClick = (categoryId) => {
  //   setSelectedCategoryIdForProductList(categoryId);
  //   setActiveComponentKey('categoryProducts');
  // };

  const handleEditUser = (userUuid) => {
    setUserEditId(userUuid);
    setActiveComponentKey('userEdit');
  };
  const handleCancelEdit = () => {
    setUserEditId(null);
    setActiveComponentKey('users');
  };
  const handleGoDashboard = () => {
    setActiveComponentKey('dashboard');
  };

  const handleViewReport = (reportId) => {
    setReportDetailId(reportId);
    setActiveComponentKey('reportDetail');
  };
  const handleEditReport = (reportId) => {
    setReportEditId(reportId);
    setActiveComponentKey('reportEdit');
  };
  const handleWriteReport = () => {
    setActiveComponentKey('reportWrite');
  };
  const handleCancelReport = () => {
    setReportDetailId(null);
    setReportEditId(null);
    setActiveComponentKey('reports');
  };

  const ComponentMap = {
    'dashboard': <AdminDashboardPage />,
    'categories': <AdminCategoriesPage />, // ⭐ 수정: onCategoryClick prop 제거 ⭐
    'products': <AdminProductsPage />,
    'orders': <OrderPage />,
    'sale': <SalePage/>,
    'users': <UserManage onEditUser={handleEditUser} onGoDashboard={handleGoDashboard} />,
    'userEdit': <UserEdit userUuid={userEditId} onCancel={handleCancelEdit} />,
    'reports': <ReportManage onView={handleViewReport} onEdit={handleEditReport} onWrite={handleWriteReport} onGoDashboard={handleGoDashboard} />,
    'reportDetail': <ReportDetail reportId={reportDetailId} onCancel={handleCancelReport} />,
    'reportEdit': <ReportEdit reportId={reportEditId} onCancel={handleCancelReport} />,
    'reportWrite': <ReportWrite onCancel={handleCancelReport} />,
    'settings': <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]"><h2>배너추가,삭제,선택,글 삭제, 댓글 삭제, 공지 등록 이런거 넣어야하는데..</h2></div>,
    // ⭐ 삭제: 'categoryProducts' 항목 제거 ⭐
    // 'categoryProducts': <CategoryProductList categoryId={selectedCategoryIdForProductList} />,
  };

  const CurrentComponent = ComponentMap[activeComponentKey] || <AdminDashboardPage />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <AdminHeader onGoDashboard={handleGoDashboard} />

      <div className="flex flex-1">
        <AdminSidebar activeKey={['reportEdit', 'reportWrite', 'reportDetail'].includes(activeComponentKey) ? 'reports' : (activeComponentKey === 'userEdit' ? 'users' : activeComponentKey)} setActiveKey={setActiveComponentKey} onGoDashboard={handleGoDashboard} onLogout={handleLogout} />

        <main className="flex-1 p-6 overflow-y-auto bg-[#f2f2e8]">
          {CurrentComponent}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AdminLayout />
  );
};

export default App;