// localhost:3000/admin/report
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportApi } from "../../../services/admin/adminReportApi";

const ReportManage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('조행기 목록 조회 시작');
      const data = await reportApi.getAllReports();
      console.log('받아온 조행기 목록:', data);
      setReports(data);
      setFilteredReports(data);
    } catch (e) {
      console.error('조행기 목록 조회 실패:', e);
      setError('조행기 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('정말로 이 조행기를 삭제하시겠습니까?')) {
      try {
        await reportApi.deleteReport(reportId);
        alert('조행기가 성공적으로 삭제되었습니다.');
        fetchReports();
      } catch (error) {
        console.error('조행기 삭제 중 오류 발생:', error);
        alert('조행기 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-5">
          <h2 className="m-0">조행기 관리</h2>
          <button 
            onClick={() => navigate('/admin/report/write')}
            className="px-4 py-2 cursor-pointer bg-green-500 text-white border-none rounded font-bold hover:bg-green-600 transition-colors"
          >
            조행기 작성
          </button>
        </div>
        <button 
          onClick={() => navigate('/admin')}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
        >
          대시보드로 이동
        </button>
      </div>
      <div className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="조행기 제목을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-3 w-16 text-center whitespace-nowrap">ID</th>
              <th className="p-3 w-2/5 min-w-[180px] text-center whitespace-nowrap">제목</th>
              <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap">작성자</th>
              <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap">작성일</th>
              <th className="p-3 w-1/5 min-w-[160px] text-center whitespace-nowrap">관리</th>
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
                      className="cursor-pointer text-blue-600 underline hover:text-blue-800"
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
                        className="px-3 py-1.5 cursor-pointer bg-green-500 text-white border-none rounded hover:bg-green-600 transition-colors"
                      >
                        수정
                      </button>
                      <button 
                        className="px-3 py-1.5 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
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
  );
};

export default ReportManage;