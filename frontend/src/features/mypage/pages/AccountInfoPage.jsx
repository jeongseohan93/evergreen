// src/pages/AccountInfoPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getMyInfoApi, updateMyInfoApi } from '../api/userApi';
import AddressSearchModal from '../../../shared/api/AddressSearchModal'; 

// 이 함수는 이제 필요하지 않을 가능성이 높습니다. (백엔드가 분리된 필드를 직접 제공하기 때문)
// const mapBackendAddressToForm = (userData) => { /* ... */ };

const AccountInfoPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        zipCode: '',      
        addressMain: '',  
        addressDetail: '' 
    });
    const [loading, setLoading] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const detailAddressRef = useRef(null);

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const data = await getMyInfoApi(); 
                
                if (data && data.user) {
                    // ⭐⭐⭐ 이 부분을 수정해야 합니다! 백엔드에서 오는 필드명에 맞추세요 ⭐⭐⭐
                    setFormData({
                        email: data.user.email || '',
                        name: data.user.name || '',
                        phone: data.user.phone || '',
                        // 백엔드 User 모델과 user.toJSON()의 결과는 카멜케이스입니다.
                        zipCode: data.user.zipCode || '',        
                        addressMain: data.user.addressMain || '',
                        addressDetail: data.user.addressDetail || '',
                    });
                    
                } else {
                    alert(data.message || '로그인이 필요하거나 사용자 정보를 찾을 수 없습니다.');
                    // window.location.href = '/login'; 
                }
            } catch (error) {
                console.error("정보 조회 실패:", error);
                alert(error.response?.data?.message || '회원 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressSelect = ({ zipCode, addressMain, addressDetail }) => {
        setFormData(prev => ({
            ...prev,
            zipCode,
            addressMain,
            addressDetail: addressDetail || ''
        }));
        setShowAddressModal(false);
        detailAddressRef.current?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ⭐ 이 부분은 백엔드가 스네이크 케이스를 받는다면 그대로 둡니다. ⭐
            // User 모델의 underscored: false 설정은 DB 컬럼명을 스네이크 케이스로 만들지만
            // Sequelize가 모델 인스턴스에서는 카멜케이스로 다루므로, 백엔드 컨트롤러에서
            // req.body를 받을 때 스네이크 케이스로 매핑하려면 별도의 설정이나 변환이 필요할 수 있습니다.
            // 현재 백엔드 컨트롤러(`updateMyInfo`)는 카멜케이스로 받고 있으므로 이대로 두세요.
            const dataToUpdate = {
                name: formData.name,
                phone: formData.phone,
                zipCode: formData.zipCode, // 백엔드 필드명에 맞춤 (카멜케이스)
                addressMain: formData.addressMain, // 백엔드 필드명에 맞춤 (카멜케이스)
                addressDetail: formData.addressDetail // 백엔드 필드명에 맞춤 (카멜케이스)
            };
            
            const data = await updateMyInfoApi(dataToUpdate); 
            
            if (data.success) { 
                alert('정보가 성공적으로 수정되었습니다.');
            } else {
                alert(`수정 실패: ${data.message}`);
            }
        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert(error.response?.data?.message || '정보 수정에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-700">정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">계정 정보 관리</h1>
            <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">이메일</label>
                    <input type="email" value={formData.email || ''} readOnly className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">이름</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200" />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">연락처</label>
                    <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200" />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">주소</label>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            readOnly
                            placeholder="우편번호"
                            className="w-1/3 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={() => setShowAddressModal(true)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300 text-sm"
                        >
                            주소 검색
                        </button>
                    </div>
                    <input
                        type="text"
                        id="addressMain"
                        name="addressMain"
                        value={formData.addressMain}
                        readOnly
                        placeholder="기본 주소 (도로명, 지번)"
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="addressDetail" className="block text-gray-700 font-semibold mb-1 sr-only">상세주소</label>
                    <input
                        type="text"
                        id="addressDetail"
                        name="addressDetail"
                        value={formData.addressDetail}
                        onChange={handleInputChange}
                        placeholder="상세 주소 (아파트, 동/호수 등)"
                        ref={detailAddressRef}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 font-semibold">
                    수정하기
                </button>
            </form>

            {showAddressModal && (
                <AddressSearchModal
                    onSelect={handleAddressSelect}
                    onClose={() => setShowAddressModal(false)}
                />
            )}
        </div>
    );
};

export default AccountInfoPage;