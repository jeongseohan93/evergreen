// src/features/admin/pages/productPage/ProductManagePage.jsx

import React from 'react';
// ⭐⭐ useProductManagement 훅의 임포트 경로 수정 (중괄호 제거) ⭐⭐
import useProductManagement from '../../components/product/hooks/useProductManagement'; // <-- default export로 가져옴

// 같은 폴더 내에 있는 컴포넌트들의 임포트 경로 (이전과 동일, 정확함)
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import ProductAddForm from './ProductAddForm';
import ProductErrorDisplay from './ProductErrorDisplay';
import ProductLoadingSpinner from './ProductLoadingSpinner';

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
        handleUpdateProduct,
        handleDeleteProduct 
    } = useProductManagement(); // <-- 여기서 호출하는 건 그대로

    const displayProducts = isSearching ? searchResults : products;
    const listTitle = isSearching ? `검색 결과 (${searchResults.length}개)` : '전체 상품 목록';

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="text-4xl font-aggro font-bold mb-4 text-black">상품 관리</h1>

            <ProductErrorDisplay error={error} />
            
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
                {loading ? ( 
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
                        handleDeleteProduct={handleDeleteProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManagePage;