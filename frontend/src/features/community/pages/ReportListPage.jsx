import React, { useState } from 'react';
import { Header, SubHeader, Footer } from '@/app';
import useReport from '@/features/admin/components/report/hooks/UseReport';
import ShaerdReportList from '@/shared/components/board/report/ShaerdReportList';
import SharedReportDetail from '@/shared/components/board/report/SharedReportDetail';


const ReportListPage = () => {
  const report = useReport();
  const [selectedId, setSelectedId] = useState(null);

  React.useEffect(() => {
    report.fetchReports();
  }, []);

  const handleView = async (id) => {
    setSelectedId(id);
    await report.fetchReportById(id);
  };

  const handleBackToList = () => {
    setSelectedId(null);
  };

  return (
    <>
      <Header />
      <SubHeader />
      <main className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-full max-w-7xl">
          {!selectedId ? (
            <ShaerdReportList
              reports={report.reports}
              filteredReports={report.filteredReports}
              loading={report.loading}
              error={report.error}
              searchTerm={report.searchTerm}
              setSearchTerm={report.setSearchTerm}
              handleSearch={report.handleSearch}
              handleKeyPress={report.handleKeyPress}
              fetchReports={report.fetchReports}
              onView={handleView}
              hideWriteButton={true}
              hideManageColumn={true}
            />
          ) : (
            <SharedReportDetail
              report={report.report}
              loading={report.loading}
              onCancel={handleBackToList}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ReportListPage; 