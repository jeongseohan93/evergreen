import React from 'react';
import useReport from '../../components/report/hooks/UseReport';
import SharedReportEdit from '@/shared/components/board/report/SharedReportEdit';

const ReportEdit = ({ reportId, onCancel }) => {
  const report = useReport();
  const [original, setOriginal] = React.useState({ title: '', contents: [] });

  React.useEffect(() => {
    if (reportId) {
      report.fetchReportById(reportId).then((data) => {
        if (data) {
          setOriginal({ title: data.title || '', contents: Array.isArray(data.contents) ? data.contents : [] });
        }
      });
    } else {
      report.setError('조행기 ID가 없습니다.');
    }
    // eslint-disable-next-line
  }, [reportId]);

  if (report.loading) {
    return <div className="p-5 text-center">로딩 중...</div>;
  }

  return (
    <SharedReportEdit
      title={report.title}
      setTitle={report.setTitle}
      contents={report.contents}
      setContents={report.setContents}
      inputText={report.inputText}
      setInputText={report.setInputText}
      inputImage={report.inputImage}
      setInputImage={report.setInputImage}
      previewUrl={report.previewUrl}
      setPreviewUrl={report.setPreviewUrl}
      loading={report.loading}
      error={report.error}
      setError={report.setError}
      handleAddText={report.handleAddText}
      handleImageChange={report.handleImageChange}
      handleRemoveContent={report.handleRemoveContent}
      handleUpdate={(id) => report.handleUpdate(id, null, onCancel)}
      original={original}
      reportId={reportId}
      onCancel={onCancel}
    />
  );
};

export default ReportEdit; 