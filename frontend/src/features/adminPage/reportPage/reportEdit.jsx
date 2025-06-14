import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportApi } from "../../../services/admin/adminReportApi";

const ReportEdit = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await reportApi.getReportById(reportId);
        setReport(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch (e) {
        alert("조행기 내용을 불러오지 못했습니다.");
        navigate("/admin/report");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [reportId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //조행기 수정 유효성 체크
    if (!editedTitle.trim() || !editedContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await reportApi.updateReport(reportId, {
        title: editedTitle,
        content: editedContent
      });
      
      alert("조행기가 수정되었습니다.");
      navigate("/admin/report");
    } catch (error) {
      console.error("조행기 수정 오류:", error);
      alert(error.response?.data?.message || "조행기 수정 중 오류가 발생했습니다.");
    }
  };

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
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate("/admin/report")}
          style={{ padding: '8px 16px', cursor: 'pointer', marginBottom: '20px' }}
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
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '28px',
                fontWeight: '700',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'none',
                minHeight: '50px'
              }}
            />
          </div>
          
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

          <div style={{ marginBottom: '24px' }}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#444',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                minHeight: '300px'
              }}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportEdit; 