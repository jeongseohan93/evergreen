// features/admin/pages/productPage/ProductSearch.jsx
import React from 'react';
// ProductList 컴포넌트를 임포트. ProductSearch.jsx와 같은 폴더에 있으므로 './' 사용
// ProductList 파일도 'export default' 하는 것을 가정하고 {} 없이 임포트
import ProductList from './ProductList'; // 이 줄을 추가

export const ProductSearch = ({ searchKeyword, setSearchKeyword, handleSearch, clearSearch, isSearching, searchResults, editingStock, toggleStockEdit, handleStockUpdate, categories }) => {
    return (
        <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
            <h3>상품 검색</h3>
            <input
                type="text"
                placeholder="상품명 또는 키워드 입력"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                style={{ padding: '8px', marginRight: '10px', width: '300px' }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 15px', marginRight: '5px' }}>검색</button>
            <button onClick={clearSearch} style={{ padding: '8px 15px' }}>초기화</button>

            {isSearching && searchResults.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>검색 결과 ({searchResults.length}개)</h4>
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
                <p style={{ marginTop: '10px', color: '#555' }}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};


export default ProductSearch;