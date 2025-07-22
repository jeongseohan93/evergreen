// MenuBar.jsx (최종 수정 - 모든 onClick 통합 버전)
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';
import { FaChevronRight } from 'react-icons/fa';
import { fullMenuItems } from '@/shared/contants/menuData';


function MenuBar() {
  const navigate = useNavigate();

  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [hoveredTopMenuCategory, setHoveredTopMenuCategory] = useState(null);
  const [hoveredFullMenuSubCategory, setHoveredFullMenuSubCategory] = useState(null); 
  const [hoveredTopMenuSubCategory, setHoveredTopMenuSubCategory] = useState(null);


  const toggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
    setHoveredTopMenuCategory(null);
    setHoveredFullMenuSubCategory(null); 
    setHoveredTopMenuSubCategory(null); 
  };

  const handleTopMenuItemMouseEnter = (categoryName) => {
    setHoveredTopMenuCategory(categoryName);
    setIsHamburgerMenuOpen(false);
    setHoveredFullMenuSubCategory(null);
    setHoveredTopMenuSubCategory(null); 
  };

  const handleAnyMouseLeave = () => {
    setHoveredTopMenuCategory(null);
    setHoveredFullMenuSubCategory(null);
    setHoveredTopMenuSubCategory(null); 
  };

  const closeHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false);
    setHoveredFullMenuSubCategory(null); 
    setHoveredTopMenuSubCategory(null); 
  };

  const derivedTopMenuItems = fullMenuItems.map(item => ({ name: item.category }));


  const getSubItemsForCategory = (categoryName) => {
    const categoryData = fullMenuItems.find(item => item.category === categoryName);
    return categoryData ? categoryData.subItems : [];
  };

  // ⭐️ 공통 클릭 핸들러 함수 - 모든 메뉴 클릭을 이 함수로 처리합니다.
  const handleCategoryClick = (category, sub = null, sub2 = null) => {
    let url = `/categorysearch?name=${encodeURIComponent(category)}`;
    if (sub) {
      url += `&sub=${encodeURIComponent(sub)}`;
    }
    if (sub2) {
      url += `&sub2=${encodeURIComponent(sub2)}`;
    }
    navigate(url);
    closeHamburgerMenu(); // 클릭 시 햄버거 메뉴 및 모든 드롭다운 닫기
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-30 h-16">
      <ul className="flex items-center justify-center py-5 px-12">
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

        {/* 상단 카테고리 메뉴 - derivedTopMenuItems 사용 */}
        {derivedTopMenuItems.map((item, index) => { 
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
              {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
              <button
                onClick={() => handleCategoryClick(item.name)} 
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
                      typeof subItem === 'string' ? (
                        <li key={subIndex} className="mb-1 last:mb-0">
                          {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                          <button
                            onClick={() => handleCategoryClick(item.name, subItem)}
                            className="block text-gray-700 hover:text-blue-500 text-xs whitespace-nowrap px-2 py-1"
                          >
                            {subItem}
                          </button>
                        </li>
                      ) : (
                        // ⭐️ 객체 형태의 subItem (3단계 메뉴) - 상단 드롭다운에 적용
                        <li 
                            key={subIndex} 
                            className="mb-1 last:mb-0 relative" 
                            onMouseEnter={() => setHoveredTopMenuSubCategory(subItem.name)}
                            onMouseLeave={() => setHoveredTopMenuSubCategory(null)}
                        >
                            {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                            <button
                                onClick={() => handleCategoryClick(item.name, subItem.name)}
                                className="block text-gray-700 hover:text-blue-500 text-xs whitespace-nowrap px-2 py-1 font-semibold flex justify-between items-center w-full" 
                            >
                                {subItem.name}
                                {/* ⭐️ 화살표 아이콘 추가 및 회전 애니메이션 */}
                                <FaChevronRight className={`ml-2 text-gray-500 text-xs transition-transform duration-300 ${
                                    hoveredTopMenuSubCategory === subItem.name ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {/* ⭐️ 3단계 메뉴 (subSubItems) 조건부 렌더링 - hover 시 나타남 */}
                            {hoveredTopMenuSubCategory === subItem.name && (
                                <div 
                                    className="absolute left-full top-0 ml-2 bg-white shadow-lg p-2 rounded-lg border border-gray-200 min-w-[150px] z-50"
                                    onMouseEnter={() => setHoveredTopMenuSubCategory(subItem.name)}
                                    onMouseLeave={() => setHoveredTopMenuSubCategory(null)}
                                >
                                    <ul>
                                        {subItem.subSubItems.map((subSubItem, subSubIndex) => (
                                        <li key={subSubIndex} className="mb-0.5">
                                            {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                                            <button
                                                onClick={() => handleCategoryClick(item.name, subItem.name, subSubItem)}
                                                className="block text-gray-700 hover:text-blue-500 text-xs whitespace-nowrap px-4 py-1"
                                            >
                                                {subSubItem}
                                            </button>
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* 전체 햄버거 메뉴 (기존 로직과 동일) */}
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
                  {/* ⭐️ 1단계 카테고리 (h3)도 클릭 가능하게 수정 */}
                  <button
                    onClick={() => handleCategoryClick(menuGroup.category)}
                    className="w-full text-left font-bold text-base mb-1 text-blue-700 border-b border-gray-300 pb-0.5 hover:text-blue-900 transition-colors"
                  >
                    {menuGroup.category}
                  </button>
                  <ul>
                    {menuGroup.subItems.map((subItem, subIndex) => (
                      typeof subItem === 'string' ? (
                        <li key={subIndex} className="mb-0.5">
                          {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                          <button
                            onClick={() => handleCategoryClick(menuGroup.category, subItem)}
                            className="text-gray-700 hover:text-blue-500 text-xs"
                          >
                            {subItem}
                          </button>
                        </li>
                      ) : (
                        // ⭐️ 전체 햄버거 메뉴 내의 객체 형태 subItem (3단계 메뉴)
                        <li
                          key={subIndex}
                          className="mb-0.5 relative" 
                          onMouseEnter={() => setHoveredFullMenuSubCategory(subItem.name)}
                          onMouseLeave={() => setHoveredFullMenuSubCategory(null)}
                        >
                            {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                          <h4 
                              onClick={() => handleCategoryClick(menuGroup.category, subItem.name)}
                              className="font-semibold text-gray-800 text-xs mt-2 mb-1 cursor-pointer hover:text-blue-500 transition-colors flex justify-between items-center w-full"
                          >
                            {subItem.name}
                            {/* ⭐️ 화살표 아이콘 추가 및 회전 애니메이션 */}
                            <FaChevronRight className={`ml-2 text-gray-500 text-xs transition-transform duration-300 ${
                                hoveredFullMenuSubCategory === subItem.name ? 'rotate-180' : ''
                            }`} />
                          </h4>
                          {hoveredFullMenuSubCategory === subItem.name && (
                            <div className="absolute left-full top-0 ml-2 bg-white shadow-lg p-2 rounded-lg border border-gray-200 min-w-[150px] z-50">
                                <div onMouseLeave={closeHamburgerMenu}> 
                                    <ul>
                                        {subItem.subSubItems.map((subSubItem, subSubIndex) => (
                                        <li key={subSubIndex} className="mb-0.5">
                                            {/* ⭐️ onClick에 공통 함수 handleCategoryClick 사용 */}
                                            <button
                                            onClick={() => handleCategoryClick(menuGroup.category, subItem.name, subSubItem)}
                                            className="text-gray-700 hover:text-blue-500 text-xs pl-4"
                                            >
                                            {subSubItem}
                                            </button>
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                          )}
                        </li>
                      )
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
