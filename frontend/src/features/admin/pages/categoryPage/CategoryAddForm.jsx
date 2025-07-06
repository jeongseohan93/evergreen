import React from 'react';

const CategoryAddForm = ({ // export 제거
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  loading,
  error,
  toggleCategoryForm
}) => {
  return (
    <>
      <h3 className="text-2xl mb-3 font-aggro font-bold">카테고리 추가</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleAddCategory} className="space-y-3">
        <div>
          <label htmlFor="newCategoryName" className="block text-base text-gray-700 font-bold text-[#58bcb5]">
            카테고리명:
          </label>
          <input
            type="text"
            id="newCategoryName"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-[#58bcb5] focus:outline-none"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={toggleCategoryForm}
            className="px-4 py-2 bg-[#58bcb5] border text-white rounded-md hover:bg-white hover:text-[#58bcb5] hover:border-[#58bcb5]"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#306f65] border text-white rounded-md hover:bg-white hover:text-[#306f65] hover:border-[#306f65]"
            disabled={loading}
          >
            {loading ? '추가 중...' : '추가'}
          </button>
        </div>
      </form>
    </>
  );
};

export default CategoryAddForm;