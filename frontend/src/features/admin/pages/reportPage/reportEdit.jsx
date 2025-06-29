import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useReport from '../../hooks/useReport';

const ReportEdit = () => {
  const { reportId } = useParams();
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
    error,
    setError,
    handleAddText,
    handleImageChange,
    handleRemoveContent,
    handleUpdate,
    fetchReportById,
  } = useReport();

  const [original, setOriginal] = React.useState({ title: '', contents: [] });

  React.useEffect(() => {
    if (reportId) {
      fetchReportById(reportId).then((data) => {
        if (data) {
          setOriginal({ title: data.title || '', contents: Array.isArray(data.contents) ? data.contents : [] });
        }
      });
    } else {
      setError('조행기 ID가 없습니다.');
    }
    // eslint-disable-next-line
  }, [reportId]);

  //배경색 임시 설정
  React.useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f2f2e8';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  if (loading) {
    return <div className="p-5 text-center">로딩 중...</div>;
  }

  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="p-5 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-4xl font-aggro font-bold">조행기 수정</h1>
          <button
            onClick={() => navigate('/admin/report')}
            className="px-4 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border"
          >
            목록으로 돌아가기
          </button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={e => {
            e.preventDefault();
            // 변경사항 비교
            const isTitleSame = title === original.title;
            const isContentsSame = JSON.stringify(contents) === JSON.stringify(original.contents);
            if (isTitleSame && isContentsSame) {
              alert('수정된 내용이 없습니다.');
              return;
            }
            handleUpdate(reportId, navigate);
          }} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 font-bold text-base text-[#306f65]">
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                required
              />
            </div>
            {/* 글 입력 및 추가 */}
            <div>
              <label className="block mb-2 font-bold text-base text-[#306f65]">글 입력</label>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
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
            <div>
              <label className="block mb-2 font-bold text-base text-[#306f65]">이미지 추가</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(e, false)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                disabled={loading}
              />
            </div>
            {/* 추가된 글/사진 미리보기 */}
            <div>
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65]"
                disabled={loading}
              >
                {loading ? '수정 중...' : '수정하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportEdit; 