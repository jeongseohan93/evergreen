import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportApi } from '../../../services/admin/adminReportApi';

const ReportEdit = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState([]); // 글/사진 배열
  const [inputText, setInputText] = useState('');
  const [inputImage, setInputImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportApi.getReportById(reportId);
        setTitle(data.title || '');
        setContents(Array.isArray(data.contents) ? data.contents : []);
        setLoading(false);
      } catch (err) {
        setError('조행기 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
    if (reportId) {
      fetchReport();
    } else {
      setError('조행기 ID가 없습니다.');
      setLoading(false);
    }
  }, [reportId]);

  // 글 추가
  const handleAddText = () => {
    if (inputText.trim()) {
      setContents([...contents, { type: 'text', value: inputText }]);
      setInputText('');
    }
  };

  // 이미지 추가
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setContents([...contents, { type: 'image', value: url }]);
      setInputImage(null);
      setPreviewUrl(null);
    }
  };

  // 글/사진/이미지 삭제
  const handleRemoveContent = (idx) => {
    setContents(contents.filter((_, i) => i !== idx));
  };

  // 조행기 수정(저장)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!title.trim() || contents.length === 0) {
      setError('제목과 글/사진을 하나 이상 추가해주세요.');
      setLoading(false);
      return;
    }
    try {
      await reportApi.updateReport(reportId, { title, contents });
      navigate('/admin/report');
    } catch (err) {
      setError('조행기 수정에 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">로딩 중...</div>;
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">조행기 수정</h1>
        <button
          onClick={() => navigate('/admin/report')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* 글 입력 및 추가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">글 입력</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이미지 추가</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* 추가된 글/사진 미리보기 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">미리보기</label>
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
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportEdit; 