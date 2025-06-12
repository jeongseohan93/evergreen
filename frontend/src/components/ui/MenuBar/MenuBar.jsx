import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io'; // 햄버거 메뉴 닫기 버튼을 위해 다시 필요할 수 있습니다.

// 상단 메뉴 아이템 (기존 메뉴바에 표시될 항목)
const topMenuItems = [
  { name: '에버그린로드', path: '/evergreen-road' },
  { name: '송어/쏘가리', path: '/trout-bass' },
  { name: '릴REEL/소품', path: '/reels-accessories' },
  { name: '라인/소품', path: '/lines-accessories' },
  { name: '윔/소프트루어', path: '/worms-softlures' },
  { name: '하드루어', path: '/hardlures' },
  { name: '바늘/씽커/채비', path: '/hooks-sinkers-rigs' },
  { name: '의류/모자/잡화', path: '/apparel-hats-misc' },
  { name: '태클박스/가방', path: '/tacklebox-bags' },
  { name: '낚시소품', path: '/fishing-accessories' },
  { name: '바다낚시대', path: '/sea-fishing-rods' },
  { name: '바다낚시채비', 'path': '/sea-fishing-rigs' },
];

// 전체 메뉴 아이템 데이터 (이전과 동일)
const fullMenuItems = [
  {
    category: '에버그린로드',
    subItems: [
      '오로라에디션정점', '킴레이드히리즈', '오리지널시리즈', '라이트카발리시리즈(2피스)',
      '페이즈시리즈', '팩트 FACT 시리즈', '블락로드(슈페리어)', '에감로드(오징어)',
      '지깅로드', '참돔로드(타이라버)', '알티잔[송어]', '농어로',
      '단종/헤라클래스시리즈', '30주년 에어리얼 멸종', '단종/갈매기도너트/블랙',
    ],
  },
  {
    category: '송어/쏘가리',
    subItems: ['송어/쏘가리', '쏘가리로', '송어로'],
  },
  {
    category: '릴REEL/소품',
    subItems: ['베이트릴', '스피닝릴', '전동릴', '선상릴/장치릴', '필수품'],
  },
  {
    category: '라인/소품',
    subItems: ['카본라인', '모노라인', '합사라인', '쇼크리더', '라인소품'],
  },
  {
    category: '윔/소프트루어',
    subItems: ['배스', '송어/쏘가리', '개구리'],
  },
  {
    category: '하드루어',
    subItems: [
      '여기/런에기/아기메일', '미노우', '탑워터', '채터베이트/바즈베이트',
      '스피너베이트/쥬르루어', '크랭크베이트', '바이브레이션', '러버지그/고스터버리지그',
      '메탈지그/스피너', '빅베이트',
    ],
  },
  {
    category: '바늘/씽커/채비',
    subItems: [
      '원/다운싱거/아지', '플렉스암윔/메이트호', '지그헤드/볼',
      '트레블/트레일러/더블', '싱커', '버드/스냅/도래', '스플릿링/고무링',
    ],
  },
  {
    category: '의류/모자/잡화',
    subItems: [
      '낚시의류/에버그린의류', '에버그린모자', '장갑/토시/버프(넥윔어)',
      '구명조끼/벨트/팩', '장화/방수화',
    ],
  },
  {
    category: '태클박스/가방',
    subItems: ['태클박스', '가방/백팩', '힐가방/파우치', '쿨러/보조가방'],
  },
  {
    category: '낚시소품',
    subItems: [
      '라인커터/핀온릴/텐팅', '릴베어와이어', '플라이어/구멍/피어바늘',
      '루어회수기/줄자/패스', '로드커버/후쿠키/캐피/팩트', '스티커/대봉',
      '필오일 툴키트/핸들',
    ],
  },
  {
    category: '바다낚시대',
    subItems: ['루어로드', '라이트지깅 낚시대', '에깅낚시대', '타이라바낚시대'],
  },
  {
    category: '바다낚시채비',
    subItems: ['바다 채비 1', '바다 채비 2', '바다 채비 3'],
  },
];


function MenuBar() {
  // 햄버거 메뉴 드롭다운 상태
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  // 개별 상위 메뉴에 마우스 오버된 카테고리 이름 (해당 드롭다운을 열기 위해)
  const [hoveredTopMenuCategory, setHoveredTopMenuCategory] = useState(null);

  // 햄버거 메뉴 열기/닫기 토글 함수
  const toggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
    setHoveredTopMenuCategory(null); // 햄버거 메뉴 열면 개별 메뉴 드롭다운은 닫기
  };

  // 상위 메뉴 아이템에 마우스가 들어왔을 때
  const handleTopMenuItemMouseEnter = (categoryName) => {
    setHoveredTopMenuCategory(categoryName);
    setIsHamburgerMenuOpen(false); // 개별 메뉴 열면 햄버거 메뉴 닫기
  };

  // 상위 메뉴 아이템 또는 해당 드롭다운에서 마우스가 벗어났을 때 (모두 닫기)
  const handleAnyMouseLeave = () => {
    setHoveredTopMenuCategory(null);
  };

  // 햄버거 메뉴 닫기 (메뉴 항목 클릭 시)
  const closeHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false);
  };

  // 각 메뉴 카테고리에 해당하는 하위 아이템을 찾습니다.
  const getSubItemsForCategory = (categoryName) => {
    const categoryData = fullMenuItems.find(item => item.category === categoryName);
    return categoryData ? categoryData.subItems : [];
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-30">
      <ul className="flex items-center justify-center py-4 px-12">
        {/* 햄버거 메뉴 아이콘 */}
        <li className="mr-10">
          <button
            aria-label="메뉴 열기"
            className="text-2xl text-black hover:text-blue-600 transition-colors"
            onMouseEnter={() => setIsHamburgerMenuOpen(true)} // 호버 시 전체 메뉴 열기
            onClick={toggleHamburgerMenu} // 클릭 시에도 토글 (접근성을 위해)
          >
            <RxHamburgerMenu />
          </button>
        </li>

        {/* 메인 메뉴 항목들 */}
        {topMenuItems.map((item, index) => {
          const subItems = getSubItemsForCategory(item.name);
          const hasSubItems = subItems.length > 0;

          return (
            <li
              key={item.name}
              className="relative" // 각 li가 드롭다운의 기준점이 됩니다.
              // 첫 번째 메뉴만 ml-4를 적용하지 않습니다.
              style={{ marginLeft: index > 0 ? '1rem' : '0' }}
              onMouseEnter={() => handleTopMenuItemMouseEnter(item.name)}
              onMouseLeave={handleAnyMouseLeave} // 해당 li에서 마우스 벗어나면 닫기
            >
              <Link
                to={item.path}
                className="text-black text-sm font-aggro font-light hover:text-blue-600 transition-colors duration-200 whitespace-nowrap px-2 py-1" // 클릭 가능한 영역 확장
              >
                {item.name}
              </Link>

              {/* 개별 드롭다운 메뉴 (해당 상위 메뉴에 호버되었을 때만 표시) */}
              {hoveredTopMenuCategory === item.name && hasSubItems && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-[1px] bg-white shadow-lg p-4 rounded-lg z-40 border border-gray-200 min-w-[180px]"
                  // 너비는 서브메뉴 콘텐츠에 따라 유동적으로 조절되도록 min-w 사용
                  // 필요에 따라 width: 'min(100% - Xpx, Ypx)' 스타일도 가능
                  onMouseEnter={() => setHoveredTopMenuCategory(item.name)} // 드롭다운 위로 마우스 이동 시 닫히지 않도록
                  onMouseLeave={handleAnyMouseLeave} // 드롭다운 벗어나면 닫기
                >
                  <ul>
                    {subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-1 last:mb-0">
                        <Link
                          to={`/category/${encodeURIComponent(item.name)}/${encodeURIComponent(subItem)}`}
                          className="block text-gray-700 hover:text-blue-500 text-xs whitespace-nowrap px-2 py-1"
                          onClick={handleAnyMouseLeave} // 서브메뉴 클릭 시 드롭다운 닫기
                        >
                          {subItem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* 햄버거 메뉴 전체 드롭다운 (조건부 렌더링) */}
      {isHamburgerMenuOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-10 z-35"
            onClick={closeHamburgerMenu} // 클릭 시 햄버거 메뉴 닫기
          ></div>

          {/* 햄버거 메뉴 본체 */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-[1px] bg-white shadow-lg p-8 rounded-lg z-40 border border-gray-200"
            style={{
              width: 'min(100% - 96px, 1330px)', // 기존 전체 메뉴 너비 유지
            }}
            onMouseLeave={closeHamburgerMenu} // 햄버거 메뉴 영역 벗어나면 닫기
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">전체 메뉴</h2>
              <button
                onClick={closeHamburgerMenu}
                className="text-gray-500 hover:text-gray-800 text-3xl"
                aria-label="메뉴 닫기"
              >
                <IoMdClose />
              </button>
            </div>

            {/* 메뉴 콘텐츠 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-4">
              {fullMenuItems.map((menuGroup, groupIndex) => (
                <div key={groupIndex} className="mb-2">
                  <h3 className="font-bold text-base mb-1 text-blue-700 border-b border-gray-300 pb-0.5">
                    {menuGroup.category}
                  </h3>
                  <ul>
                    {menuGroup.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-0.5">
                        <Link
                          to={`/category/${encodeURIComponent(menuGroup.category)}/${encodeURIComponent(subItem)}`}
                          className="text-gray-700 hover:text-blue-500 text-xs"
                          onClick={closeHamburgerMenu} // 햄버거 메뉴 항목 클릭 시 닫기
                        >
                          {subItem}
                        </Link>
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