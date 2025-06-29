// components/ContentTabs.jsx
import React from "react";
import useTabs from "../../hooks/useTabs";

const ContentTabs = ({ tabs = [], defaultFile }) => {
  const { selectedTab, setSelectedTab, content, isLoading, error } = useTabs({ tabs, defaultFile });

  // 탭이 아예 없는 경우 렌더링하지 않음
  if (!selectedTab) {
    return (
        <div className="bg-white py-10">
            <div className="max-w-6xl mx-auto bg-gray-100 p-8 rounded-lg shadow-inner">
                탭 데이터가 없습니다.
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto bg-gray-100 p-8 rounded-lg shadow-inner">
        {/* 흰색 박스 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* 탭 버튼 영역 */}
          <div className="flex flex-wrap space-x-4 mb-6 border-b pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.file} // index보다 고유한 값인 file을 key로 사용
                onClick={() => setSelectedTab(tab)} // 클릭 핸들러 구현
                className={`px-4 py-2 text-sm whitespace-nowrap ${
                  selectedTab.label === tab.label
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
    
          {/* 내용 영역 */}
          <div className="p-4 whitespace-pre-wrap text-sm leading-relaxed h-[400px] overflow-y-auto">
            {isLoading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">내용을 불러오는 데 실패했습니다.</p>}
            {!isLoading && !error && content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTabs;