import React from "react";
import { useNavigate } from "react-router-dom";
import useReport from '../../hooks/useReport';

const ReportManage = () => {
  const navigate = useNavigate();
  const {
    reports,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredReports,
    handleSearch,
    handleKeyPress,
    handleDelete,
    fetchReports, // 여기에 같이 할당!
  } = useReport();
  
  //fetchReports가 자동으로 실행되지 않아서 이 페이지에서 따로 동기적 실행
  //훅 참조는 그대로 유지
  React.useEffect(() => {
    fetchReports();
  }, []);

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
          <div className="flex items-center gap-5">
            <h2 className="m-0 text-black text-4xl font-aggro font-bold">조행기 관리</h2>
            <button 
              onClick={() => navigate('/admin/report/write')}
              className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
            >
              조행기 작성
            </button>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border"
          >
            대시보드로 이동
          </button>
        </div>
        <div className="mb-5 flex gap-2">
          <input
            type="text"
            placeholder="조행기 제목을 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="p-3 w-16 text-center whitespace-nowrap text-base">조행기 번호</th>
                <th className="p-3 w-2/5 min-w-[180px] text-center whitespace-nowrap text-base">제목</th>
                <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성자</th>
                <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성일</th>
                <th className="p-3 w-1/5 min-w-[160px] text-center whitespace-nowrap text-base">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center">로딩 중...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-red-500">{error}</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center">등록된 조행기가 없습니다.</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.report_id} className="border-b border-gray-200 text-center">
                    <td className="p-3 whitespace-nowrap">{report.report_id}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span 
                        onClick={() => navigate(`/admin/report/${report.report_id}`)}
                        className="cursor-pointer text-[#306f65] underline hover:text-[#58bcb5]"
                      >
                        {report.title}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{report.admin_uuid}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/admin/report/${report.report_id}/edit`)}
                          className="px-3 py-1.5 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
                        >
                          수정
                        </button>
                        <button 
                          className="px-3 py-1.5 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border"
                        >
                          상품 연결
                        </button>
                        <button 
                          className="px-3 py-1.5 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
                          onClick={() => handleDelete(report.report_id)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportManage;