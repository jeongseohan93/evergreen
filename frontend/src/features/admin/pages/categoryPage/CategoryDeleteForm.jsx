import React, { useState } from 'react';
import  ConfirmationModal  from '../../components/ui/ConfirmationModal';



const CategoryDeleteForm = ({ // export 제거
  categories,
  selectedCategoryToDelete,
  setSelectedCategoryToDelete,
  handleDeleteCategory,
  loading,
  error,
  toggleDeleteCategoryForm
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const categoryName = selectedCategoryToDelete
    ? categories.find(cat => cat.category_id.toString() === selectedCategoryToDelete)?.name
    : '';

  const handleConfirmDelete = () => {
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleExecuteDelete = () => {
    setShowConfirmModal(false);
    handleDeleteCategory();
  };

  return (
    <>
      <h3 className="text-2xl mb-3 font-aggro font-bold">카테고리 삭제</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="space-y-3">
        <div>
          <label htmlFor="selectCategoryToDelete" className="block text-base font-bold text-gray-700 text-[#58bcb5]">
            삭제할 카테고리:
          </label>
          <select
            id="selectCategoryToDelete"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-[#58bcb5] focus:outline-none"
            value={selectedCategoryToDelete}
            onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
            disabled={loading}
          >
            <option value="">-- 카테고리 선택 --</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={toggleDeleteCategoryForm}
            className="px-4 py-2 bg-[#58bcb5] border text-white rounded-md hover:bg-white hover:text-[#58bcb5] hover:border-[#58bcb5]"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            disabled={loading || !selectedCategoryToDelete}
          >
            {loading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </form>

      {/* 확인 모달: window.confirm 대체 */}
      {showConfirmModal && (
        <ConfirmationModal // ConfirmationModal은 위에서 정의된 것을 사용
          title="카테고리 삭제 확인"
          message={`"${categoryName}" 카테고리를 정말 삭제하시겠습니까?`}
          onConfirm={handleExecuteDelete}
          onCancel={handleCancelDelete}
          confirmButtonText="삭제"
          cancelButtonText="취소"
        />
      )}
    </>
  );
};

export default CategoryDeleteForm;