// frontend/src/features/admin/pages/boardPage/BoardForm.jsx
import React, { useState, useEffect } from 'react';

function BoardForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content?.text || '',
    // 🚩 name 필드는 백엔드에서 user_id로 조회하여 채우므로 프론트에서 관리하지 않음
     name: initialData?.name || '',
    user_id: initialData?.user_id || '2ead8476-78a0-4599-885b-dbe7a8bf3700', // 임시 테스트용, 실제 구현 시 로그인 유저 ID로 교체 필요
    notice: initialData?.notice || 'N',
    enum: initialData?.enum || 'review', // 🚩 'TYPE1' 대신 'review'로 기본값 변경
    reply: initialData?.reply || '',
    like_count: initialData?.like_count || 0,
    hate_count: initialData?.hate_count || 0,
  });

  // initialData가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    setFormData({
      title: initialData?.title || '',
      content: initialData?.content?.text || '',
      // 🚩 name 필드는 백엔드에서 user_id로 조회하여 채우므로 프론트에서 관리하지 않음
       name: initialData?.name || '',
      user_id: initialData?.user_id || '2ead8476-78a0-4599-885b-dbe7a8bf3700', // 임시 테스트용, 실제 구현 시 로그인 유저 ID로 교체 필요
      notice: initialData?.notice || 'N',
      enum: initialData?.enum || 'review', // 🚩 'TYPE1' 대신 'review'로 초기값 변경
      reply: initialData?.reply || '',
      like_count: initialData?.like_count || 0,
      hate_count: initialData?.hate_count || 0,
    });
  }, [initialData]); // initialData는 BoardManager에서 넘겨주는 prop이므로 의존성 배열에 추가

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

  return (
    <div className="p-5 mt-5 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">
        {initialData ? '게시글 수정' : '새 게시글 작성'}
      </h2>
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
        {/* 🚩 작성자 이름 입력 필드 제거 (기존에 주석 처리되어 있었음) */}
        {/*
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-gray-700 font-medium">작성자 이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
          />
        </div>
        */}
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
        <div className="flex flex-col">
          <label htmlFor="enum" className="mb-1 text-gray-700 font-medium">타입:</label>
          <select
            id="enum"
            name="enum"
            value={formData.enum}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent bg-white appearance-none"
          >
            {/* 🚩 ENUM 값 변경 */}
            <option value="review">사용후기</option>
            <option value="free">자유</option>
            {/* 필요한 다른 ENUM 값 추가 (없으면 이 두 가지로 충분) */}
          </select>
        </div>
        {initialData && ( // 수정 모드일 때만 Reply, Like, Hate 표시
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
            {initialData ? '게시글 수정' : '게시글 작성'}
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