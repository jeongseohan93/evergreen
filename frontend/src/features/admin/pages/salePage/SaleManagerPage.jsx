// frontend/src/features/admin/pages/salePage/SaleManagerPage.jsx

import React from 'react'; // React is defined but never used 경고 방지를 위해 React import
import useSaleManagement from '../../components/sale/hooks/useSaleManagement'; // 훅 경로 확인

// 하위 컴포넌트 임포트
import SaleAddForm from './SaleAddForm';
import SaleViewSection from './SaleViewSection';
import SaleMemoModal from './SaleMemoModal';

const SaleManagerPage = () => {
    // 훅의 모든 반환값을 하나의 객체로 받아서 사용합니다.
    // 이렇게 하면 'loading', 'error' 등등의 많은 no-unused-vars 경고가 사라집니다.
    const saleManagement = useSaleManagement(); 

    // saleManagement 객체에서 필요한 것들을 구조 분해 할당하여 사용합니다.
    // setSelectedSaleYear, setSelectedSaleMonth는 직접 사용하지 않고 하위 컴포넌트에 props로 전달하므로,
    // 여기서 구조 분해 할당하지 않고 saleManagement.setSelectedSaleYear 형태로 직접 전달합니다.
    const {
        loading,
        error,
        salesData,
        showSaleForm,
        newSale,
        selectedSalePeriod,
        selectedSaleYear,
        selectedSaleMonth,
        showMemoModal,
        selectedMemoData,
        toggleSaleForm,
        handleSaleInputChange,
        handleAddSale,
        setSelectedSalePeriod,
        handleYearChange,
        handleMonthSelect,
        selectSaleDateToday,
        selectToday,
        selectThisMonth,
        formatCurrency,
        openMemoModal,
        closeMemoModal,
    } = saleManagement;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="text-4xl font-aggro font-bold mb-4 text-black">매출 관리</h1>

            {/* 매출 입력 폼 */}
            <div className="mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
                <button
                    onClick={toggleSaleForm}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        showSaleForm
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            : 'bg-[#306f65] text-white hover:bg-[#58bcb5] hover:shadow-lg'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {showSaleForm ? '매출 입력 폼 닫기' : '오프라인 매출 입력'}
                </button>
                {showSaleForm && (
                    <div className="mt-6">
                        <SaleAddForm
                            newSale={newSale}
                            handleSaleInputChange={handleSaleInputChange}
                            handleAddSale={handleAddSale}
                            loading={loading}
                            error={error}
                            toggleSaleForm={toggleSaleForm}
                            selectSaleDateToday={selectSaleDateToday}
                        />
                    </div>
                )}
            </div>

            {/* 매출 조회 섹션 */}
            <SaleViewSection
                salesData={salesData}
                selectedSalePeriod={selectedSalePeriod}
                setSelectedSalePeriod={setSelectedSalePeriod}
                selectedSaleYear={selectedSaleYear}
                selectedSaleMonth={selectedSaleMonth}
                handleYearChange={handleYearChange}
                handleMonthSelect={handleMonthSelect}
                selectToday={selectToday}
                selectThisMonth={selectThisMonth}
                formatCurrency={formatCurrency}
                openMemoModal={openMemoModal}
                loading={loading}
                error={error}
                // setSelectedSaleYear와 setSelectedSaleMonth는 saleManagement 객체에서 직접 전달
                setSelectedSaleYear={saleManagement.setSelectedSaleYear}
                setSelectedSaleMonth={saleManagement.setSelectedSaleMonth}
            />

            {/* 메모 모달 */}
            {showMemoModal && (
                <SaleMemoModal
                    showMemoModal={showMemoModal}
                    selectedMemoData={selectedMemoData}
                    closeMemoModal={closeMemoModal}
                    formatCurrency={formatCurrency}
                />
            )}
        </div>
    );
};

export default SaleManagerPage;