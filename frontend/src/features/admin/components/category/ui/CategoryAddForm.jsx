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
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-3">카테고리 추가</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleAddCategory} className="space-y-3">
        <div>
          <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">
            카테고리명:
          </label>
          <input
            type="text"
            id="newCategoryName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={toggleCategoryForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '추가 중...' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryAddForm;