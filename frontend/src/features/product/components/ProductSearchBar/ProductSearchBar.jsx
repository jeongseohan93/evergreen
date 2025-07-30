// src/shared/components/SearchBar/SearchBar.jsx (ProductSearchBar로 이름 변경 가정)
import React, { useState, useEffect } from 'react'; // useEffect 추가 (value prop을 받기 위해)

const ProductSearchBar = ({ onSearch, value }) => { // 🚨 value prop 추가
    // 내부 상태는 더 이상 필요 없고, prop으로 받은 value를 직접 사용
    const [searchTerm, setSearchTerm] = useState(value || ''); // prop으로 받은 value로 초기화

    // value prop이 변경될 때 내부 searchTerm 상태를 업데이트
    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchTerm); // 검색어 전달
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-white h-56 border-b border-gray-200 mb-10 ">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">상품검색</h1>
            <div className="relative w-full max-w-lg">
                <input
                    type="text"
                    className="w-full py-3 px-4 pr-12 border-b-2 border-gray-300 focus:border-gray-500 outline-none text-xl text-gray-800 placeholder-gray-400 transition-colors duration-200"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm} // 🚨 여기에 value prop 연결
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="absolute right-0 bottom-0 top-0 px-4 flex items-center justify-center text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={handleSearchClick}
                    aria-label="검색"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProductSearchBar;