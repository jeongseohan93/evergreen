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
        <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold mb-4">매출 관리</h2>

            {/* 매출 입력 폼 */}
            <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <button
                    onClick={toggleSaleForm}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
                >
                    {showSaleForm ? '매출 입력 취소' : '오프라인 매출 입력'}
                </button>
                {showSaleForm && (
                    <SaleAddForm
                        newSale={newSale}
                        handleSaleInputChange={handleSaleInputChange}
                        handleAddSale={handleAddSale}
                        loading={loading}
                        error={error}
                        toggleSaleForm={toggleSaleForm}
                        selectSaleDateToday={selectSaleDateToday}
                    />
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