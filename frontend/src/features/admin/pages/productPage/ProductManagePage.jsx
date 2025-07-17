// src/features/admin/pages/productPage/ProductManagePage.jsx

import React from 'react';
import useProductManagement from '../../components/product/hooks/useProductManagement'; // 경로 확인 필요

import ProductList from './ProductList';
import ProductSearch from './ProductSearch';
import ProductAddForm from './ProductAddForm';
import ProductErrorDisplay from './ProductErrorDisplay';
import ProductLoadingSpinner from './ProductLoadingSpinner';

const ProductManagePage = () => {
    const {
        products,
        categories,
        loading, // ⭐ loading 상태 받아옴 ⭐
        error,   // ⭐ error 상태 받아옴 ⭐
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
        handleDeleteProduct,
        // ⭐ useProductManagement 훅에서 반환하는 모든 필요한 값들을 정확히 받아옴 ⭐
        // ProductList (수정 모드)에서 사용될 핸들러
        handleSmallFileChange,      // useProductManagement에서 'handleSmallFileChangeForEdit'의 별칭으로 반환됨
        handleLargeFileChange,      // useProductManagement에서 'handleLargeFileChangeForEdit'의 별칭으로 반환됨
        // ProductAddForm (새 상품 추가)에서 사용될 핸들러 및 상태
        handleNewProductSmallFileChange, // ⭐ 새 상품용 핸들러 받아옴 ⭐
        handleNewProductLargeFileChange, // ⭐ 새 상품용 핸들러 받아옴 ⭐
        uploadingSmallImage,             // ⭐ 업로드 상태 받아옴 ⭐
        uploadingLargeImage,             // ⭐ 업로드 상태 받아옴 ⭐
        smallImageUploadMessage,         // ⭐ 메시지 상태 받아옴 ⭐
        largeImageUploadMessage          // ⭐ 메시지 상태 받아옴 ⭐
    } = useProductManagement();

    const displayProducts = isSearching ? searchResults : products;
    const listTitle = isSearching ? `검색 결과 (${searchResults.length}개)` : '전체 상품 목록';

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 className="text-4xl font-aggro font-bold mb-4 text-black">상품 관리</h1>

            <ProductErrorDisplay error={error} />

            <div style={{maxWidth: '1400px', margin: '0 auto'}}>
                <ProductAddForm
                    showAddForm={showAddForm}
                    toggleAddForm={toggleAddForm}
                    newProduct={newProduct}
                    handleInputChange={handleInputChange}
                    handleAddProduct={handleAddProduct}
                    categories={categories}
                    // ⭐ ProductAddForm에 새 상품용 핸들러 및 상태, 그리고 error/loading 전달 ⭐
                    handleNewProductSmallFileChange={handleNewProductSmallFileChange} // ⭐ 올바른 prop 이름으로 전달 ⭐
                    handleNewProductLargeFileChange={handleNewProductLargeFileChange} // ⭐ 올바른 prop 이름으로 전달 ⭐
                    uploadingSmallImage={uploadingSmallImage}
                    uploadingLargeImage={uploadingLargeImage}
                    smallImageUploadMessage={smallImageUploadMessage}
                    largeImageUploadMessage={largeImageUploadMessage}
                    error={error}   // ⭐ error 전달 ⭐
                    loading={loading} // ⭐ loading 전달 ⭐
                />
            </div>

            <div style={{maxWidth: '1400px', margin: '0 auto'}}>
                <ProductSearch
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    handleSearch={handleSearch}
                    clearSearch={clearSearch}
                    isSearching={isSearching}
                />
            </div>

            <div className="mt-30 mb-6 p-6 bg-white rounded-lg border border-[#306f65]" style={{maxWidth: '1400px', margin: '0 auto'}}>
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
                        // ⭐ ProductList에 수정 모드용 핸들러 전달 (useProductManagement에서 별칭으로 반환된 이름 그대로) ⭐
                        handleSmallFileChange={handleSmallFileChange} // useProductManagement에서 반환된 이름
                        handleLargeFileChange={handleLargeFileChange} // useProductManagement에서 반환된 이름
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManagePage;
