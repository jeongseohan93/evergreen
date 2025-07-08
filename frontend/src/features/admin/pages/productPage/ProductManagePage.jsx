// features/admin/pages/productPage/ProductManagePage.jsx

import React from 'react';
// useProductManagement 훅의 임포트 경로 수정
import useProductManagement from '../../components/product/hooks/useProductManagement';

import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import ProductAddForm from './ProductAddForm';
import ProductErrorDisplay from './ProductErrorDisplay';
import ProductLoadingSpinner from './ProductLoadingSpinner'; // <-- 기존 경로 그대로 사용!

const ProductManagePage = () => {
    const {
        products,
        categories,
        loading,
        error,
        searchKeyword,
        setSearchKeyword,
        searchResults,
        isSearching,
        showAddForm,
        newProduct,
        clearSearch,
        handleSearch,
        toggleAddForm,
        handleInputChange,
        handleAddProduct,
        editingProduct,
        toggleEditMode,
        handleEditInputChange,
        handleUpdateProduct
    } = useProductManagement();

    const displayProducts = isSearching ? searchResults : products;
    const listTitle = isSearching ? `검색 결과 (${searchResults.length}개)` : '전체 상품 목록';

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="text-4xl font-aggro font-bold mb-4 text-black">상품 관리</h1>

            <ProductErrorDisplay error={error} />
            
            {/* 이 위치의 스피너는 제거합니다. (목록 영역 스피너를 사용할 것이므로) */}
            {/* {loading && <ProductLoadingSpinner loading={loading} />} */}
            
            <ProductAddForm
                showAddForm={showAddForm}
                toggleAddForm={toggleAddForm}
                newProduct={newProduct}
                handleInputChange={handleInputChange}
                handleAddProduct={handleAddProduct}
                categories={categories}
            />

            <ProductSearch
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                isSearching={isSearching}
            />

            <div className="mt-30 mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
                <h2 className="text-2xl font-aggro font-bold mb-4 text-black">{listTitle}</h2>
                {/* 여기에서만 로딩 스피너를 조건부 렌더링합니다. */}
                {loading ? ( // <<<<< 여기만 스피너를 남깁니다.
                    <ProductLoadingSpinner loading={loading} />
                ) : displayProducts.length === 0 && isSearching ? (
                    <p className="text-center py-3 text-gray-500">검색 결과가 없습니다.</p>
                ) : displayProducts.length === 0 && !isSearching ? (
                    <p className="text-center py-3 text-gray-500">등록된 상품이 없습니다.</p>
                ) : (
                    <ProductList
                        products={displayProducts}
                        categories={categories}
                        editingProduct={editingProduct}
                        toggleEditMode={toggleEditMode}
                        handleEditInputChange={handleEditInputChange}
                        handleUpdateProduct={handleUpdateProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManagePage;