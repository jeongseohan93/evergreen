import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';

const topMenuItems = [
  { name: '에버그린로드' },
  { name: '송어/쏘가리' },
  { name: '릴REEL/소품' },
  { name: '라인/소품' },
  { name: '윔/소프트루어' },
  { name: '하드루어' },
  { name: '바늘/씽커/채비' },
  { name: '의류/모자/잡화' },
  { name: '태클박스/가방' },
  { name: '낚시소품' },
  { name: '바다낚시대' },
  { name: '바다낚시채비' },
];

const fullMenuItems = [
  {
    category: '에버그린로드',
    subItems: ['오로라에디션정점', '킴레이드히리즈', '오리지널시리즈'],
  },
  {
    category: '송어/쏘가리',
    subItems: ['송어/쏘가리', '쏘가리로', '송어로'],
  },
  // ... 나머지 fullMenuItems 생략
];

function MenuBar() {
  const navigate = useNavigate();

  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [hoveredTopMenuCategory, setHoveredTopMenuCategory] = useState(null);

  const toggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
    setHoveredTopMenuCategory(null);
  };

  const handleTopMenuItemMouseEnter = (categoryName) => {
    setHoveredTopMenuCategory(categoryName);
    setIsHamburgerMenuOpen(false);
  };

  const handleAnyMouseLeave = () => {
    setHoveredTopMenuCategory(null);
  };

  const closeHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false);
  };

  const getSubItemsForCategory = (categoryName) => {
    const categoryData = fullMenuItems.find(item => item.category === categoryName);
    return categoryData ? categoryData.subItems : [];
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-30">
      <ul className="flex items-center justify-center py-4 px-12">
        {/* 햄버거 메뉴 버튼 */}
        <li className="mr-10">
          <button
            aria-label="메뉴 열기"
            className="text-2xl text-black hover:text-blue-600 transition-colors"
            onMouseEnter={() => setIsHamburgerMenuOpen(true)}
            onClick={toggleHamburgerMenu}
          >
            <RxHamburgerMenu />
          </button>
        </li>

        {/* 상단 카테고리 메뉴 */}
        {topMenuItems.map((item, index) => {
          const subItems = getSubItemsForCategory(item.name);
          const hasSubItems = subItems.length > 0;

          return (
            <li
              key={item.name}
              className="relative"
              style={{ marginLeft: index > 0 ? '1rem' : '0' }}
              onMouseEnter={() => handleTopMenuItemMouseEnter(item.name)}
              onMouseLeave={handleAnyMouseLeave}
            >
              {/* ✅ 이 버튼 클릭 시 `/search?name=xxx` 이동 */}
              <button
                onClick={() => {
                  const url = `/search?name=${encodeURIComponent(item.name)}`;
                  navigate(url);
                }}
                className="text-black text-sm font-aggro font-light hover:text-blue-600 transition-colors duration-200 whitespace-nowrap px-2 py-1"
              >
                {item.name}
              </button>

              {/* 드롭다운 서브메뉴 */}
              {hoveredTopMenuCategory === item.name && hasSubItems && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-[1px] bg-white shadow-lg p-4 rounded-lg z-40 border border-gray-200 min-w-[180px]"
                  onMouseEnter={() => setHoveredTopMenuCategory(item.name)}
                  onMouseLeave={handleAnyMouseLeave}
                >
                  <ul>
                    {subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-1 last:mb-0">
                        <button
                          onClick={() => {
                            const url = `/search?name=${encodeURIComponent(item.name)}&sub=${encodeURIComponent(subItem)}`;
                            navigate(url);
                          }}
                          className="block text-gray-700 hover:text-blue-500 text-xs whitespace-nowrap px-2 py-1"
                        >
                          {subItem}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* 전체 햄버거 메뉴 */}
      {isHamburgerMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-10 z-35"
            onClick={closeHamburgerMenu}
          ></div>

          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-[1px] bg-white shadow-lg p-8 rounded-lg z-40 border border-gray-200"
            style={{ width: 'min(100% - 96px, 1330px)' }}
            onMouseLeave={closeHamburgerMenu}
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">전체 메뉴</h2>
              <button
                onClick={closeHamburgerMenu}
                className="text-gray-500 hover:text-gray-800 text-3xl"
              >
                <IoMdClose />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-4">
              {fullMenuItems.map((menuGroup, groupIndex) => (
                <div key={groupIndex} className="mb-2">
                  <h3 className="font-bold text-base mb-1 text-blue-700 border-b border-gray-300 pb-0.5">
                    {menuGroup.category}
                  </h3>
                  <ul>
                    {menuGroup.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-0.5">
                        <button
                          onClick={() => {
                            const url = `/search?name=${encodeURIComponent(menuGroup.category)}&sub=${encodeURIComponent(subItem)}`;
                            navigate(url);
                          }}
                          className="text-gray-700 hover:text-blue-500 text-xs"
                        >
                          {subItem}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default MenuBar;
