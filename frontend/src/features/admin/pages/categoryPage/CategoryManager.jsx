// src/features/admin/pages/categoryPage/CategoryManager.js
import React, { useState } from 'react'; // ⭐ useState 임포트 활성화 ⭐
// import { useNavigate } from 'react-router-dom'; // 사용하지 않으므로 제거 가능
import useCategoryManagement from '../../components/category/hooks/useCategoryManagements';

import CategoryAddForm from './CategoryAddForm';
import CategoryDeleteForm from './CategoryDeleteForm';
import CategoryUpdateForm from './CategoryUpdateForm';
import CategoryProductList from './CategoryProductList'; 


const CategoryManager = () => { 
  const [selectedCategoryIdForProducts, setSelectedCategoryIdForProducts] = useState(null);

  const {
    categories,
    newCategoryName,
    setNewCategoryName,
    selectedCategoryToDelete,
    showCategoryForm,
    showDeleteCategoryForm,
    loading,
    error,
    handleAddCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    openAddForm,
    closeAddForm,
    openDeleteForm,
    closeDeleteForm,
    openUpdateForm,
    closeUpdateForm,
    editingCategory,
    setSelectedCategoryToDelete: setHookSelectedCategoryToDelete // 훅의 setSelectedCategoryToDelete를 별칭으로 받음
  } = useCategoryManagement();


  const categoryIdToDelete = selectedCategoryToDelete ? selectedCategoryToDelete.category_id.toString() : '';

  const handleSelectCategoryToDeleteInForm = (categoryIdString) => {
    const foundCategory = categories.find(cat => cat.category_id.toString() === categoryIdString);
    setHookSelectedCategoryToDelete(foundCategory || null); // 훅의 setter 호출
  };

  const handleCategoryNameClick = (categoryId) => {
      setSelectedCategoryIdForProducts(categoryId);
  };

  const handleBackToCategoryManager = () => {
    setSelectedCategoryIdForProducts(null);
  };


  if (selectedCategoryIdForProducts) {
    return (
      <div>
        <button
          onClick={handleBackToCategoryManager}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          ← 돌아가기
        </button>
        <CategoryProductList categoryId={selectedCategoryIdForProducts} />
      </div>
    );
  }


  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold font-aggro text-gray-800">카테고리 관리</h2>
        <div className="flex gap-2 bg-transparent items-center h-12">
          <button
            className="h-12 flex items-center px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#26574f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#306f65]"
            onClick={showCategoryForm ? closeAddForm : openAddForm}
          >
            {showCategoryForm ? '카테고리 추가 폼 닫기' : '새 카테고리 추가'}
          </button>
          <button
            className="h-12 flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={showDeleteCategoryForm ? closeDeleteForm : () => openDeleteForm(null)}
          >
            {showDeleteCategoryForm ? '카테고리 삭제 폼 닫기' : '카테고리 삭제'}
          </button>
        </div>
      </div>

      {showCategoryForm && (
        <div className="border border-[#306f65]  p-4 rounded-lg bg-gray-50">
          <CategoryAddForm
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            loading={loading}
            error={error}
            toggleCategoryForm={closeAddForm}
          />
        </div>
      )}

      {showDeleteCategoryForm && (
        <div className="border border-[#306f65] p-4 rounded-lg bg-gray-50">
          <CategoryDeleteForm
            categories={categories}
            selectedCategoryToDelete={categoryIdToDelete}
            setSelectedCategoryToDelete={handleSelectCategoryToDeleteInForm}
            handleDeleteCategory={handleDeleteCategory}
            loading={loading}
            error={error}
            toggleDeleteCategoryForm={closeDeleteForm}
          />
        </div>
      )}

      {editingCategory && (
        <div className="border border-[#306f65] p-4 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-2xl font-aggro font-bold mb-3">카테고리 수정</h3>
          <CategoryUpdateForm
            category={editingCategory}
            handleUpdateCategory={handleUpdateCategory}
            closeUpdateForm={closeUpdateForm}
            loading={loading}
            error={error}
          />
        </div>
      )}

      <div className="border border-[#306f65] p-4 rounded-lg shadow-sm bg-white">
        <h3 className="text-2xl font-bold font-aggro mb-3">현재 카테고리 목록 ({categories.length}개)</h3>
        {loading && <p>카테고리 불러오는 중...</p>}
        {error && !loading && <p className="text-red-500">목록 에러: {error}</p>}
        {!loading && !error && categories.length === 0 && <p>카테고리가 없습니다.</p>}
        {/* ⭐ categories가 배열이 아닐 때 map 호출 방지 (useCategoryManagement 수정으로 해결됨) ⭐ */}
        {!loading && !error && categories.length > 0 && (
          <ul className="list-disc pl-5">
            {categories.map((category) => (
              <li key={category.category_id} className="py-1 flex items-center justify-between">
                <button
                    onClick={() => handleCategoryNameClick(category.category_id)}
                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                >
                    {category.name}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openUpdateForm(category)}
                    className="px-2 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5]"
                  >
                    수정
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;