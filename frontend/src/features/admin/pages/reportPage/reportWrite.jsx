import React from 'react';
import { useNavigate } from 'react-router-dom';
import useReport from '../../components/report/hooks/UseReport';

const ReportWrite = ({ onCancel }) => {
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    contents,
    setContents,
    inputText,
    setInputText,
    inputImage,
    setInputImage,
    previewUrl,
    setPreviewUrl,
    loading,
    handleAddText,
    handleImageChange,
    handlePreviewImage,
    handleRemoveContent,
    handleCreate,
  } = useReport();

  //배경색 임시 설정
  React.useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f2f2e8';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="p-5 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="m-0 text-black text-4xl font-aggro font-bold">조행기 작성</h2>
          <button 
            onClick={onCancel}
            className="px-4 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border"
          >
            목록으로 돌아가기
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); handleCreate(null, onCancel); }} className="bg-white p-5 rounded-lg border border-[#306f65]">
          <div className="mb-5">
            <label className="block mb-2 font-bold text-base text-[#306f65]">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              required
              disabled={loading}
            />
          </div>
          {/* 글 입력 및 추가 */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-base text-[#306f65]">글 입력</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded resize-y focus:outline-none focus:border-[#306f65]"
              placeholder="글을 입력하고 '글 추가' 버튼을 누르세요."
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddText}
              className="mt-2 px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
              disabled={loading || !inputText.trim()}
            >
              글 추가
            </button>
          </div>
          {/* 이미지 입력 및 추가 */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-base text-[#306f65]">이미지 추가</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleImageChange(e, true)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              disabled={loading}
            />
          </div>
          {/* 추가된 글/사진 미리보기 */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-base text-[#306f65]">미리보기</label>
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
                    <img
                      src={item.value.startsWith('/adminImages/')
                        ? `http://localhost:3005${item.value}`
                        : item.value}
                      alt={`첨부 이미지${idx+1}`}
                      className="max-w-xs rounded"
                    />
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
              type="submit"
              className="px-5 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-[#58bcb5]"
              disabled={loading}
            >
              {loading ? '작성 중...' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>  
  );
};

export default ReportWrite; 