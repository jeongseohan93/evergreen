import React from "react";
import useReport from '../../components/report/hooks/UseReport';
import ShaerdReportList from '@/shared/components/board/report/ShaerdReportList';

const ReportManage = (props) => {
  const reportHook = useReport();
  React.useEffect(() => {
    reportHook.fetchReports();
  }, []);
  return (
    <ShaerdReportList
      {...reportHook}
      onView={props.onView}
      onEdit={props.onEdit}
      onWrite={props.onWrite}
    />
  );
};

export default ReportManage;