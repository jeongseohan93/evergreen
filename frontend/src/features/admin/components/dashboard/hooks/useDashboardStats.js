// features/admin/components/dashboard/hooks/useDashboardStats.js

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardSummary } from '../../../api/dashboardApi';

const useDashboardStats = () => {
    // 대시보드에 필요한 상태 변수들 정의
    // newMembers를 포함하지 않도록 초기 상태를 수정합니다.
    const [stats, setStats] = useState({
        totalProducts: 0,
        todayOrders: 0,
        todaySales: 0,
        // newMembers: 0, // 신규 회원 제외
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [todayDate, setTodayDate] = useState('');

    // 대시보드 통계 데이터를 불러오는 함수
    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchDashboardSummary();
            if (response.success) {
                // 백엔드에서 newMembers를 반환하지 않으므로, stats에 해당 필드가 없어도 괜찮습니다.
                // 필요한 필드만 추출하여 설정하거나, 백엔드 응답을 그대로 사용합니다.
                setStats({
                    totalProducts: response.data.totalProducts || 0,
                    todayOrders: response.data.todayOrders || 0,
                    todaySales: response.data.todaySales || 0,
                    // newMembers는 더 이상 사용하지 않으므로 여기에서 제외합니다.
                });
                
                const now = new Date();
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const day = now.getDate().toString().padStart(2, '0');
                setTodayDate(`${year}.${month}.${day}`);
            } else {
                setError(response.message || '대시보드 통계 데이터를 불러오는 데 실패했습니다.');
            }
        } catch (err) {
            console.error('대시보드 통계 불러오기 오류:', err);
            setError(err.message || '네트워크 오류 또는 서버 응답 문제');
            // 에러 시 기본값 설정에서도 newMembers를 제외합니다.
            setStats({ totalProducts: 0, todayOrders: 0, todaySales: 0 }); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        todayDate,
        fetchStats,
    };
};

export default useDashboardStats;
