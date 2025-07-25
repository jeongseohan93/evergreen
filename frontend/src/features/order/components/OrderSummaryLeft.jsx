// src/features/order/components/OrderSummaryLeft.jsx

import React, { useState, useEffect } from 'react';

/**
 * @param {Array} items - 주문할 상품 목록
 * @param {object} addressForm - 배송지 정보 상태 객체
 * @param {function} handleAddressChange - 배송지 정보 변경 핸들러 (전체 객체를 업데이트)
 * @param {string} additionalRequests - 추가 요청 사항 상태
 * @param {function} handleAdditionalRequestsChange - 추가 요청 사항 변경 핸들러
 * @param {function} onQuantityChange - 상품 수량 변경 시 호출될 콜백 함수 (productId, newQuantity)
 * @param {function} onOpenAddressModal - 배송지 변경 모달을 열기 위한 콜백 함수 추가
 */
const OrderSummaryLeft = ({
    items,
    addressForm = {},
    handleAddressChange,
    additionalRequests,
    handleAdditionalRequestsChange,
    onQuantityChange,
    onOpenAddressModal // ⭐⭐ 새 prop 추가 ⭐⭐
}) => {
    // isEditingAddress가 true면 사용자가 직접 주소를 입력하는 모드 (readOnly 해제)
    // false면 (기본 배송지가 로드되었을 경우) readOnly 모드
    const [isEditingAddress, setIsEditingAddress] = useState(true);

    // useEffect를 사용하여 addressForm이 기본 배송지로 채워지면 readOnly 모드로 전환
    useEffect(() => {
        // addressForm의 필수 필드 중 하나라도 채워져 있으면 기본 배송지가 로드된 것으로 간주
        if (addressForm.recipientName && addressForm.phoneNumber && addressForm.address_main) {
            setIsEditingAddress(false); // 기본 배송지가 채워지면 편집 모드 비활성화
        } else {
            setIsEditingAddress(true); // 비어있으면 편집 모드 활성화
        }
    }, [addressForm]);

    const totalItemsAmount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    // 내부적으로 주소 필드 변경을 처리하는 함수
    const handleLocalAddressChange = (e) => {
        const { name, value } = e.target;
        
        const updatedAddressForm = {
            ...addressForm,
            [name]: value
        };

        if (name === 'address_main' || name === 'address_detail' || name === 'zip_code') {
            const mainAddress = updatedAddressForm.address_main || '';
            const detailAddress = updatedAddressForm.address_detail || '';
            updatedAddressForm.fullAddress = `${mainAddress.trim()} ${detailAddress.trim()}`.trim();
        }
        
        handleAddressChange(updatedAddressForm);
    };

    // ⭐⭐ 배송지 변경/새 주소 입력 토글 핸들러 수정 ⭐⭐
    const toggleEditAddressMode = () => {
        if (!isEditingAddress) {
            // "배송지 변경" 버튼을 눌렀을 때: 모달을 엽니다.
            if (onOpenAddressModal) {
                onOpenAddressModal(); // 부모로부터 받은 모달 열기 함수 호출
            }
        } else {
            // "새 주소 입력 완료" 버튼을 눌렀을 때:
            // 이 시점에서는 현재 입력된 값을 그대로 사용하고 편집 모드를 끕니다.
            // (만약 "기존 배송지로 돌아가기" 기능을 구현하려면,
            // OrderPage에서 fetchDefaultShippingAddress를 다시 호출하는 로직이 필요합니다.)
            setIsEditingAddress(false);
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주문 내용</h2>
            
            <div className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    주문 상품 ({Array.isArray(items) ? items.length : 0}개)
                </h3>
                {!Array.isArray(items) || items.length === 0 ? (
                    <p className="text-gray-600">주문할 상품이 없습니다.</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="flex flex-col mb-3 p-2 border border-gray-100 rounded-md">
                            <p className="font-medium text-gray-900 text-lg mb-1">{item.name}</p>
                            <div className="flex justify-between items-end mt-1">
                                <div className="flex flex-col text-sm text-gray-600">
                                    <span>{item.price.toLocaleString()}원</span>
                                    <div className="flex items-center mt-1">
                                        <label htmlFor={`quantity-${item.productId}`} className="sr-only">수량</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.productId}`}
                                            value={item.quantity}
                                            onChange={(e) => onQuantityChange(item.productId, parseInt(e.target.value, 10))}
                                            min="1"
                                            className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="ml-2">개</span>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-800 text-base">{(item.price * item.quantity).toLocaleString()}원</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2 flex justify-between items-center">
                    배송 정보
                    {/* ⭐⭐⭐ 배송지 변경/새 주소 입력 버튼 ⭐⭐⭐ */}
                    {isEditingAddress ? (
                        <button
                            type="button"
                            onClick={toggleEditAddressMode} // 현재는 입력 완료 (수정 후 readOnly)
                            className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                        >
                            새 주소 입력 완료
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={toggleEditAddressMode} // 배송지 변경 모달 열기
                            className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                        >
                            배송지 변경
                        </button>
                    )}
                </h3>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">수령인 이름</label>
                        <input
                            type="text"
                            id="recipientName"
                            name="recipientName"
                            value={addressForm.recipientName || ''}
                            onChange={handleLocalAddressChange}
                            readOnly={!isEditingAddress}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!isEditingAddress ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="이름을 입력하세요"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={addressForm.phoneNumber || ''}
                            onChange={handleLocalAddressChange}
                            readOnly={!isEditingAddress}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!isEditingAddress ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div>
                        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                        <input
                            type="text"
                            id="zip_code"
                            name="zip_code"
                            value={addressForm.zip_code || ''}
                            onChange={handleLocalAddressChange}
                            readOnly={!isEditingAddress}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!isEditingAddress ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="우편번호"
                        />
                    </div>
                    <div>
                        <label htmlFor="address_main" className="block text-sm font-medium text-gray-700 mb-1">기본 주소</label>
                        <input
                            type="text"
                            id="address_main"
                            name="address_main"
                            value={addressForm.address_main || ''}
                            onChange={handleLocalAddressChange}
                            readOnly={!isEditingAddress}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!isEditingAddress ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="예: 서울시 강남구 테헤란로"
                        />
                    </div>
                    <div>
                        <label htmlFor="address_detail" className="block text-sm font-medium text-gray-700 mb-1">상세 주소</label>
                        <input
                            type="text"
                            id="address_detail"
                            name="address_detail"
                            value={addressForm.address_detail || ''}
                            onChange={handleLocalAddressChange}
                            readOnly={!isEditingAddress}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!isEditingAddress ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="예: 123번지, 101호 (동/호수, 건물명 등)"
                        />
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2">추가 요청 사항</h3>
                <textarea
                    id="additionalRequests"
                    name="additionalRequests"
                    value={additionalRequests || ''}
                    onChange={handleAdditionalRequestsChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none"
                    placeholder="배송 관련 요청 사항을 입력해주세요."
                ></textarea>
            </div>
        </div>
    );
};

export default OrderSummaryLeft;