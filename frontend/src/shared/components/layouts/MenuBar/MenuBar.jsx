import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';

const topMenuItems = [
  { name: '에버그린로드' },
  { name: '송어/쏘가리' },
  { name: '릴 REEL/소품' },
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
    subItems: ['오로라에디션정점', '칼레이도시리즈', '오리온시리즈', '라이트카발시리즈(2피스)', '페이즈시리즈', '팩트 FACT시리즈', '볼락로드(슈페리어)',
      '에깅로드[오징어]', '지강로드', '참돔로드(타이러버)', '알티잔[송어]', '농어로드', '단종/헤라클레스시리즈', '30주년 에어리얼 모델', '단종/칼레이도(토너먼트/블랙)'
    ],
  },
  {
    category: '송어/쏘가리',
    subItems: ['쏘가리로드', '송어로드'],
  },
  {
    category: '릴 REEL/소품',
    subItems: ['베이트릴', '스피닝릴', '전동릴','선상릴 / 지깅릴', '릴소품'],
  },
  {
    category: '라인/소품',
    subItems: ['카본라인','모노라인','합사라인','쇼크리더','라인소품'],
  },
  {
    category: '윔/소프트루어',
    subItems: ['배스','송어/쏘가리'],
  },
  {
    category: '하드루어',
    subItems: ['에기/팁런에기/이카메탈','미노우','탑워터','체터베이트/버즈베이트','스피너베이트스위밍투루퍼','크랭크베이트','바이브레이셔','러버지그/스몰러버지그',
      '메타지그/스푼/스피너','개구리','빅베이트'],
  },
  {
    category: '바늘/씽커/채비',
    subItems: ['윔/다운샷/카이젤/와키','플레쉬스위머/웨이트훅','지그헤드/풋볼','트레블/트레일러/더블','씽 커','비드/스냅/도래','스플릿링/고무링'],
  },
  {
    category: '의류/모자/잡화',
    subItems: ['낚시의류/에버그린의류','에버그린모자','장갑/토시/버프(넥워머)','구명조끼/벨트/봄베','장화/바지장화'],
  },
  {
    category: '태클박스/가방',
    subItems: ['태클박스','가방 / 바칸','릴가방/파우치','쿨러/보조가방'],
  },
  {
    category: '낚시소품',
    subItems: ['라인커터/핀온릴/렌턴','일렉트릭와이어지퍼','플라이어/글립/피징바늘','루어회수기/줄자/꿰미','로드커버/훅키퍼,훅커버/벨트','스티커/데칼','릴오일 릴튜닝노브&헨들'],
  },
  {
    category: '바다낚시대',
    subItems: ['뽈락낚시대','라이트지깅 낚시대','에깅낚시대','타이러버낚시대'],
  },
  {
    category: '바다낚시채비',
    subItems: [],
  },
  
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
