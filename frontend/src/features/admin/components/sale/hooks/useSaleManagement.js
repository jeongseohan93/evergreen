// src/features/admin/components/sale/hooks/useSaleManagement.js

import { useState, useEffect, useCallback } from 'react';
import { addSale, getDailySales, getMonthlySales, getYearlySales, getSaleByDate } from '../../../api/saleApi';

const useSaleManagement = () => {
    // 상태 변수들
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [salesData, setSalesData] = useState({
        daily: [],
        monthly: [],
        yearly: []
    });

    // 매출 입력 폼 관련 상태
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [newSale, setNewSale] = useState({
        sale_date: '',
        offline_amount: 0,
        memo: ''
    });

    // 매출 조회 기간 선택 관련 상태
    const [selectedSalePeriod, setSelectedSalePeriod] = useState('daily'); // 'daily', 'monthly', 'yearly'
    const [selectedSaleYear, setSelectedSaleYear] = useState(new Date().getFullYear()); 
    const [selectedSaleMonth, setSelectedSaleMonth] = useState(new Date().getMonth() + 1);

    // 메모 모달 관련 상태
    const [showMemoModal, setShowMemoModal] = useState(false);
    const [selectedMemoData, setSelectedMemoData] = useState(null);

    // 매출 데이터 조회 함수 (useCallback으로 감싸서 최적화)
    const fetchSalesData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const dailyData = await getDailySales(selectedSaleYear, selectedSaleMonth);
            console.log("[useSaleManagement] Fetched Daily Sales Data:", dailyData);
            setSalesData(prev => ({ ...prev, daily: dailyData }));

            const monthlyData = await getMonthlySales(selectedSaleYear);
            console.log("[useSaleManagement] Fetched Monthly Sales Data:", monthlyData);
            setSalesData(prev => ({ ...prev, monthly: monthlyData }));

            const yearlyData = await getYearlySales();
            console.log("[useSaleManagement] Fetched Yearly Sales Data:", yearlyData);
            setSalesData(prev => ({ ...prev, yearly: yearlyData }));

        } catch (err) {
            console.error('매출 데이터 조회 오류:', err);
            setError(err.message || err.response?.data?.message || '매출 데이터를 불러오는 도중 오류가 발생했습니다.');
            setSalesData({ daily: [], monthly: []
, yearly: [] });
        } finally {
            setLoading(false);
        }
    }, [selectedSaleYear, selectedSaleMonth]);

    // fetchSalesData 실행을 위한 useEffect
    useEffect(() => {
        fetchSalesData();
    }, [fetchSalesData]);

    // 매출 입력 폼 토글
    const toggleSaleForm = () => {
        setShowSaleForm(prev => !prev);
        if (!showSaleForm) {
            const now = new Date();
            setNewSale({
                sale_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
                offline_amount: 0,
                memo: ''
            });
        }
        setError('');
    };

    // 새 매출 입력 필드 변경 핸들러
    const handleSaleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 매출 추가 핸들러 (SaleAddForm에서 전달받은 saleData 사용)
    const handleAddSale = async (e, saleData) => {
        e.preventDefault();

        const amountToProcess = String(saleData.offline_amount).replace(/[^0-9.]/g, "");
        const numericAmount = Number(amountToProcess);

        if (!saleData.sale_date || isNaN(numericAmount) || numericAmount < 0) {
            setError('날짜와 0 이상의 유효한 오프라인 매출 금액은 필수 입력 항목입니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await addSale({ ...saleData, offline_amount: numericAmount });
            if (response.success) {
                setShowSaleForm(false);
                setNewSale({ sale_date: '', offline_amount: 0, memo: '' });
                fetchSalesData();
            } else {
                setError(response.message || '매출 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error('매출 추가 오류:', err);
            setError(err.message || err.response?.data?.message || '매출 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 연도 변경 핸들러 (이전/다음 버튼)
    const handleYearChange = (direction) => {
        setSelectedSaleYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
    };

    // 월 선택 핸들러
    const handleMonthSelect = (month) => {
        setSelectedSaleMonth(month);
    };

    // 오늘 날짜 선택 (매출 입력 폼의 '오늘' 버튼)
    const selectSaleDateToday = () => {
        const now = new Date();
        setNewSale(prev => ({
            ...prev,
            sale_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        }));
    };

    // 오늘 날짜로 조회 기간 설정 (일간 매출 탭의 '오늘' 버튼)
    const selectToday = () => {
        const now = new Date();
        setSelectedSaleYear(now.getFullYear());
        setSelectedSaleMonth(now.getMonth() + 1);
        setSelectedSalePeriod('daily');
    };

    // 이번 년도로 조회 기간 설정 (월간 매출 탭의 '이번 년도' 버튼)
    const selectThisYear = () => {
        setSelectedSaleYear(new Date().getFullYear());
        setSelectedSalePeriod('monthly'); // 월간 매출 탭 선택
    };

    // 통화 형식 포맷팅 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount || 0);
    };

    // 메모 모달 열기
    const openMemoModal = useCallback(async (sale) => {
        setLoading(true);
        setError('');
        try {
            if (sale.date) { // 일간 매출 항목일 경우 (YYYY-MM-DD)
                const memoData = await getSaleByDate(sale.date);
                console.log("[useSaleManagement] Fetched Memo Data (Daily):", memoData);
                setSelectedMemoData({ ...memoData, periodType: 'daily' }); // periodType 추가
                if (!memoData) {
                    setError('해당 날짜의 상세 매출 데이터를 불러올 수 없습니다.');
                    setSelectedMemoData({ date: sale.date, offline_amount: 0, offline_sales: [], memos: [], memo: '메모를 불러올 수 없습니다.', periodType: 'daily' });
                }
            } else if (sale.month) { // 월간 매출 항목일 경우
                setSelectedMemoData({
                    date: `${sale.year}-${String(sale.month).padStart(2, '0')}`,
                    online_amount: sale.online_amount || 0,
                    offline_amount: sale.offline_amount || 0,
                    cancel_amount: sale.cancel_amount || 0,
                    total_amount: sale.total_amount || 0,
                    order_count: sale.order_count || 0,
                    offline_sales: [],
                    memos: sale.memos || [],
                    periodType: 'monthly' // periodType 추가
                });
                console.log("[useSaleManagement] Fetched Memo Data (Monthly):", sale.memos);
            } else if (sale.year && !sale.date && !sale.month) { // 연간 매출 항목일 경우 (년도만 있고 날짜, 월은 없을 때)
                // 연간 매출일 때는 메모를 보여주지 않기로 했으므로, 모달을 열지 않고 바로 리턴
                console.log("[useSaleManagement] Memo not available for Yearly Sales. Not opening modal.");
                setLoading(false); // 로딩 상태 해제
                setShowMemoModal(false); // 모달 숨김
                setSelectedMemoData(null); // 데이터 초기화
                return; // 함수 종료
            } else { // 예상치 못한 sale 객체 형식
                console.warn('예상치 못한 sale 객체 형식:', sale);
                setSelectedMemoData(null);
                setShowMemoModal(false);
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error('메모 데이터 조회 중 오류 발생:', err);
            setError(err.message || err.response?.data?.message || '메모 데이터를 불러오는 데 실패했습니다.');
            setSelectedMemoData(null);
        } finally {
            setLoading(false);
        }
        // 모달을 열어야 하는 경우에만 여기로 도달
        setShowMemoModal(true);
    }, []); 

    // 메모 모달 닫기
    const closeMemoModal = () => {
        setShowMemoModal(false);
        setSelectedMemoData(null);
    };

    // 훅에서 제공할 값들
    return {
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
        setSelectedSaleYear,
        setSelectedSaleMonth,
        handleYearChange,
        handleMonthSelect,
        selectSaleDateToday,
        selectToday,
        selectThisYear,
        formatCurrency,
        openMemoModal,
        closeMemoModal,
    };
};

export default useSaleManagement;