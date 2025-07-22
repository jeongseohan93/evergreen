import React from "react";
import useReport from '../../components/report/hooks/UseReport';
import SharedReportDetail from '@/shared/components/board/report/SharedReportDetail';

const ReportDetail = ({ reportId, onCancel }) => {
  const { report, loading, fetchReportById } = useReport();

  React.useEffect(() => {
    fetchReportById(reportId);
    // eslint-disable-next-line
  }, [reportId]);

  return (
    <SharedReportDetail
      report={report}
      loading={loading}
      onCancel={onCancel}
    />
  );
};

export default ReportDetail; 