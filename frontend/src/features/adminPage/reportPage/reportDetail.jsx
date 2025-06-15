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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        로딩 중...
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        조행기를 찾을 수 없습니다.
        <button 
          onClick={() => navigate('/admin/report')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>조행기 상세</h2>
        <button 
          onClick={() => navigate('/admin/report')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '700',
          color: '#333'
        }}>
          {report.title}
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          color: '#666',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #eee',
          fontSize: '15px'
        }}>
          <div style={{ fontWeight: '500' }}>작성자: {report.admin_uuid}</div>
          <div>작성일: {new Date(report.created_at).toLocaleString()}</div>
        </div>

        <div style={{ 
          whiteSpace: 'pre-wrap',
          lineHeight: '1.8',
          fontSize: '16px',
          color: '#444'
        }}>
          {report.content}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail; 