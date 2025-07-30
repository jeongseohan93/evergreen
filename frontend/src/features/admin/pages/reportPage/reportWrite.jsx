import React from 'react';
import useReport from '../../components/report/hooks/UseReport';
import ShaerdReportWrite from '@/shared/components/board/report/ShaerdReportWrite';

const ReportWrite = ({ onCancel }) => {
  const report = useReport();
  const handleCreate = () => report.handleCreate(null, onCancel);
  return (
    <ShaerdReportWrite
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
      handleAddText={report.handleAddText}
      handleImageChange={report.handleImageChange}
      handlePreviewImage={report.handlePreviewImage}
      handleRemoveContent={report.handleRemoveContent}
      handleCreate={handleCreate}
      onCancel={onCancel}
    />
  );
};

export default ReportWrite; 