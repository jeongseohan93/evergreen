// src/features/admin/components/category/CategoryManager.js
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // 더 이상 navigate를 사용하지 않으므로 제거 가능
import useCategoryManagement from '../../components/category/hooks/useCategoryManagements';

import CategoryAddForm from './CategoryAddForm';
import CategoryDeleteForm from './CategoryDeleteForm';
import CategoryUpdateForm from './CategoryUpdateForm';


// onCategoryClick prop을 받도록 수정
const CategoryManager = ({ onCategoryClick }) => { 
  // const navigate = useNavigate(); // useNavigate 훅 제거

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
    setSelectedCategoryToDelete: setHookSelectedCategoryToDelete
  } = useCategoryManagement();


  const categoryIdToDelete = selectedCategoryToDelete ? selectedCategoryToDelete.category_id.toString() : '';

  const handleSelectCategoryToDeleteInForm = (categoryIdString) => {
    const foundCategory = categories.find(cat => cat.category_id.toString() === categoryIdString);
    setHookSelectedCategoryToDelete(foundCategory || null);
  };

  // 카테고리 이름을 클릭했을 때 AdminLayout에 알리는 함수
  const handleCategoryNameClick = (categoryId) => {
      // navigate 대신 onCategoryClick prop으로 받은 함수 호출
      if (onCategoryClick) {
          onCategoryClick(categoryId); 
      }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 상단: 카테고리 관리 제목 + 버튼 2개 (오른쪽 정렬) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold font-aggro text-gray-800">카테고리 관리</h2>
        <div className="flex gap-2 bg-transparent items-center h-12">
          <button
            className="h-12 flex items-center px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#306f65] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#306f65]"
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

      {/* 카테고리 추가 폼 */}
      {showCategoryForm && (
        <div className="border border-[#306f65] p-4 rounded-lg bg-gray-50">
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

      {/* 카테고리 삭제 폼 */}
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

      {/* 카테고리 수정 폼 (editingCategory가 null이 아닐 때만 표시) */}
      {editingCategory && (
        <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">카테고리 수정</h3>
          <CategoryUpdateForm
            category={editingCategory} // 수정할 카테고리 객체 전달
            handleUpdateCategory={handleUpdateCategory}
            closeUpdateForm={closeUpdateForm}
            loading={loading}
            error={error}
          />
        </div>
      )}

      {/* 현재 카테고리 목록 표시 */}
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3">현재 카테고리 목록 ({categories.length}개)</h3>
        {loading && <p>카테고리 불러오는 중...</p>}
        {error && !loading && <p className="text-red-500">목록 에러: {error}</p>}
        {!loading && !error && categories.length === 0 && <p>카테고리가 없습니다.</p>}
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
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;