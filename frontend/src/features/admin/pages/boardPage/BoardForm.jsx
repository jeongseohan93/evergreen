// frontend/src/features/admin/pages/boardPage/BoardForm.jsx
import React, { useState, useEffect } from 'react';

function BoardForm({ initialData, onSave, onCancel }) {
  // initialData에 board_id가 있는지로 수정 모드/새 작성 모드 판단
  const isEditing = initialData && initialData.board_id;

  // formData 초기 상태 설정
  const [formData, setFormData] = useState(() => {
    if (isEditing) {
      return {
        title: initialData.title || '',
        content: initialData.content?.text || '',
        name: initialData.User?.name || '', // initialData.User가 있을 경우 name 사용
        user_id: initialData.user_id || '2ead8476-78a0-4599-885b-dbe7a8bf3700', // 임시 테스트용
        notice: initialData.notice || 'N',
        enum: initialData.enum || 'review',
        reply: initialData.reply || '',
        like_count: initialData.like_count || 0,
        hate_count: initialData.hate_count || 0,
      };
    } else {
      // 새 게시글 작성 시, BoardManager에서 넘겨준 enum 값을 사용
      return {
        title: '',
        content: '',
        name: '', // 새 글 작성 시 이름은 백엔드에서 채워질 예정
        user_id: '2ead8476-78a0-4599-885b-dbe7a8bf3700', // 임시 테스트용
        notice: 'N',
        enum: initialData?.enum || 'review', // BoardManager에서 전달받은 enum 사용 또는 기본값 'review'
        reply: '', // 새 글은 답변, 좋아요, 싫어요가 없음
        like_count: 0,
        hate_count: 0,
      };
    }
  });

  // initialData가 변경될 때마다 폼 데이터 업데이트 (수정 모드 전환 시 등)
  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content?.text || '',
        name: initialData.User?.name || '',
        user_id: initialData.user_id || '2ead8476-78a0-4599-885b-dbe7a8bf3700',
        notice: initialData.notice || 'N',
        enum: initialData.enum || 'review',
        reply: initialData.reply || '',
        like_count: initialData.like_count || 0,
        hate_count: initialData.hate_count || 0,
      });
    } else {
      // 새 게시글 작성 모드로 전환될 때 폼 초기화
      setFormData(prev => ({
        ...prev, // 기존 user_id, name 등 유지
        title: '',
        content: '',
        // name: '', // 새 글 작성 시 이름은 백엔드에서 채워지므로 초기화만
        notice: 'N',
        enum: initialData?.enum || 'review', // BoardManager에서 전달받은 enum 사용
        reply: '',
        like_count: 0,
        hate_count: 0,
      }));
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      content: { text: formData.content }
      // 'name' 필드는 프론트에서 더 이상 받지 않고 백엔드에서 user_id로 조회하여 채움
    };
    onSave(dataToSave);
  };

  // 폼 제목 결정
  const formTitle = isEditing ? '게시글 수정' : '새 게시글 작성';
  // 표시될 게시판 타입 이름
  const displayBoardType = formData.enum === 'review' ? '사용후기 게시판' : '자유 게시판';

  return (
    <div className="p-5 mt-5 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {formTitle}
      </h2>
      {/* 🚩 추가: 게시판 타입 명시 */}
      <p className="text-lg text-gray-600 mb-4">
        <span className="font-semibold">게시판:</span> {displayBoardType}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 text-gray-700 font-medium">제목:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="content" className="mb-1 text-gray-700 font-medium">내용:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notice"
            name="notice"
            checked={formData.notice === 'Y'}
            onChange={handleChange}
            className="w-4 h-4 text-[#58bcb5] border-gray-300 rounded focus:ring-[#306f65]"
          />
          <label htmlFor="notice" className="text-gray-700 font-medium">공지사항</label>
        </div>
        {/* 🚩 제거: 게시판 타입 선택 드롭다운 (자동 설정 및 명시되므로 불필요) */}
        {/*
        <div className="flex flex-col">
          <label htmlFor="enum" className="mb-1 text-gray-700 font-medium">타입:</label>
          <select
            id="enum"
            name="enum"
            value={formData.enum}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent bg-white appearance-none"
          >
            <option value="review">사용후기</option>
            <option value="free">자유</option>
          </select>
        </div>
        */}
        {isEditing && ( // 수정 모드일 때만 답변, 좋아요, 싫어요 필드 표시
          <>
            <div className="flex flex-col">
              <label htmlFor="reply" className="mb-1 text-gray-700 font-medium">답변 (Reply):</label>
              <textarea
                id="reply"
                name="reply"
                value={formData.reply}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="like_count" className="mb-1 text-gray-700 font-medium">좋아요 수:</label>
              <input
                type="number"
                id="like_count"
                name="like_count"
                value={formData.like_count}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="hate_count" className="mb-1 text-gray-700 font-medium">싫어요 수:</label>
              <input
                type="number"
                id="hate_count"
                name="hate_count"
                value={formData.hate_count}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
              />
            </div>
          </>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2 cursor-pointer text-white border-none rounded-md transition-colors bg-[#58bcb5] hover:bg-[#4a9f99] font-medium"
          >
            {formTitle === '게시글 수정' ? '게시글 수정' : '게시글 작성'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 cursor-pointer text-white border-none rounded-md transition-colors bg-gray-400 hover:bg-gray-500 font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardForm;