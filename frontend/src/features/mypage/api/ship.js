import { apiService } from "@/shared";

export const shipingform = async (formData) => {
    try{
        const response = await apiService.post('users/shipping', formData);
        return response.data;
    } catch (error) {
        console.error("shipingform 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
}

export const getShippingAddressesApi = async () => {
    try {
        const response = await apiService.post('users/getshipping');
        return response.data;
    } catch (error) {
        console.error("getshiping 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
    
}

export const updateShippingAddressApi = async (addressId, updatedData) => {
    try {
        const response = await apiService.put(`users/updateshipping/${addressId}`, updatedData); 
        return response.data;
    } catch (error) {
        console.error("배송지 수정 API 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
};

export const deleteShippingAddressApi = async (addressId) => {
    try {
        const response = await apiService.delete(`users/updateshipping/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("배송지 삭제 API 호출 실패:", error.response?.data?.message || error.message);
        throw error;
    }
}