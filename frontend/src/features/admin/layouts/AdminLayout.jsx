// src/features/admin/layouts/AdminLayout.jsx

import React, { useState } from 'react';
// ⭐ 수정: CogIcon은 사용되지 않으므로 제거했습니다. ⭐
import { HomeIcon, ShoppingBagIcon, UsersIcon, ChartBarIcon, FoldersIcon, FileTextIcon, PackageIcon ,List, Image as ImageIcon } from 'lucide-react';
// ⭐ Logo 컴포넌트가 default export이므로 중괄호 없이 import 합니다. ⭐
import Logo from '../../../shared/components/layouts/Header/Logo'; // Logo 컴포넌트 경로 확인

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
import BannerManager from '../pages/bannerPage/BannerManager';
import BoardManager from '../pages/boardPage/BoardManage';

// CategoryProductList는 이제 AdminLayout에서 직접 임포트할 필요 없음
// import CategoryProductList from '../pages/categoryPage/CategoryProductList';


import { logoutAsync } from '@/features/authentication/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


// === 임시 페이지 컴포넌트들 ===



const AdminDashboardPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
     <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
     
 
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

const BannerManagerPage = () => (
 <div className="min-h-[400px]">
  <BannerManager />
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

const BoardPage = () => (
  <div className="min-h-[400px]">
 <BoardManager />
 </div>
);

// === Header 컴포넌트 (이제 사용하지 않음) ===
// const AdminHeader = ({ onGoDashboard }) => {
//   return (
//     <header className="flex items-center justify-center p-4 bg-[#f2f2e8] text-gray-800 shadow-md"> 
//       <Logo /> 
//     </header>
//   );
// };

// === Sidebar 컴포넌트 ===
const AdminSidebar = ({ activeKey, setActiveKey, onGoDashboard, onLogout }) => {
  const menuItems = [
    { name: '대시보드', icon: HomeIcon, key: 'dashboard' },
    { name: '상품 관리', icon: ShoppingBagIcon, key: 'products' },
    { name: '주문 관리', icon: PackageIcon, key: 'orders' },
    { name: '카테고리', icon: FoldersIcon, key: 'categories' },
    { name: '회원 관리', icon: UsersIcon, key: 'users' },
    { name: '매출 관리', icon: ChartBarIcon, key: 'sale' },
    { name: '리포트 관리', icon: FileTextIcon, key: 'reports' },
    { name: '게시판', icon: List, key: 'board' },
    { name: '배너 관리', icon: ImageIcon, key: 'settings' },
  ];

  const handleClick = (key) => {
    setActiveKey(key);
  };

  return (
    <aside
      className="flex-col bg-[#306f65] text-white w-64 p-5 z-30"
    >
      {/* ⭐ 로고를 Admin Panel 위로 이동 ⭐ */}
      {/* ⭐ 로고와 Admin Panel 사이 간격 조정을 위해 mb-8로 변경 ⭐ */}
      <div className="flex justify-center mb-8"> 
        <Logo />
      </div>
      <div className="flex items-center justify-between pb-6 border-b border-white mb-6">
        {/* ⭐ "Admin Panel" 텍스트 유지 ⭐ */}
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
                    // ⭐ 활성화된 메뉴 색상 변경: bg-[#f2f2e8] text-[#306f65] (기존 유지) ⭐
                    ? 'bg-[#f2f2e8] text-[#306f65] text-xl font-aggro font-bold' 
                    // ⭐ 호버 색상 변경: hover:bg-[#4a8a80] (기존 유지) ⭐
                    : 'text-gray-300 hover:bg-[#4a8a80] hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-6 border-t border-white mt-6">
        <ul>
          <li>
            {/* AdminLayout에서 전달받은 onLogout prop 사용 */}
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
        <div className="text-sm text-white mt-4">
          <p>&copy; 2025.05 to 2025.07 <br/> Node.js 정복하다.</p>
        </div>
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

  // 이 handleLogout 함수는 AdminSidebar로 prop으로 전달되어 사용됩니다.
  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

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
    'categories': <AdminCategoriesPage />,
    'products': <AdminProductsPage />,
    'orders': <OrderPage />,
    'sale': <SalePage/>,
    'users': <UserManage onEditUser={handleEditUser} onGoDashboard={handleGoDashboard} />,
    'userEdit': <UserEdit userUuid={userEditId} onCancel={handleCancelEdit} />,
    'reports': <ReportManage onView={handleViewReport} onEdit={handleEditReport} onWrite={handleWriteReport} onGoDashboard={handleGoDashboard} />,
    'reportDetail': <ReportDetail reportId={reportDetailId} onCancel={handleCancelReport} />,
    'reportEdit': <ReportEdit reportId={reportEditId} onCancel={handleCancelReport} />,
    'reportWrite': <ReportWrite onCancel={handleCancelReport} />,
    'board' : <BoardPage />,
    'settings': <BannerManagerPage />,
  };

  const CurrentComponent = ComponentMap[activeComponentKey] || <AdminDashboardPage />;

  return (
 
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* ⭐ AdminHeader 컴포넌트 제거 ⭐ */}
      {/* <AdminHeader onGoDashboard={handleGoDashboard} /> */}

      <div className="flex flex-1">
        {/* AdminSidebar에 handleLogout 함수를 onLogout prop으로 전달 */}
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
