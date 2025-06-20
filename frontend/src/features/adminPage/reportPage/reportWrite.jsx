import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApi, uploadImage } from '../../../services/admin/adminReportApi';

const ReportWrite = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState([]); // 글/사진 배열
  const [inputText, setInputText] = useState('');
  const [inputImage, setInputImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 글 추가
  const handleAddText = () => {
    if (inputText.trim()) {
      setContents([...contents, { type: 'text', value: inputText }]);
      setInputText('');
    }
  };

  // 이미지 추가 (서버 업로드)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setContents([...contents, { type: 'image', value: imageUrl }]);
      } catch (err) {
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  // 미리보기용 이미지 선택
  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 글/사진/이미지 삭제
  const handleRemoveContent = (idx) => {
    setContents(contents.filter((_, i) => i !== idx));
  };

  // 조행기 작성(저장)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || contents.length === 0) {
      alert('제목과 글/사진을 하나 이상 추가해주세요.');
      return;
    }
    setLoading(true);
    try {
      await reportApi.createReport({ title, contents });
      alert('조행기가 성공적으로 작성되었습니다.');
      navigate('/admin/report');
    } catch (error) {
      console.error('조행기 작성 중 오류 발생:', error);
      alert('조행기 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="m-0">조행기 작성</h2>
        <button 
          onClick={() => navigate('/admin/report')}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow">
        <div className="mb-5">
          <label className="block mb-2 font-bold">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        {/* 글 입력 및 추가 */}
        <div className="mb-5">
          <label className="block mb-2 font-bold">글 입력</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded resize-y focus:outline-none focus:border-blue-500"
            placeholder="글을 입력하고 '글 추가' 버튼을 누르세요."
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAddText}
            className="mt-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            disabled={loading || !inputText.trim()}
          >
            글 추가
          </button>
        </div>

        {/* 이미지 입력 및 추가 */}
        <div className="mb-5">
          <label className="block mb-2 font-bold">이미지 추가</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* 추가된 글/사진 미리보기 */}
        <div className="mb-5">
          <label className="block mb-2 font-bold">미리보기</label>
          <div className="bg-gray-50 p-3 rounded min-h-[60px]">
            {contents.length === 0 && <div className="text-gray-400">아직 추가된 글/사진이 없습니다.</div>}
            {contents.map((item, idx) =>
              item.type === 'text' ? (
                <div key={idx} className="flex items-center my-2">
                  <p className="flex-1 whitespace-pre-line">{item.value}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveContent(idx)}
                    className="ml-2 px-2 py-1 text-xs bg-red-400 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div key={idx} className="flex items-center my-2">
                  <img src={item.value} alt={`첨부 이미지${idx+1}`} className="max-w-xs rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveContent(idx)}
                    className="ml-2 px-2 py-1 text-xs bg-red-400 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/report')}
            className="px-5 py-2 bg-gray-500 text-white border-none rounded hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-green-500 text-white border-none rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '작성 중...' : '작성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportWrite; 