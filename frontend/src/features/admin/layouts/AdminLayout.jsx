import React, { useState } from 'react'; // useState 훅 추가
import { HomeIcon, ShoppingBagIcon, UsersIcon, ChartBarIcon, CogIcon, FoldersIcon } from 'lucide-react';
import  CategoryManager  from '../pages/categoryPage/CategoryManager';
import ProductManagePage from '../pages/productPage/ProductManagePage';
import SaleManagerPage from '../pages/salePage/SaleManagerPage';
import OrderManagementPage from '../pages/orderPage/OrderManagementPage';

// === 임시 페이지 컴포넌트들 (실제로는 별도 파일에서 임포트됩니다) ===
// 이 컴포넌트들은 AdminLayout 내에서 조건부로 렌더링될 대상입니다.

// AdminDashboardPage.jsx의 내용
const AdminDashboardPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">대시보드</h2>
    <p className="text-gray-700">여기에 대시보드 콘텐츠가 표시됩니다. 예를 들어, 카테고리 관리 테이블이나 통계 그래프 등을 추가할 수 있습니다.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-4 rounded-md shadow-sm">
        <h3 className="font-semibold text-lg text-blue-700">총 상품 수</h3>
        <p className="text-3xl font-bold text-blue-900">1,234</p>
      </div>
      <div className="bg-green-50 p-4 rounded-md shadow-sm">
        <h3 className="font-semibold text-lg text-green-700">오늘의 주문</h3>
        <p className="text-3xl font-bold text-green-900">56</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
        <h3 className="font-semibold text-lg text-yellow-700">신규 회원</h3>
        <p className="text-3xl font-bold text-yellow-900">12</p>
      </div>

     <h1>산타할아버지 프론트 해주세요</h1>

    </div>
  </div>
);

// AdminCategoriesPage.jsx의 내용 (CategoryManager 포함)
// 실제 CategoryManager 컴포넌트가 임포트되어야 합니다.



const AdminCategoriesPage = () => (
  <div className="min-h-[400px]">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">카테고리 관리</h1>
    <CategoryManager />
  </div>
);


// AdminProductsPage.jsx의 내용
const AdminProductsPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">상품 관리</h2>
   <ProductManagePage />
  </div>
);

const SalePage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">상품 관리</h2>
   <SaleManagerPage />
  </div>
);

const OrderPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">상품 관리</h2>
   <OrderManagementPage />
  </div>
);

// === Header 컴포넌트 ===
const AdminHeader = () => {
  return (
    <header className="bg-white p-4 shadow-md flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center">
        <div className="text-xl font-semibold text-gray-800">
          관리자 페이지
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out">
          로그아웃
        </button>
      </div>
    </header>
  );
};

// === Sidebar 컴포넌트 (state를 받아 콘텐츠 전환) ===
const AdminSidebar = ({ activeKey, setActiveKey }) => { // activeKey와 setActiveKey prop 추가
  const menuItems = [
    { name: '대시보드', icon: HomeIcon, key: 'dashboard' }, // key로 변경
    { name: '상품 관리', icon: ShoppingBagIcon, key: 'products' },
    { name: '주문 관리', icon: ChartBarIcon, key: 'orders' },
    { name: '카테고리', icon: FoldersIcon, key: 'categories' },
    { name: '회원 관리', icon: UsersIcon, key: 'users' },
    { name: '매출 관리', icon: ChartBarIcon, key: 'sale' },
    { name: '설정', icon: CogIcon, key: 'settings' },
  ];

  const handleClick = (key) => {
    setActiveKey(key); // 클릭 시 부모의 상태를 업데이트
  };

  return (
    <aside
      className="flex-col bg-gray-800 text-white w-64 p-5 z-30"
    >
      {/* Sidebar Header / Logo */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-700 mb-6">
        <h2 className="text-2xl font-bold text-blue-300">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button // Link 대신 button 사용
                onClick={() => handleClick(item.key)}
                className={`flex items-center p-3 rounded-md transition duration-200 ease-in-out w-full text-left
                  ${activeKey === item.key // activeKey와 일치하면 활성화 스타일
                    ? 'bg-blue-600 text-white shadow-inner'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

      {/* Sidebar Footer (Optional) */}
      <div className="pt-6 border-t border-gray-700 mt-6 text-sm text-gray-500">
        <p>&copy; 2023 Your Admin. All rights reserved.</p>
      </div>
    </aside>
  );
};

// === AdminLayout 컴포넌트 (내부에서 콘텐츠 전환 관리) ===
const AdminLayout = () => { // children prop 제거
  const [activeComponentKey, setActiveComponentKey] = useState('dashboard'); // 현재 활성화된 컴포넌트 키

  // 키에 따라 렌더링할 컴포넌트 맵
  const ComponentMap = {
    'dashboard': <AdminDashboardPage />,
    'categories': <AdminCategoriesPage />,
    'products': <AdminProductsPage />,
    // TODO: 다른 메뉴 항목에 대한 컴포넌트도 여기에 추가
    'orders': <OrderPage />,
    'users': <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]"><h2>회원 관리 페이지</h2></div>,
    'sale': <SalePage/>,
    'settings': <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]"><h2>설정 페이지</h2></div>,
  };

  const CurrentComponent = ComponentMap[activeComponentKey] || <AdminDashboardPage />; // 기본값: 대시보드

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeKey={activeComponentKey} setActiveKey={setActiveComponentKey} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {CurrentComponent} {/* 선택된 컴포넌트 렌더링 */}
        </main>
      </div>
    </div>
  );
};

// === App 컴포넌트 (최상위 라우터는 필요 없음) ===
// 이제 AdminLayout이 자체적으로 콘텐츠를 전환하므로,
// App.js에서는 단순히 AdminLayout을 렌더링하거나, 특정 경로에 연결할 수 있습니다.
// 이 예시에서는 AdminLayout을 직접 렌더링하는 형태로 단순화했습니다.
const App = () => {
  return (
    <AdminLayout /> // AdminLayout이 모든 콘텐츠를 관리
  );
};

export default App;
