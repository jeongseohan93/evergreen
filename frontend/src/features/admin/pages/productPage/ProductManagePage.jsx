// features/admin/pages/productPage/ProductManagePage.jsx

import React from 'react';
// useProductManagement 훅의 임포트 경로 수정
import useProductManagement from '../../components/product/hooks/useProductManagement';

import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import ProductAddForm from './ProductAddForm';
import ProductErrorDisplay from './ProductErrorDisplay';
import ProductLoadingSpinner from './ProductLoadingSpinner';

const ProductManagePage = () => {
    // useProductManagement 훅으로부터 필요한 상태와 함수들을 가져옴
    // fetchAllProducts는 초기 로드에만 사용되고 외부에서 직접 호출하지 않는다고 가정하고
    // return 값에서 제거하여 ESLint 경고를 없애는 방향으로 진행
    const {
        products,
        categories,
        loading,
        error,
        searchKeyword,
        setSearchKeyword,
        searchResults,
        isSearching,
        editingStock,
        showAddForm,
        newProduct,
        // fetchAllProducts, // 필요 없으면 이 줄 제거
        // fetchCategories, // 필요 없으면 이 줄 제거
        clearSearch,
        handleSearch,
        handleStockUpdate,
        toggleStockEdit,
        toggleAddForm,
        handleInputChange,
        handleAddProduct
    } = useProductManagement();

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="text-4xl font-aggro font-bold mb-4 text-black">상품 관리</h1>

            {/* 에러 메시지 표시 컴포넌트 */}
            <ProductErrorDisplay error={error} />
            {/* 로딩 스피너 표시 컴포넌트 */}
            <ProductLoadingSpinner loading={loading} />

            {/* 새 상품 추가 폼 컴포넌트 */}
            <ProductAddForm
                showAddForm={showAddForm}
                toggleAddForm={toggleAddForm}
                newProduct={newProduct}
                handleInputChange={handleInputChange}
                handleAddProduct={handleAddProduct}
                categories={categories} // 카테고리 드롭다운에 필요
                />

            {/* 상품 검색 섹션 컴포넌트 */}
            <ProductSearch
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                isSearching={isSearching}
                searchResults={searchResults}
                editingStock={editingStock}
                toggleStockEdit={toggleStockEdit}
                handleStockUpdate={handleStockUpdate}
                categories={categories} // 검색 결과 리스트에도 카테고리 정보 전달
                />

            {/* 상품 목록 섹션 (검색 중이 아니거나 검색 결과가 없을 때만 전체 목록 표시) */}
            {!isSearching && (
                <div className="mt-30 mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
                    <h2 className="text-2xl font-aggro font-bold mb-4 text-black">전체 상품 목록</h2>
                    <ProductList
                        products={products}
                        editingStock={editingStock}
                        toggleStockEdit={toggleStockEdit}
                        handleStockUpdate={handleStockUpdate}
                        categories={categories} // 상품 목록에도 카테고리 정보 전달
                        />
                </div>
            )}
        </div>
    );
};

export default ProductManagePage;