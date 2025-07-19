import React, { useState, useEffect } from 'react';

// currentBoardType 프롭을 추가합니다.
function BoardForm({ initialData, onSave, onCancel, currentUserId, currentBoardType }) { 
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    notice: 'N', // 기본값 'N'
    enum: 'review', // 기본값 'review' (새 게시글 시 기본값)
    user_id: initialData?.user_id || currentUserId || '', 
  });

  useEffect(() => {
    if (initialData) {
      // 게시글 수정 모드일 때
      setFormData({
        title: initialData.title || '',
        content: initialData.content?.text || '', 
        notice: initialData.notice || 'N',
        enum: initialData.enum || 'review',
        user_id: initialData.user_id || '', 
      });
    } else {
      // 새 게시글 작성 모드일 때
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId || '',
        // currentBoardType이 있으면 해당 타입으로 enum을 초기화
        enum: currentBoardType || 'review', 
      }));
    }
  }, [initialData, currentUserId, currentBoardType]); // currentBoardType을 의존성 배열에 추가

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
    };
    onSave(dataToSave);
  };

  // 게시판 타입 텍스트 매핑
  const getBoardTypeText = (enumValue) => {
    switch (enumValue) {
      case 'review': return '사용후기 게시판';
      case 'free': return '자유 게시판';
      default: return '게시판 선택'; // 기본값
    }
  };

  return (
    <div className="p-6 mt-5 border border-[#306f65] rounded-lg bg-white max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold font-aggro text-gray-800 mb-4">{initialData ? '게시글 수정' : '새 게시글 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-[#306f65] text-base font-bold mb-2">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65]"
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-[#306f65] text-base font-bold mb-2">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65]"
            placeholder="내용을 입력하세요"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="enum" className="block text-[#306f65] text-base font-bold mb-2">게시판 타입</label>
          {/* 새 게시글 작성 모드이고, 특정 게시판이 선택된 경우 */}
          {(!initialData && (currentBoardType === 'review' || currentBoardType === 'free')) ? (
            <input
              type="text"
              id="enum"
              name="enum"
              value={getBoardTypeText(formData.enum)} // 텍스트로 변환하여 표시
              readOnly // 읽기 전용
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65] bg-gray-100 cursor-not-allowed"
            />
          ) : (
            // 게시글 수정 모드이거나, '전체보기'에서 새 게시글 작성 시 (select 허용)
            <select
              id="enum"
              name="enum"
              value={formData.enum}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
              required
            >
              <option value="review">사용후기 게시판</option>
              <option value="free">자유 게시판</option>
            </select>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="notice"
            name="notice"
            checked={formData.notice === 'Y'}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-[#58bcb5] focus:ring-[#306f65] border-gray-300 rounded"
          />
          <label htmlFor="notice" className="text-gray-700 text-sm font-bold">공지사항으로 설정</label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
          >
            {initialData ? '수정하기' : '작성하기'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardForm;
