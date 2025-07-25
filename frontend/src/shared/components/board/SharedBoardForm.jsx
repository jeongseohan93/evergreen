import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SharedBoardForm({ initialData, onSave, onCancel, currentUserId, currentBoardType, hideNoticeOption = false, productId }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    notice: 'N',
    enum: 'review',
    user_id: initialData?.user_id || currentUserId || '',
  });

  useEffect(() => {
    console.log('currentBoardType:', currentBoardType);
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content?.text || '',
        notice: initialData.notice || 'N',
        enum: ['review', 'free', 'qna'].includes(currentBoardType) ? currentBoardType : (['review', 'free', 'qna'].includes(initialData.enum) ? initialData.enum : 'free'),
        user_id: initialData.user_id || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId || '',
        enum: ['review', 'free', 'qna'].includes(currentBoardType) ? currentBoardType : 'free',
      }));
    }
  }, [initialData, currentUserId, currentBoardType]);

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
      content: { text: formData.content },
      ...(productId != null && { product_id: productId })
    };
    // 디버깅: 저장될 데이터 확인
    console.log('SharedBoardForm - dataToSave:', dataToSave);
    onSave(dataToSave);
  };

  const getBoardTypeText = (enumValue) => {
    switch (enumValue) {
      case 'review': return '사용후기 게시판';
      case 'free': return '자유 게시판';
      case 'qna': return '질문 게시판';
      default: return '게시판 선택';
    }
  };

  return (
    <div className="p-6 mt-5 mb-5 border border-[#306f65] rounded-lg bg-white max-w-7xl mx-auto">
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
          {(!initialData && currentBoardType === 'review') ? (
            <input
              type="text"
              id="enum"
              name="enum"
              value={getBoardTypeText(formData.enum)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65] bg-gray-100 cursor-not-allowed"
            />
          ) : (
            <select
              id="enum"
              name="enum"
              value={formData.enum}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
              required
            >
              {!isAdmin && currentBoardType !== 'free' && <option value="review">사용후기 게시판</option>}
              <option value="free">자유 게시판</option>
              <option value="qna">질문 게시판</option>
            </select>
          )}
        </div>
        {!hideNoticeOption && (
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
        )}
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

export default SharedBoardForm;
