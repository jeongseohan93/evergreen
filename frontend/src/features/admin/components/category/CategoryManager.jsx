import React from 'react';
import  useCategoryManagement  from './hooks/useCategoryManagements'

import  CategoryAddForm  from './ui/CategoryAddForm';
import  CategoryDeleteForm  from './ui/CategoryDeleteForm';


const CategoryManager = () => { 
  // useCategoryManagement Hook에서 필요한 상태와 함수들을 가져옵니다.
  const {
    categories,
    newCategoryName,
    setNewCategoryName,
    selectedCategoryToDelete,
    setSelectedCategoryToDelete,
    showCategoryForm,
    showDeleteCategoryForm,
    loading,
    error,
    handleAddCategory,
    handleDeleteCategory,
    toggleCategoryForm,
    toggleDeleteCategoryForm,
  } = useCategoryManagement(); // useCategoryManagement는 위에서 정의된 것을 사용

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">카테고리 관리</h2>

      {/* 카테고리 추가 버튼 및 폼 */}
      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <button
          onClick={toggleCategoryForm}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
        >
          {showCategoryForm ? '카테고리 추가 폼 닫기' : '새 카테고리 추가'}
        </button>
        {showCategoryForm && (
          <CategoryAddForm // CategoryAddForm은 위에서 정의된 것을 사용
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            loading={loading}
            error={error}
            toggleCategoryForm={toggleCategoryForm}
          />
        )}
      </div>

      {/* 카테고리 삭제 버튼 및 폼 */}
      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <button
          onClick={toggleDeleteCategoryForm}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mb-4"
        >
          {showDeleteCategoryForm ? '카테고리 삭제 폼 닫기' : '카테고리 삭제'}
        </button>
        {showDeleteCategoryForm && (
          <CategoryDeleteForm // CategoryDeleteForm은 위에서 정의된 것을 사용
            categories={categories}
            selectedCategoryToDelete={selectedCategoryToDelete}
            setSelectedCategoryToDelete={setSelectedCategoryToDelete}
            handleDeleteCategory={handleDeleteCategory}
            loading={loading}
            error={error}
            toggleDeleteCategoryForm={toggleDeleteCategoryForm}
          />
        )}
      </div>

      {/* 현재 카테고리 목록 표시 (간단 예시) */}
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3">현재 카테고리 목록 ({categories.length}개)</h3>
        {loading && <p>카테고리 불러오는 중...</p>}
        {error && !loading && <p className="text-red-500">목록 에러: {error}</p>}
        {!loading && !error && categories.length === 0 && <p>카테고리가 없습니다.</p>}
        <ul className="list-disc pl-5">
          {categories.map((category) => (
            <li key={category.category_id} className="py-1">
              {category.name} (ID: {category.category_id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;