import { useState, useEffect, useCallback } from 'react';
import * as orderApi from '../../../api/orderApi'; // orderApi 임포트

const useDeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingDelivery, setEditingDelivery] = useState({});
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [showDelayedOnly, setShowDelayedOnly] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    // --- API 호출 함수들 ---
    const fetchAllDeliveries = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await orderApi.getAllDeliveries();
            if (response.success) {
                // 원본 코드에서 isDelayed 계산 로직이 없었으므로 여기서 추가
                const updatedDeliveries = response.data.map(delivery => {
                    const createdDate = new Date(delivery.created_at);
                    const now = new Date();
                    const diffTime = Math.abs(now - createdDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // 'shipping' 상태이면서 주문일로부터 3일 이상 경과하면 지연으로 간주 (기준은 조절 가능)
                    const isDelayed = delivery.status === 'shipping' && diffDays >= 3;
                    return { 
                        ...delivery, 
                        isDelayed, 
                        delayDays: isDelayed ? diffDays - 2 : 0, // 지연 일수는 3일차부터 1일 지연으로
                        daysSinceOrder: diffDays // 주문일로부터 경과 일수
                    };
                });
                setDeliveries(updatedDeliveries);
            } else {
                setDeliveries([]);
                console.log('배송 데이터 없음:', response.message);
            }
        } catch (err) { // catch 블록에서 error 대신 err로 변경하여 충돌 방지
            console.error('배송 현황 조회 오류:', err);
            setDeliveries([]);
            setError('배송 현황 조회 중 오류가 발생했습니다.'); // 사용자에게 보여줄 에러 메시지
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeliveryStatusUpdate = useCallback(async (orderId, status, trackingNumber, deliveryCompany) => {
        setLoading(true);
        setError('');
        try {
            const response = await orderApi.updateDeliveryStatus(orderId, status, trackingNumber, deliveryCompany);
            if (response.success) {
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: status,
                                tracking_number: trackingNumber,
                                delivery_company: deliveryCompany
                              }
                            : delivery
                    )
                );
                setEditingDelivery(prev => ({ ...prev, [orderId]: false }));
            } else {
                setError(response.message || '배송 상태 업데이트에 실패했습니다.');
            }
        } catch (err) {
            console.error('배송 상태 업데이트 오류:', err);
            setError('배송 상태 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleTrackParcel = useCallback(async (trackingNumber, carrier = 'korea-post') => {
        if (!trackingNumber) {
            setError('운송장 번호를 입력하세요');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await orderApi.trackParcel(trackingNumber, carrier);
            if (response.success) {
                setTrackingInfo(response.data);
                setShowTrackingModal(true);
            } else {
                setError(response.message || '택배 추적에 실패했습니다.');
            }
        } catch (err) {
            console.error('택배 추적 오류:', err);
            setError('택배 추적 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCompleteDelivery = useCallback(async (orderId) => {
        if (!window.confirm('배송을 완료 처리하시겠습니까?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await orderApi.completeDelivery(orderId);
            if (response.success) {
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: 'delivered',
                                delivered_at: new Date().toISOString() // ISOString 형식으로 저장 (백엔드와 통일)
                              }
                            : delivery
                    )
                );
            } else {
                setError(response.message || '배송 완료 처리에 실패했습니다.');
            }
        } catch (err) {
            console.error('배송 완료 처리 오류:', err);
            setError('배송 완료 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCancelDelivery = useCallback(async (orderId) => {
        const reason = window.prompt('취소 사유를 입력하세요:');
        if (!reason) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await orderApi.cancelDelivery(orderId, reason);
            if (response.success) {
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: 'cancelled',
                                cancelled_at: new Date().toISOString(), // ISOString 형식으로 저장
                                cancel_reason: reason
                              }
                            : delivery
                    )
                );
            } else {
                setError(response.message || '배송 취소 처리에 실패했습니다.');
            }
        } catch (err) {
            console.error('배송 취소 처리 오류:', err);
            setError('배송 취소 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 데이터 가공/필터링 함수들 ---
    const getStatusText = useCallback((status) => {
        const statusMap = {
            'pending': '대기',
            'paid': '결제완료',
            'shipping': '배송중',
            'delivered': '배송완료',
            'cancelled': '취소'
        };
        return statusMap[status] || status;
    }, []);

    const getStatusClass = useCallback((status) => {
        const statusClassMap = {
            'pending': 'status-pending',
            'paid': 'status-paid',
            'shipping': 'status-shipping',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusClassMap[status] || 'status-default';
    }, []);

    const getDelayStats = useCallback(() => {
        const delayedOrders = deliveries.filter(delivery => delivery.isDelayed);
        return {
            total: deliveries.length,
            delayed: delayedOrders.length,
            delayedPercentage: deliveries.length > 0 ? Math.round((delayedOrders.length / deliveries.length) * 100) : 0
        };
    }, [deliveries]);

    const getDateFilteredDeliveries = useCallback((deliveriesToFilter) => {
        if (!selectedDate) return deliveriesToFilter;
        
        const selectedDateObj = new Date(selectedDate);
        const startOfDay = new Date(selectedDateObj);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDateObj);
        endOfDay.setHours(23, 59, 59, 999);
        
        return deliveriesToFilter.filter(delivery => {
            const deliveryDate = new Date(delivery.created_at);
            return deliveryDate >= startOfDay && deliveryDate <= endOfDay;
        });
    }, [selectedDate]);

    const getFilteredDeliveries = useCallback(() => {
        let filtered = deliveries;
        
        filtered = getDateFilteredDeliveries(filtered);
        
        if (showDelayedOnly) {
            filtered = filtered.filter(delivery => delivery.isDelayed);
        }
        
        return filtered;
    }, [deliveries, getDateFilteredDeliveries, showDelayedOnly]);

    // --- UI 상호작용 관련 함수들 (상태 업데이트) ---
    const toggleDeliveryEdit = useCallback((orderId) => {
        setEditingDelivery(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    }, []);

    const toggleDelayedFilter = useCallback(() => {
        setShowDelayedOnly(prev => !prev);
    }, []);

    const toggleDateFilter = useCallback(() => {
        setShowDateFilter(prev => {
            if (!prev) { // 필터를 열 때 날짜 초기화
                setSelectedDate('');
            }
            return !prev;
        });
    }, []);

    const handleDateChange = useCallback((e) => {
        setSelectedDate(e.target.value);
    }, []);

    const clearDateFilter = useCallback(() => {
        setSelectedDate('');
        setShowDateFilter(false);
    }, []);

    // 초기 데이터 로드
    useEffect(() => {
        fetchAllDeliveries();
    }, [fetchAllDeliveries]); // fetchAllDeliveries가 useCallback으로 래핑되어 의존성 배열에 추가해도 안전

    return {
        // 상태들
        deliveries,
        loading,
        error,
        editingDelivery,
        trackingInfo,
        showTrackingModal,
        showDelayedOnly,
        showDateFilter,
        selectedDate,

        // 함수들
        fetchAllDeliveries, // 필요시 컴포넌트에서 강제 새로고침 시 사용
        handleDeliveryStatusUpdate,
        handleTrackParcel,
        handleCompleteDelivery,
        handleCancelDelivery,
        toggleDeliveryEdit,
        getStatusText,
        getStatusClass,
        getDelayStats,
        getFilteredDeliveries,
        toggleDelayedFilter,
        toggleDateFilter,
        handleDateChange,
        clearDateFilter,
        setShowTrackingModal // 모달 닫기 위해
    };
};

export default useDeliveryManagement;