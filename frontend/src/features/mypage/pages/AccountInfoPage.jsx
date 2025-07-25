// src/pages/AccountInfoPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { getMyInfoApi, updateMyInfoApi } from '../api/userApi';
// ⭐⭐ AddressSearchModal 컴포넌트 임포트 경로 확인 및 추가 ⭐⭐
// 실제 프로젝트 구조에 맞게 경로를 수정해주세요.
// 예: '../../../shared/api/AddressSearchModal' 또는 '@shared/api/AddressSearchModal'
import AddressSearchModal from '../../../shared/api/AddressSearchModal'; 

// ⭐ 백엔드에서 받아온 단일 address 문자열을 폼 데이터로 매핑하는 함수 (필요시 사용) ⭐
// 백엔드가 이미 zipCode, addressMain, addressDetail을 제공한다면 이 함수는 필요 없습니다.
const mapBackendAddressToForm = (userData) => {
    // 백엔드에서 단일 'address' 문자열을 받는다고 가정 (예: "01234 도로명주소 상세주소")
    // 실제 백엔드 응답 형식에 따라 이 파싱 로직은 달라져야 합니다.
    // 여기서는 간단히 'address'를 그대로 쓰고, zipCode, addressMain, addressDetail은 비워둡니다.
    // 이상적으로는 백엔드 API가 애초에 주소를 분리하여 제공해야 합니다.
    // 만약 백엔드가 'zip_code', 'address_main', 'address_detail'을 직접 제공한다면,
    // 아래와 같이 변경해야 합니다.
    return {
        email: userData.email || '',
        name: userData.name || '',
        phone: userData.phone || '',
        zipCode: userData.zip_code || '',        // 백엔드에서 제공하는 필드명에 맞춤
        addressMain: userData.address_main || '',// 백엔드에서 제공하는 필드명에 맞춤
        addressDetail: userData.address_detail || '', // 백엔드에서 제공하는 필드명에 맞춤
    };
};

const AccountInfoPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        zipCode: '',      // ⬅️ 우편번호 필드 추가
        addressMain: '',  // ⬅️ 기본 주소 필드 추가
        addressDetail: '' // ⬅️ 상세 주소 필드 추가
    });
    const [loading, setLoading] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false); // 주소 모달 상태 추가
    const detailAddressRef = useRef(null); // 상세 주소 필드 참조

    // 1. 페이지 로드 시 내 정보 불러오기
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const data = await getMyInfoApi(); 
                
                if (data && data.user) {
                    // ⭐ 백엔드 응답에 따라 폼 데이터 매핑 방식 변경 ⭐
                    // 백엔드가 zip_code, address_main, address_detail을 직접 제공한다면:
                    setFormData({
                        email: data.user.email || '',
                        name: data.user.name || '',
                        phone: data.user.phone || '',
                        zipCode: data.user.zip_code || '',
                        addressMain: data.user.address_main || '',
                        addressDetail: data.user.address_detail || '',
                    });
                    // 백엔드가 단일 'address' 문자열로 제공하고 프론트에서 파싱해야 한다면:
                    // setFormData(mapBackendAddressToForm(data.user)); 
                    
                } else {
                    alert(data.message || '로그인이 필요하거나 사용자 정보를 찾을 수 없습니다.');
                    // window.location.href = '/login'; // 주석 해제하여 로그인 페이지로 리디렉션
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

    // 2. 폼 입력값 변경 시 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ⭐⭐ 주소 검색 모달에서 주소 선택 시 호출될 콜백 함수 ⭐⭐
    const handleAddressSelect = ({ zipCode, addressMain, addressDetail }) => {
        setFormData(prev => ({
            ...prev,
            zipCode,
            addressMain,
            addressDetail: addressDetail || '' // 상세 주소는 없을 수도 있으므로 빈 문자열로 초기화
        }));
        setShowAddressModal(false); // 모달 닫기
        detailAddressRef.current?.focus(); // 상세 주소 필드로 포커스 이동
    };

    // 3. 폼 제출 (정보 수정) 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ⭐ updateMyInfoApi에 전송할 데이터 구조 변경 ⭐
            // 백엔드에서 zip_code, address_main, address_detail을 각각 받는다면:
            const dataToUpdate = {
                name: formData.name,
                phone: formData.phone,
                zip_code: formData.zipCode, // 백엔드 필드명에 맞춤
                address_main: formData.addressMain, // 백엔드 필드명에 맞춤
                address_detail: formData.addressDetail // 백엔드 필드명에 맞춤
            };
            // 만약 백엔드에서 여전히 단일 'address' 문자열을 요구한다면:
            // const dataToUpdate = {
            //     name: formData.name,
            //     phone: formData.phone,
            //     address: `${formData.addressMain} ${formData.addressDetail}`.trim()
            // };

            const data = await updateMyInfoApi(dataToUpdate); // 수정된 데이터 객체 전달
            
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
                
                {/* ⭐⭐ 주소 입력 필드 수정: 우편번호, 주소, 상세 주소 및 검색 버튼 추가 ⭐⭐ */}
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

                {/* 상세 주소 */}
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

            {/* ⭐⭐ 주소 검색 모달 조건부 렌더링 ⭐⭐ */}
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