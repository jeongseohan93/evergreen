import { apiService } from '@/shared';

export const getAllDeliveries = async () => {
  try {
    const response = await apiService.get('/admin/parcel/deliveries');
    // 백엔드 응답 구조에 따라 data.data 또는 data 자체를 반환하도록 조정
    // 원본 코드에서 response.success를 체크했으니, 여기서는 data와 message를 포함한 객체를 반환하도록 해줄게.
    return { success: true, data: response.data.data || [], message: '배송 현황 조회 성공' };
  } catch (error) {
    console.error('API Error: getAllDeliveries', error);
    // 에러 발생 시 success: false와 에러 메시지를 반환
    return { success: false, message: error.response?.data?.message || '배송 현황 조회 중 오류가 발생했습니다.' };
  }
};

export const updateDeliveryStatus = async (orderId, status, trackingNumber, deliveryCompany) => {
  try {
    const response = await apiService.put('/admin/parcel/status', { 
      order_id: orderId, 
      status, 
      tracking_number: trackingNumber, 
      delivery_company: deliveryCompany 
    });
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: updateDeliveryStatus', error);
    return { success: false, message: error.response?.data?.message || '배송 상태 업데이트 중 오류가 발생했습니다.' };
  }
};

export const completeDelivery = async (orderId) => {
  try {
    const response = await apiService.put('/admin/parcel/complete', { order_id: orderId });
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: completeDelivery', error);
    return { success: false, message: error.response?.data?.message || '배송 완료 처리 중 오류가 발생했습니다.' };
  }
};

export const cancelDelivery = async (orderId, reason) => {
  try {
    const response = await apiService.put('/admin/parcel/cancel', { order_id: orderId, cancel_reason: reason });
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: cancelDelivery', error);
    return { success: false, message: error.response?.data?.message || '배송 취소 처리 중 오류가 발생했습니다.' };
  }
};

export const updateDeliveryInfo = async (deliveryId, data) => {
  try {
    const response = await apiService.put(`/admin/parcel/deliveries/${deliveryId}`, data);
    return { success: response.status === 200, message: response.data.message };
  } catch (error) {
    console.error('API Error: updateDeliveryInfo', error);
    return { success: false, message: error.response?.data?.message || '배송 정보 수정 중 오류가 발생했습니다.' };
  }
};
