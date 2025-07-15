// frontend/src/features/admin/pages/boardPage/BoardForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext'; 

function BoardForm({ initialData, onSave, onCancel }) {
  const isEditing = initialData && initialData.board_id;
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState(() => {
    if (isEditing) {
      return {
        title: initialData.title || '',
        content: initialData.content?.text || '',
        name: initialData.User?.name || '',
        user_id: initialData.user_id || currentUser?.user_id,
        notice: initialData.notice || 'N',
        enum: initialData.enum || 'review',
      };
    } else {
      return {
        title: '',
        content: '',
        name: '',
        user_id: currentUser?.user_id || '2ead8476-78a0-4599-885b-dbe7a8bf3700', // 새 글 작성 시 user_id도 currentUser에서 가져오도록 수정 또는 임시값 유지
        notice: 'N',
        enum: initialData?.enum || 'review',
      };
    }
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content?.text || '',
        name: initialData.User?.name || '',
        user_id: initialData.user_id || currentUser?.user_id,
        notice: initialData.notice || 'N',
        enum: initialData.enum || 'review',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        content: '',
        notice: 'N',
        enum: initialData?.enum || 'review',
      }));
    }
  }, [initialData, isEditing, currentUser]); 

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

  const formTitle = isEditing ? '게시글 수정' : '새 게시글 작성';
  const displayBoardType = formData.enum === 'review' ? '사용후기 게시판' : '자유 게시판';

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto my-12 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        {formTitle}
      </h2>
      <p className="text-md text-gray-600 mb-8 text-center border-b pb-4 border-gray-100">
        <span className="font-semibold text-indigo-700">게시판:</span> {displayBoardType}
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 제목 필드 */}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 text-lg font-medium text-gray-700">제목:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-indigo-500 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400 text-base"
            placeholder="게시글의 제목을 입력해주세요."
          />
        </div>

        {/* 내용 필드 */}
        <div className="flex flex-col">
          <label htmlFor="content" className="mb-2 text-lg font-medium text-gray-700">내용:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8" 
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-indigo-500 transition duration-300 ease-in-out text-gray-800 placeholder-gray-400 text-base resize-y"
            placeholder="게시글 내용을 작성해주세요."
          />
        </div>

        {/* 공지사항 체크박스 */}
        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            id="notice"
            name="notice"
            checked={formData.notice === 'Y'}
            onChange={handleChange}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-2"
          />
          {/* 포커스 링 오프셋 추가 */}
          <label htmlFor="notice" className="text-lg text-gray-800 font-medium select-none">이 게시글을 공지사항으로 설정</label>
        </div>
        
        {/* 버튼 그룹 */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center md:justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            {formTitle === '게시글 수정' ? '수정 완료' : '게시글 작성'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardForm;