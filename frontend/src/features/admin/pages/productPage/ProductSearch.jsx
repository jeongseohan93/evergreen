// features/admin/pages/productPage/ProductSearch.jsx

import React from 'react';

// ProductList는 여기서 임포트하지 않습니다. ProductManagePage.jsx에서 렌더링할 것입니다.
// import ProductList from './ProductList'; // 이 줄을 제거하세요!

// ProductSearch는 검색 관련 prop만 받습니다.
export const ProductSearch = ({
    searchKeyword,
    setSearchKeyword,
    handleSearch,
    clearSearch,
    isSearching,
    // searchResults, editingStock, toggleStockEdit, handleStockUpdate, categories
    // 위 props들은 ProductSearch 컴포넌트에서 직접 사용되지 않으므로 제거합니다.
}) => {
    return (
        <div className="mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
            <div className="mb-5 p-4">
                <h3 className="text-2xl font-bold font-aggro text-gray-800 mb-4">상품 검색</h3>
                <input
                    type="text"
                    placeholder="상품명 또는 키워드 입력"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent mr-3 w-80"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#306f65] text-white rounded-md border hover:bg-white hover:border-[#306f65] hover:text-[#306f65] transition-colors duration-200 mr-2"
                >
                    검색
                </button>
                <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                    초기화
                </button>

                {/* // !!! 여기에 있던 검색 결과 렌더링 로직 (ProductList 컴포넌트 사용 부분 포함)을 모두 제거합니다.
                // 이 로직은 ProductManagePage.jsx에서 처리되어야 합니다.
                // isSearching && searchResults.length > 0
                // isSearching && searchResults.length === 0
                // 이 조건부 렌더링 블록 전체를 제거하세요.
                */}
            </div>
        </div>
    );
};

export default ProductSearch;