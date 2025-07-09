// src/features/admin/components/category/CategoryUpdateForm.js

import React, { useState, useEffect } from 'react';

const CategoryUpdateForm = ({ category, handleUpdateCategory, closeUpdateForm, loading, error }) => {
  // 수정할 카테고리의 현재 이름을 초기값으로 설정
  const [updatedCategoryName, setUpdatedCategoryName] = useState(category.name);

  // category prop이 변경될 때 (예: 다른 카테고리 선택 시) 입력 필드 값을 업데이트합니다.
  useEffect(() => {
    setUpdatedCategoryName(category.name);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handleUpdateCategory 함수에 카테고리 ID와 사용자가 입력한 새로운 이름을 전달합니다.
    handleUpdateCategory(category.category_id, updatedCategoryName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="updateCategoryName" className="text-base font-semibold text-gray-500 mb-1">
          카테고리 ID: {category.category_id}
        </label>
        <label htmlFor="updateCategoryName" className="text-base font-medium text-gray-500 mb-1">
          새 카테고리 이름
        </label>
        <input
          type="text"
          id="updateCategoryName"
          value={updatedCategoryName}
          onChange={(e) => setUpdatedCategoryName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-[#306f65] sm:text-sm"
          placeholder="새 카테고리 이름 입력"
          disabled={loading} // 로딩 중에는 입력 비활성화
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>} {/* 에러 메시지 표시 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={closeUpdateForm} // 취소 버튼 클릭 시 수정 폼 닫기
          className="px-4 py-2 bg-[#58bcb5] border text-white rounded-md hover:bg-white hover:text-[#58bcb5] hover:border-[#58bcb5]"
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#306f65] border text-white rounded-md hover:bg-white hover:text-[#306f65] hover:border-[#306f65]"
          disabled={loading} // 로딩 중에는 버튼 비활성화
        >
          {loading ? '수정 중...' : '수정 완료'}
        </button>
      </div>
    </form>
  );
};

export default CategoryUpdateForm;
