import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 택배 관리 관련 API 서비스
export const parcelApi = {
  // 모든 배송 현황 조회
  getAllDeliveries: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/parcel/deliveries`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 배송 상태 업데이트
  updateDeliveryStatus: async (orderId, status, trackingNumber, deliveryCompany) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/parcel/delivery/status`, {
        order_id: orderId,
        status: status,
        tracking_number: trackingNumber,
        delivery_company: deliveryCompany
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 택배 추적
  trackParcel: async (trackingNumber, carrier) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/parcel/track`, {
        params: {
          tracking_number: trackingNumber,
          carrier: carrier
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 배송 완료 처리
  completeDelivery: async (orderId) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/parcel/delivery/complete`, {
        order_id: orderId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 배송 취소 처리
  cancelDelivery: async (orderId, reason) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/parcel/delivery/cancel`, {
        order_id: orderId,
        reason: reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 