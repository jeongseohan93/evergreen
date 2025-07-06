// features/admin/pages/productPage/ProductSearch.jsx
import React from 'react';
// ProductList 컴포넌트를 임포트. ProductSearch.jsx와 같은 폴더에 있으므로 './' 사용
// ProductList 파일도 'export default' 하는 것을 가정하고 {} 없이 임포트
import ProductList from './ProductList'; // 이 줄을 추가

export const ProductSearch = ({ searchKeyword, setSearchKeyword, handleSearch, clearSearch, isSearching, searchResults, editingStock, toggleStockEdit, handleStockUpdate, categories }) => {
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

                {isSearching && searchResults.length > 0 && (
                    <div className="mt-10">
                        <h4 className="text-base font-bold font-aggro text-[#306f65]">검색 결과 ({searchResults.length}개)</h4>
                        <ProductList // 검색 결과도 ProductList 컴포넌트 재활용
                            products={searchResults}
                            editingStock={editingStock}
                            toggleStockEdit={toggleStockEdit}
                            handleStockUpdate={handleStockUpdate}
                            categories={categories}
                            />
                    </div>
                )}
                {isSearching && searchResults.length === 0 && (
                    <div className="flex justify-center items-center mt-20">
                        <p className="text-gray-600 text-xl font-aggro">검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default ProductSearch;