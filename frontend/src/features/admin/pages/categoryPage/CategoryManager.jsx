// CategoryManager.js
import React from 'react';
import useCategoryManagement from '../../components/category/hooks/useCategoryManagements';

import CategoryAddForm from './CategoryAddForm';
import CategoryDeleteForm from './CategoryDeleteForm';


const CategoryManager = () => {
  const {
    categories,
    newCategoryName,
    setNewCategoryName,
    selectedCategoryToDelete, // 현재는 객체 또는 null
    // setSelectedCategoryToDelete, // 이 함수를 직접 사용하면 타입 불일치 발생!
    showCategoryForm,
    showDeleteCategoryForm,
    loading,
    error,
    handleAddCategory,
    handleDeleteCategory,
    openAddForm,
    closeAddForm,
    openDeleteForm,
    closeDeleteForm,
    // useCategoryManagement 훅의 setSelectedCategoryToDelete 함수도 가져와야 함 (이전 대화에서 추가했었지?)
    // 만약 훅에서 직접 반환하지 않는다면 이 부분은 불가능함.
    // 훅에서 반환하는 setSelectedCategoryToDelete 함수를 가져왔다고 가정하고 진행.
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
            // 🚨🚨🚨 이 부분 수정: 객체에서 ID(문자열)를 추출하여 전달
            selectedCategoryToDelete={categoryIdToDelete}
            // 🚨🚨🚨 이 부분 수정: 폼에서 받은 ID(문자열)를 객체로 변환하여 훅에 전달하는 함수
            setSelectedCategoryToDelete={handleSelectCategoryToDeleteInForm}
            handleDeleteCategory={handleDeleteCategory}
            loading={loading}
            error={error}
            toggleDeleteCategoryForm={closeDeleteForm}
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
            <li key={category.category_id} className="py-1 flex items-center justify-between">
              <span>{category.name} (ID: {category.category_id})</span>
              {/* 목록에서 개별 삭제 버튼을 추가하는 것도 고려해볼 수 있어 */}
              <button
                onClick={() => openDeleteForm(category)} // 해당 카테고리 객체를 넘겨주며 삭제 폼 열기
                className="ml-4 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;