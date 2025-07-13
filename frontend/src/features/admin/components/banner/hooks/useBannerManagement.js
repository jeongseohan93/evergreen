// frontend/src/features/admin/components/banner/hooks/useBannerManagement.js
import { useState, useEffect, useCallback } from 'react';
import {
    getAllBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    updateBannerStatusAndOrder
} from '../../../api/bannerApi'; // 배너 API 함수들을 임포트

/**
 * 배너 관리 기능을 위한 커스텀 훅
 * 배너 목록 조회, 추가, 수정, 삭제, 활성화/비활성화 등의 로직을 제공합니다.
 */
 const useBannerManagement = () => {
    // 배너 목록 상태
    const [banners, setBanners] = useState([]);
    // 로딩 상태 (데이터를 불러오는 중인지)
    const [loading, setLoading] = useState(true);
    // 에러 상태
    const [error, setError] = useState(null);
    // 현재 수정 중인 배너의 데이터 (폼에 채워질 데이터)
    const [editingBanner, setEditingBanner] = useState(null); // null이면 추가 모드, 객체면 수정 모드

    // 배너 목록을 불러오는 함수
    const fetchBanners = useCallback(async () => {
        setLoading(true);
        setError(null); // 배너 목록을 새로 불러올 때 에러 상태 초기화
        try {
            const result = await getAllBanners();
            if (result.success) {
                setBanners(result.data);
            } else {
                setError(result.message || '배너 목록을 불러오지 못했습니다.');
            }
        } catch (err) {
            console.error('배너 목록 불러오기 오류:', err);
            setError('배너 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 컴포넌트 마운트 시 배너 목록 불러오기
    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]); // fetchBanners가 변경될 때만 실행 (useCallback으로 안정화)

    /**
     * 새 배너를 추가하는 함수
     * @param {Object} bannerData - 배너 데이터 (title, link_url, order, is_active, bannerImage)
     * @returns {Object} { success: boolean, message: string }
     */
    const handleAddBanner = useCallback(async (bannerData) => {
        setLoading(true);
        setError(null); // 새로운 시도 전에 에러 상태 초기화
        try {
            const result = await addBanner(bannerData);
            if (result.success) {
                await fetchBanners(); // 성공 시 목록 새로고침
                return { success: true, message: result.message };
            } else {
                setError(result.message || '배너 추가에 실패했습니다.');
                return { success: false, message: result.message || '배너 추가에 실패했습니다.' };
            }
        } catch (err) {
            console.error('배너 추가 오류:', err);
            setError('배너 추가 중 오류가 발생했습니다.');
            return { success: false, message: '배너 추가 중 서버 오류가 발생했습니다.' };
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    /**
     * 기존 배너를 수정하는 함수
     * @param {number} bannerId - 수정할 배너의 ID
     * @param {Object} updatedData - 업데이트할 배너 데이터
     * @returns {Object} { success: boolean, message: string }
     */
    const handleUpdateBanner = useCallback(async (bannerId, updatedData) => {
        setLoading(true);
        setError(null); // 새로운 시도 전에 에러 상태 초기화
        try {
            const result = await updateBanner(bannerId, updatedData);
            if (result.success) {
                await fetchBanners(); // 성공 시 목록 새로고침
                setEditingBanner(null); // 수정 모드 종료
                return { success: true, message: result.message };
            } else {
                setError(result.message || '배너 수정에 실패했습니다.');
                return { success: false, message: result.message || '배너 수정에 실패했습니다.' };
            }
        } catch (err) {
            console.error(`배너 ID ${bannerId} 수정 오류:`, err);
            setError('배너 수정 중 오류가 발생했습니다.');
            return { success: false, message: '배너 수정 중 서버 오류가 발생했습니다.' };
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    /**
     * 배너를 삭제하는 함수
     * @param {number} bannerId - 삭제할 배너의 ID
     * @returns {Object} { success: boolean, message: string }
     */
    const handleDeleteBanner = useCallback(async (bannerId) => {
        // alert() 대신 커스텀 모달 UI를 사용해야 함.
        // 여기서는 임시로 window.confirm을 사용하지만, 실제 앱에서는 다른 방식으로 대체해야 함.
        if (!window.confirm('정말로 이 배너를 삭제하시겠습니까?')) {
            return { success: false, message: '삭제가 취소되었습니다.' };
        }
        setLoading(true);
        setError(null); // 새로운 시도 전에 에러 상태 초기화
        try {
            const result = await deleteBanner(bannerId);
            if (result.success) {
                await fetchBanners(); // 성공 시 목록 새로고침
                return { success: true, message: result.message };
            } else {
                setError(result.message || '배너 삭제에 실패했습니다.');
                return { success: false, message: result.message || '배너 삭제에 실패했습니다.' };
            }
        } catch (err) {
            console.error(`배너 ID ${bannerId} 삭제 오류:`, err);
            setError('배너 삭제 중 오류가 발생했습니다.');
            return { success: false, message: '배너 삭제 중 서버 오류가 발생했습니다.' };
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    /**
     * 배너의 활성화 상태를 토글하는 함수
     * @param {number} bannerId - 상태를 변경할 배너의 ID
     * @param {boolean} currentStatus - 현재 활성화 상태
     * @returns {Object} { success: boolean, message: string }
     */
    const handleToggleActive = useCallback(async (bannerId, currentStatus) => {
        setLoading(true);
        setError(null); // 새로운 시도 전에 에러 상태 초기화
        try {
            const result = await updateBannerStatusAndOrder(bannerId, { is_active: !currentStatus });
            if (result.success) {
                await fetchBanners(); // 성공 시 목록 새로고침
                return { success: true, message: result.message };
            } else {
                setError(result.message || '활성화 상태 변경에 실패했습니다.');
                return { success: false, message: result.message || '활성화 상태 변경에 실패했습니다.' };
            }
        } catch (err) {
            console.error(`배너 ID ${bannerId} 활성화 상태 변경 오류:`, err);
            setError('활성화 상태 변경 중 오류가 발생했습니다.');
            return { success: false, message: '활성화 상태 변경 중 서버 오류가 발생했습니다.' };
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    /**
     * 배너의 노출 순서를 변경하는 함수
     * @param {number} bannerId - 순서를 변경할 배너의 ID
     * @param {number} newOrder - 새로운 노출 순서 값
     * @returns {Object} { success: boolean, message: string }
     */
    const handleChangeOrder = useCallback(async (bannerId, newOrder) => {
        setLoading(true);
        setError(null); // 새로운 시도 전에 에러 상태 초기화
        try {
            const result = await updateBannerStatusAndOrder(bannerId, { order: newOrder });
            if (result.success) {
                await fetchBanners(); // 성공 시 목록 새로고침
                return { success: true, message: result.message };
            } else {
                setError(result.message || '순서 변경에 실패했습니다.');
                return { success: false, message: result.message || '순서 변경에 실패했습니다.' };
            }
        } catch (err) {
            console.error(`배너 ID ${bannerId} 순서 변경 오류:`, err);
            setError('순서 변경 중 오류가 발생했습니다.');
            return { success: false, message: '순서 변경 중 서버 오류가 발생했습니다.' };
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    /**
     * 수정 모드를 시작하고 해당 배너 데이터를 설정하는 함수
     * @param {Object} banner - 수정할 배너 객체
     */
    const startEditing = useCallback((banner) => {
        // setEditingBanner(banner); // 수정 모드 진입 막기
        // setError(null);
    }, []);

    /**
     * 수정 모드를 종료하는 함수 (및 에러 상태 초기화)
     */
    const cancelEditing = useCallback(() => {
        setEditingBanner(null);
        setError(null); // 취소 시 에러 상태 초기화
    }, []);

    return {
        banners,
        loading,
        error,
        editingBanner,
        fetchBanners,
        handleAddBanner,
        handleUpdateBanner,
        handleDeleteBanner,
        handleToggleActive,
        handleChangeOrder,
        startEditing,
        cancelEditing
    };
};

export default useBannerManagement;
