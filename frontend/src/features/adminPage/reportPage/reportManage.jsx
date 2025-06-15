// localhost:3000/admin/report
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportApi } from "../../../services/admin/adminReportApi";

const ReportManage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await reportApi.getAllReports();
      setReports(data);
    } catch (e) {
      alert("조행기 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    if (window.confirm('정말로 이 조행기를 삭제하시겠습니까?')) {
      try {
        await reportApi.deleteReport(reportId);
        alert('조행기가 성공적으로 삭제되었습니다.');
        // 삭제 후 목록 새로고침
        fetchReports();
      } catch (error) {
        console.error('조행기 삭제 중 오류 발생:', error);
        alert('조행기 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ margin: 0 }}>조행기 관리</h2>
          <button 
            onClick={() => navigate('/admin/report/write')}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            조행기 작성
          </button>
        </div>
        <button 
          onClick={() => navigate('/admin')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          대시보드로 이동
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          textAlign: 'left',
          backgroundColor: '#fff'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>제목</th>
              <th style={{ padding: '12px 16px' }}>작성자</th>
              <th style={{ padding: '12px 16px' }}>작성일</th>
              <th style={{ padding: '12px 16px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>등록된 조행기가 없습니다.</td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.report_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px' }}>{report.report_id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span 
                      onClick={() => navigate(`/admin/report/${report.report_id}`)}
                      style={{ 
                        cursor: 'pointer',
                        color: '#0066cc',
                        textDecoration: 'underline'
                      }}
                    >
                      {report.title}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{report.admin_uuid}</td>
                  <td style={{ padding: '12px 16px' }}>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/admin/report/${report.report_id}/edit`)}
                        style={{ 
                          padding: '6px 12px', 
                          cursor: 'pointer',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        수정
                      </button>
                      <button 
                        style={{ 
                          padding: '6px 12px', 
                          cursor: 'pointer',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        상품 연결
                      </button>
                      <button 
                        style={{ 
                          padding: '6px 12px', 
                          cursor: 'pointer',
                          backgroundColor: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px'
                        }}
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