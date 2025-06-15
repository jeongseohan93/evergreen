import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentTabs = ({ tabs = [], defaultFile }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const filePath = selectedTab?.file || defaultFile;
    if (!filePath) return;

    axios
      .get(filePath)
      .then((res) => setContent(res.data))
      .catch(() => setContent('불러오기 실패'));
  }, [selectedTab, defaultFile]);

  return (
    <div className="bg-white py-10">
  <div className="max-w-6xl mx-auto bg-gray-100 p-8 rounded-lg shadow-inner">
    {/* 흰색 박스 */}
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* 탭 버튼 영역 */}
      <div className="flex flex-wrap space-x-4 mb-6 border-b pb-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(tab)}
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
        {content}
      </div>
    </div>
  </div>
</div>

  

  );
};

export default ContentTabs;
