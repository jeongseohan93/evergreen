// src/features/admin/components/category/CategoryManager.js
import React from 'react';
import useCategoryManagement from '../../components/category/hooks/useCategoryManagements';

import CategoryAddForm from './CategoryAddForm';
import CategoryDeleteForm from './CategoryDeleteForm';
import CategoryUpdateForm from './CategoryUpdateForm'; // 카테고리 수정 폼 컴포넌트 임포트


const CategoryManager = () => {
  const {
    categories,
    newCategoryName,
    setNewCategoryName,
    selectedCategoryToDelete, // 현재는 객체 또는 null
    showCategoryForm,
    showDeleteCategoryForm,
    loading,
    error,
    handleAddCategory,
    handleDeleteCategory,
    // 수정 기능을 위해 useCategoryManagement 훅에서 다음 값들을 가져옵니다.
    handleUpdateCategory, // 카테고리 수정 처리 함수
    openAddForm,
    closeAddForm,
    openDeleteForm,
    closeDeleteForm,
    openUpdateForm,       // 수정 폼을 열기 위한 함수
    closeUpdateForm,      // 수정 폼을 닫기 위한 함수
    editingCategory,      // 현재 수정 중인 카테고리 객체 (null이면 수정 폼 숨김)
    setSelectedCategoryToDelete: setHookSelectedCategoryToDelete // 이름 충돌 방지를 위해 별칭 부여
  } = useCategoryManagement();


  // CategoryDeleteForm에 전달할 selectedCategoryToDelete 값을 변환
  // CategoryDeleteForm은 문자열 ID를 기대하므로, 객체에서 ID를 추출하여 전달
  const categoryIdToDelete = selectedCategoryToDelete ? selectedCategoryToDelete.category_id.toString() : '';

  // CategoryDeleteForm의 setSelectedCategoryToDelete Prop에 전달할 함수
  // CategoryDeleteForm에서 받은 문자열 ID를 다시 카테고리 객체로 변환하여 훅에 전달
  const handleSelectCategoryToDeleteInForm = (categoryIdString) => {
    const foundCategory = categories.find(cat => cat.category_id.toString() === categoryIdString);
    setHookSelectedCategoryToDelete(foundCategory || null); // 훅의 setSelectedCategoryToDelete를 사용
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">카테고리 관리</h2>

      {/* 카테고리 추가 버튼 및 폼 */}
      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <button
          onClick={showCategoryForm ? closeAddForm : openAddForm}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
        >
          {showCategoryForm ? '카테고리 추가 폼 닫기' : '새 카테고리 추가'}
        </button>
        {showCategoryForm && (
          <CategoryAddForm
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            loading={loading}
            error={error}
            toggleCategoryForm={closeAddForm}
          />
        )}
      </div>

      {/* 카테고리 삭제 버튼 및 폼 */}
      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <button
          onClick={showDeleteCategoryForm ? closeDeleteForm : () => openDeleteForm(null)}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mb-4"
        >
          {showDeleteCategoryForm ? '카테고리 삭제 폼 닫기' : '카테고리 삭제'}
        </button>
        {showDeleteCategoryForm && (
          <CategoryDeleteForm
            categories={categories}
            selectedCategoryToDelete={categoryIdToDelete}
            setSelectedCategoryToDelete={handleSelectCategoryToDeleteInForm}
            handleDeleteCategory={handleDeleteCategory}
            loading={loading}
            error={error}
            toggleDeleteCategoryForm={closeDeleteForm}
          />
        )}
      </div>

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
              <span>{category.name} (ID: {category.category_id})</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => openUpdateForm(category)} // 수정 버튼 클릭 시 수정 폼 열기
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </button>
                {/* 개별 삭제 버튼을 제거합니다. */}
                {/*
                <button
                  onClick={() => openDeleteForm(category)} // 삭제 버튼 클릭 시 삭제 폼 열기
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
                */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
