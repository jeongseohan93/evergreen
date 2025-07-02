// src/shared/components/SearchFilterBar/SearchFilterBar.jsx
import React, { useState } from 'react';

const SearchFilterBar = ({
    filterOptions = [], // 예: [{ value: 'week', label: '일주일' }, { value: 'month', label: '한 달' }]
    searchOptions = [], // 예: [{ value: 'title', label: '제목' }, { value: 'writer', label: '작성자' }]
    onSearch // 검색 버튼 클릭 시 호출될 콜백 함수
}) => {
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]?.value || '');
    const [selectedSearchType, setSelectedSearchType] = useState(searchOptions[0]?.value || '');
    const [searchText, setSearchText] = useState('');

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch({
                filter: selectedFilter,
                searchType: selectedSearchType,
                query: searchText
            });
        }
    };

    return (
        <div className="w-full p-4 bg-white border-t border-gray-200 mt-8"> {/* mt-8로 스크린샷처럼 상단 테이블과 간격 */}
            <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium whitespace-nowrap">검색어</span>
                
                {/* 필터 드롭다운 (예: 일주일, 한 달) */}
                <select
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                >
                    {filterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* 검색 유형 드롭다운 (예: 제목, 작성자) */}
                <select
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedSearchType}
                    onChange={(e) => setSelectedSearchType(e.target.value)}
                >
                    {searchOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* 검색어 입력 필드 */}
                <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* 찾기 버튼 */}
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    onClick={handleSearchClick}
                >
                    찾기
                </button>
            </div>
        </div>
    );
};

export default SearchFilterBar;