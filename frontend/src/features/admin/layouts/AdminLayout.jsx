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

// CategoryProductList도 CategoryManager와 같은 폴더에 있으므로 이 경로가 맞습니다.
import CategoryProductList from '../pages/categoryPage/CategoryProductList'; 


import { logoutAsync } from '@/features/authentication/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


// === 임시 페이지 컴포넌트들 ===
const AdminDashboardPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
     <h1> 2026년에는 3대 700을 도전한다.</h1>
     <h1> 나는 존나 쎄다. </h1>
     <DashBoardPage />
  </div>
);


// AdminCategoriesPage: CategoryManager에 onCategoryClick prop을 전달하도록 수정
const AdminCategoriesPage = ({ onCategoryClick }) => ( // prop 추가
  <div className="min-h-[400px]">
    <CategoryManager onCategoryClick={onCategoryClick} /> {/* prop 전달 */}
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
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">주문 관리</h2>
   <OrderManagementPage />
  </div>
);

// === Header 컴포넌트 === (이전과 동일)
const AdminHeader = ({ onGoDashboard }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

  return (
    <header className="bg-white p-4 shadow-md flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center">
        <div className="text-2xl font-aggro text-gray-800 font-bold">
          관리자 페이지
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onGoDashboard}
          className="px-4 py-2 cursor-pointer text-white rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border text-sm rounded-md"
        >
          대시보드로 이동
        </button>
        <button onClick={handleLogout} className="text-sm bg-[#58bcb5] text-white border border-[#58bcb5] hover:bg-white hover:text-[#58bcb5] px-4 py-2 rounded-md transition duration-200 ease-in-out">
          로그아웃
        </button>
      </div>
    </header>
  );
};

// === Sidebar 컴포넌트 === (이전과 동일)
const AdminSidebar = ({ activeKey, setActiveKey }) => { 
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
        <h2 className="text-2xl text-[#f2f2e8] font-aggro font-bold">Admin Panel</h2>
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
        </ul>
      </nav>
      <div className="pt-6 border-t border-white mt-6 text-sm text-white">
        <p>&copy; 2023 Your Admin. All rights reserved.</p>
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
  const [selectedCategoryIdForProductList, setSelectedCategoryIdForProductList] = useState(null); 


  const handleCategoryItemClick = (categoryId) => {
    setSelectedCategoryIdForProductList(categoryId); 
    setActiveComponentKey('categoryProducts'); 
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
    'categories': <AdminCategoriesPage onCategoryClick={handleCategoryItemClick} />, 
    'products': <AdminProductsPage />,
    'orders': <OrderPage />,
    'sale': <SalePage/>,
    'users': <UserManage onEditUser={handleEditUser} onGoDashboard={handleGoDashboard} />,
    'userEdit': <UserEdit userUuid={userEditId} onCancel={handleCancelEdit} />,
    'reports': <ReportManage onView={handleViewReport} onEdit={handleEditReport} onWrite={handleWriteReport} onGoDashboard={handleGoDashboard} />,
    'reportDetail': <ReportDetail reportId={reportDetailId} onCancel={handleCancelReport} />,
    'reportEdit': <ReportEdit reportId={reportEditId} onCancel={handleCancelReport} />,
    'reportWrite': <ReportWrite onCancel={handleCancelReport} />,
    'settings': <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]"><h2>설정 페이지</h2></div>,
    'categoryProducts': <CategoryProductList categoryId={selectedCategoryIdForProductList} />, 
  };

  const CurrentComponent = ComponentMap[activeComponentKey] || <AdminDashboardPage />; 

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <AdminHeader onGoDashboard={handleGoDashboard} />

      <div className="flex flex-1">
        <AdminSidebar activeKey={activeComponentKey === 'userEdit' ? 'users' : activeComponentKey} setActiveKey={setActiveComponentKey} />
        
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