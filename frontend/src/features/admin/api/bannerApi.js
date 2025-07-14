// frontend/src/features/admin/api/bannerApi.js
// apiService를 사용하여 백엔드와 통신합니다.
import { apiService } from '@/shared';

// --- 1. 배너 추가 API ---
// FormData를 사용하여 이미지 파일과 텍스트 데이터를 함께 전송합니다.
// bannerData: { title: string, link_url: string, order: number, is_active: boolean, bannerImage: File }
export const addBanner = async (bannerData) => {
    try {
        // FormData 객체 생성 (이미지 파일과 다른 데이터를 함께 보낼 때 사용)
        const formData = new FormData();
        for (const key in bannerData) {
            formData.append(key, bannerData[key]);
        }

        // POST 요청: /admin/main/banners
        const response = await apiService.post('/admin/main/banners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수
            },
        });
        // 백엔드 응답 구조에 따라 success, message, data를 반환
        return { success: response.status === 201 && response.data.success, message: response.data.message, data: response.data.data };
    } catch (error) {
        console.error('API Error: addBanner', error);
        // 에러 발생 시 throw 대신 객체 반환으로 통일
        return { success: false, message: error.response?.data?.message || '배너 추가 실패' };
    }
};

// --- 2. 모든 배너 조회 API (관리자 대시보드용) ---
// 모든 배너 정보를 가져옵니다.
export const getAllBanners = async () => {
    try {
        // GET 요청: /admin/main/banners/all
        const response = await apiService.get('/admin/main/banners/all'); 
        // 응답 구조가 response.data.data 인지 확인 필요.
        return { success: true, data: response.data.data || [] };
    } catch (error) {
        console.error('API Error: getAllBanners', error);
        return { success: false, message: error.response?.data?.message || '모든 배너 불러오기 실패' };
    }
};

// --- 3. 활성화된 배너 조회 API (쇼핑몰 메인 페이지용) ---
// is_active가 true인 배너 정보만 가져옵니다.
export const getActiveBanners = async () => {
    try {
        // GET 요청: /admin/main/banners
        const response = await apiService.get('/admin/main/banners');
        // 응답 구조가 response.data.data 인지 확인 필요.
        return { success: true, data: response.data.data || [] };
    } catch (error) {
        console.error('API Error: getActiveBanners', error);
        return { success: false, message: error.response?.data?.message || '활성화된 배너 불러오기 실패' };
    }
};

// --- 4. 배너 수정 API ---
// 특정 배너의 정보를 수정합니다. 이미지 변경이 있을 경우 FormData 사용.
// bannerId: 수정할 배너의 ID
// bannerData: { title?: string, link_url?: string, order?: number, is_active?: boolean, bannerImage?: File }
export const updateBanner = async (bannerId, bannerData) => {
    try {
        const formData = new FormData();
        for (const key in bannerData) {
            formData.append(key, bannerData[key]);
        }

        // PUT 요청: /admin/main/banners/:bannerId
        const response = await apiService.put(`/admin/main/banners/${bannerId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수
            },
        });
        // 백엔드 응답 구조에 따라 success, message, data를 반환
        return { success: response.status === 200 && response.data.success, message: response.data.message, data: response.data.data };
    } catch (error) {
        console.error(`API Error: updateBanner (ID: ${bannerId})`, error);
        return { success: false, message: error.response?.data?.message || '배너 수정 실패' };
    }
};

// --- 5. 배너 삭제 API ---
// 특정 배너를 삭제합니다.
// bannerId: 삭제할 배너의 ID
export const deleteBanner = async (bannerId) => {
    try {
        // DELETE 요청: /admin/main/banners/:bannerId
        const response = await apiService.delete(`/admin/main/banners/${bannerId}`);
        // 백엔드 응답 구조에 따라 success, message를 반환
        return { success: response.status === 200 && response.data.success, message: response.data.message };
    } catch (error) {
        console.error(`API Error: deleteBanner (ID: ${bannerId})`, error);
        return { success: false, message: error.response?.data?.message || '배너 삭제 실패' };
    }
};

// --- 6. 배너 순서 및 활성화 상태 업데이트 API (부분 업데이트) ---
// 특정 배너의 순서나 활성화 상태만 변경할 때 사용합니다.
// bannerId: 업데이트할 배너의 ID
// updateData: { order?: number, is_active?: boolean }
export const updateBannerStatusAndOrder = async (bannerId, updateData) => {
    try {
        // PATCH 요청: /admin/main/banners/:bannerId/status-order
        const response = await apiService.patch(`/admin/main/banners/${bannerId}/status-order`, updateData);
        // 백엔드 응답 구조에 따라 success, message, data를 반환
        return { success: response.status === 200 && response.data.success, message: response.data.message, data: response.data.data };
    } catch (error) {
        console.error(`API Error: updateBannerStatusAndOrder (ID: ${bannerId})`, error);
        return { success: false, message: error.response?.data?.message || '배너 상태/순서 업데이트 실패' };
    }
};
