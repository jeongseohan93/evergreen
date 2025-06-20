//http://localhost:3000/admin/report/report_id
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportApi } from "../../../services/admin/adminReportApi";

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await reportApi.getReportById(reportId);
        setReport(data);
      } catch (e) {
        alert("조행기 내용을 불러오지 못했습니다.");
        navigate("/admin/report");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [reportId, navigate]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        로딩 중...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-5 text-center">
        조행기를 찾을 수 없습니다.
        <button 
          onClick={() => navigate('/admin/report')}
          className="block mx-auto mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="m-0">조행기 상세</h2>
        <button 
          onClick={() => navigate('/admin/report')}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">{report.title}</h3>
        <div className="text-gray-600 mb-4">
          <p>작성자: {report.admin_uuid}</p>
          <p>작성일: {new Date(report.created_at).toLocaleDateString()}</p>
        </div>
        {report.photo && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">이미지</h3>
            <div className="max-w-2xl mx-auto">
              <img
                src={`http://localhost:3005/adminImages/${report.photo.split('/').pop()}`}
                alt="조행기 이미지"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
        <div className="prose max-w-none mt-6">
          {/* 글/사진 배열(contents) 순서대로 렌더링 */}
          {Array.isArray(report.contents) && report.contents.length > 0 ? (
            report.contents.map((item, idx) =>
              item.type === 'text' ? (
                <p key={idx} className="my-4 whitespace-pre-line">{item.value}</p>
              ) : item.type === 'image' ? (
                <div key={idx} className="my-4 flex justify-center">
                  <img
                    src={item.value.startsWith('/adminImages/')
                      ? `http://localhost:3005${item.value}`
                      : item.value}
                    alt={`조행기 이미지${idx+1}`}
                    className="max-w-xl rounded-lg"
                  />
                </div>
              ) : null
            )
          ) : (
            <div className="text-gray-400">내용이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail; 