// src/features/mypage/pages/AddressBookPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ⭐️ 배송지 목록 조회 API 함수 임포트
// import { getShippingAddressesApi, deleteShippingAddressApi, updateShippingAddressApi } from '@/api/shippingAddressApi'; 
// 실제 경로에 맞게 임포트하세요. 예: import { getShippingAddressesApi, deleteShippingAddressApi, updateShippingAddressApi } from '../../api/shippingAddressApi';
import { getShippingAddressesApi, deleteShippingAddressApi } from '../api/ship'; // 임시로 조회만 임포트

// ⭐️ AddressBookForm 컴포넌트 임포트
import AddressBookForm from '../pages/AddressBookForm'; // AddressBookForm 경로에 맞게 수정

const AddressBookPage = () => {
    const navigate = useNavigate();
    
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // ⭐️ 수정 중인 배송지의 ID를 저장하는 상태
    const [editingAddressId, setEditingAddressId] = useState(null); 
    // ⭐️ 새 배송지 추가 폼을 보여줄지 여부 (새 배송지 추가 버튼 클릭 시)
    const [showAddForm, setShowAddForm] = useState(false);

    // ⭐️ 배송지 목록 불러오기 함수 (재사용을 위해 분리)
    const fetchAddresses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getShippingAddressesApi();
            if (response.success && Array.isArray(response.addresses)) {
                setAddresses(response.addresses);
            } else {
                setError(response.message || '배송지 목록을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error("배송지 목록 조회 오류:", err);
            setError(err.response?.data?.message || '배송지 목록을 불러오는 중 서버 오류가 발생했습니다.');
            if (err.response?.status === 401) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 배송지 목록 불러오기
    useEffect(() => {
        fetchAddresses();
    }, []);

    // ⭐️ 새 배송지 추가 버튼 클릭 핸들러 (폼 토글)
    const handleAddNewAddress = () => {
        setShowAddForm(prev => !prev); // 폼을 토글
        setEditingAddressId(null); // 수정 폼이 열려있다면 닫기
    };

    // '선택' 버튼 클릭 핸들러
    const handleSelectAddress = (addressId) => {
        alert(`배송지 ID ${addressId} 선택`);
    };

    // ⭐️ '수정' 버튼 클릭 핸들러 (인라인 폼 열기)
    const handleEditAddress = (addressId) => {
        // 현재 수정 중인 항목과 동일한 버튼을 다시 누르면 폼 닫기
        if (editingAddressId === addressId) {
            setEditingAddressId(null);
        } else {
            setEditingAddressId(addressId); // 수정 모드로 전환
            setShowAddForm(false); // 새 배송지 폼이 열려있다면 닫기
        }
    };

    // ⭐️ '삭제' 버튼 클릭 핸들러
    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('정말로 이 배송지를 삭제하시겠습니까?')) {
            try {
                const response = await deleteShippingAddressApi(addressId); // 실제 삭제 API 호출


                if (response.success) {
                    alert(response.message || '배송지가 성공적으로 삭제되었습니다.');
                    fetchAddresses(); // 목록 새로고침
                } else {
                    alert('배송지 삭제에 실패했습니다: ' + (response.message || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error("배송지 삭제 오류:", err);
                alert('배송지 삭제 중 오류가 발생했습니다: ' + (err.response?.data?.message || ''));
            }
        }
    };

    // ⭐️ AddressBookForm에서 '저장' 버튼 클릭 시 호출될 콜백
    const handleFormSave = async (formDataFromForm) => {
        console.log("폼에서 저장 요청 받음:", formDataFromForm);
        // 실제 API 호출 로직 (추가 또는 수정)
        try {
            let response;
            if (formDataFromForm.address_id) { // address_id가 있으면 수정
                // response = await updateShippingAddressApi(formDataFromForm.address_id, formDataFromForm);
                response = { success: true, message: '배송지 수정 성공 (더미)' }; // 더미
            } else { // address_id가 없으면 추가
                // response = await addShippingAddressApi(formDataFromForm);
                response = { success: true, message: '새 배송지 추가 성공 (더미)' }; // 더미
            }

            if (response.success) {
                alert(response.message);
                setEditingAddressId(null); // 수정 폼 닫기
                setShowAddForm(false); // 추가 폼 닫기
                fetchAddresses(); // 목록 새로고침
            } else {
                alert(`배송지 저장 실패: ${response.message}`);
            }
        } catch (error) {
            console.error("배송지 저장 API 호출 오류:", error);
            alert(`배송지 저장 중 오류가 발생했습니다: ${error.response?.data?.message || ''}`);
        }
    };

    // ⭐️ AddressBookForm에서 '취소' 버튼 클릭 시 호출될 콜백
    const handleFormCancel = () => {
        setEditingAddressId(null); // 수정 폼 닫기
        setShowAddForm(false); // 추가 폼 닫기
    };


    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center text-lg text-gray-700">
                배송지 목록을 불러오는 중...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center text-lg text-red-500">
                오류: {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white">
            {/* 상단 제목 및 새 배송지 추가 버튼 영역 */}
            <div 
                className="flex items-center justify-between border-b border-gray-300 py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleAddNewAddress} // 새 배송지 추가 폼 토글
            >
                <h2 className="text-xl font-bold text-gray-800">새 배송지 추가</h2>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
           
            {/* ⭐️ 새 배송지 추가 폼 조건부 렌더링 */}
            {showAddForm && (
                <AddressBookForm 
                    initialData={{}} // 새 배송지 추가이므로 빈 객체 전달
                    onSave={handleFormSave} 
                    onCancel={handleFormCancel} 
                />
            )}

            {/* 안내 메시지 박스 */}
            <div className="mb-6 bg-blue-50 p-4 rounded-md text-sm text-blue-800 hidden sm:block">
                <p className="mb-1">• 정확한 배송을 위해 도로명 주소만 사용합니다.</p>
                <p>• 최근 배송지 목록은 30일간 유지됩니다.</p>
            </div>

            {/* 배송지 목록 컨테이너 */}
            <div className="space-y-0.5 border-t border-b border-gray-300">
                {addresses.length === 0 ? (
                    <div className="text-center text-gray-600 py-10">등록된 배송지가 없습니다.</div>
                ) : (
                    addresses.map((address, index) => (
                        <React.Fragment key={address.address_id}> {/* 프래그먼트 사용 */}
                            <div className={`py-4 px-4 relative ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <span className="text-base font-bold text-gray-900 mr-2">{address.address_name}</span>
                                        {address.is_default && (
                                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">기본 배송지</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSelectAddress(address.address_id)}
                                        className="text-green-600 border border-green-600 px-3 py-1 text-sm rounded hover:bg-green-50 transition-colors"
                                    >
                                        선택
                                    </button>
                                </div>
                                
                                <div className="text-gray-700 text-sm mb-1">
                                    ({address.zip_code}) {address.address_main} {address.address_detail}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    {address.recipient_name} {address.recipient_phone}
                                </div>

                                <div className="flex justify-end space-x-2 mt-3 text-sm">
                                    <button
                                        onClick={() => handleEditAddress(address.address_id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        수정
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={() => handleDeleteAddress(address.address_id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            
                            {/* ⭐️ 수정 폼 조건부 렌더링 */}
                            {editingAddressId === address.address_id && (
                                <AddressBookForm 
                                    initialData={address} // 수정할 배송지 데이터 전달
                                    onSave={handleFormSave} 
                                    onCancel={handleFormCancel} 
                                />
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressBookPage;