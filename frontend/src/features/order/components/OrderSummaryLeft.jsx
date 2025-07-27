import React, { useState, useEffect } from 'react';

/**
 * @param {Array} items - 주문할 상품 목록
 * @param {object} addressForm - 배송지 정보 상태 객체
 * @param {function} handleAddressChange - 배송지 정보 변경 핸들러 (전체 객체를 업데이트)
 * @param {string} additionalRequests - 추가 요청 사항 상태
 * @param {function} handleAdditionalRequestsChange - 추가 요청 사항 변경 핸들러
 * @param {function} onQuantityChange - 상품 수량 변경 시 호출될 콜백 함수 (productId, newQuantity)
 * @param {function} onOpenAddressListModal - 기존 배송지 목록 모달을 열기 위한 콜백 함수 (⭐기존 역할 유지⭐)
 * @param {function} onOpenAddressSearchModal - 주소 검색 모달을 열기 위한 콜백 함수 (⭐새로운 역할⭐)
 */
const OrderSummaryLeft = ({
    items,
    addressForm = {},
    handleAddressChange,
    additionalRequests,
    handleAdditionalRequestsChange,
    onQuantityChange,
    onOpenAddressListModal,
    onOpenAddressSearchModal
}) => {
    // isEditingAddress가 true면 사용자가 직접 '상세 주소'를 입력하는 모드
    // false면 (기본 배송지가 로드되었을 경우) readOnly 모드
    const [isEditingAddress, setIsEditingAddress] = useState(true);

    // useEffect를 사용하여 addressForm의 '기본 주소'가 채워지면 상세 주소 필드의 readOnly 모드로 전환
    useEffect(() => {
        // addressForm에 기본 주소가 채워져 있으면 상세 주소 필드를 readOnly로 설정
        // 사용자가 명시적으로 '수정하기' 버튼을 누르기 전까지는 편집 불가
        if (addressForm.address_main) { // 기본 주소가 로드되면 상세 주소는 initially readOnly
            setIsEditingAddress(false);
        } else {
            setIsEditingAddress(true); // 기본 주소가 없으면 상세 주소는 편집 가능 (주소 검색 후 입력하도록)
        }
    }, [addressForm.address_main]); // address_main만 의존성에 추가하여 이 필드의 변화에만 반응

    const totalItemsAmount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    // 내부적으로 주소 필드 변경을 처리하는 함수
    const handleLocalAddressChange = (e) => {
        const { name, value } = e.target;

        const updatedAddressForm = {
            ...addressForm,
            [name]: value
        };

        // 'address_main', 'address_detail' 또는 'zip_code' 변경 시 fullAddress 업데이트
        if (name === 'address_main' || name === 'address_detail' || name === 'zip_code') {
            const mainAddress = updatedAddressForm.address_main || '';
            const detailAddress = updatedAddressForm.address_detail || '';
            updatedAddressForm.fullAddress = `${mainAddress.trim()} ${detailAddress.trim()}`.trim();
        }

        handleAddressChange(updatedAddressForm);
    };

    // '상세 주소'에 대한 편집 모드 토글
    const toggleDetailAddressEditMode = () => { // ⭐⭐ 함수 이름 변경 ⭐⭐
        setIsEditingAddress(prev => !prev);
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
                    <div className="flex space-x-2"> {/* 버튼들을 감싸는 div 추가 */}
                        <button
                            type="button"
                            onClick={onOpenAddressListModal} // 기존 배송지 목록 모달 열기
                            className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                        >
                            배송지 변경
                        </button>
                        {isEditingAddress ? (
                            <button
                                type="button"
                                onClick={toggleDetailAddressEditMode} // '상세 주소' 편집 완료
                                className="px-4 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                            >
                                상세 주소 입력 완료
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={toggleDetailAddressEditMode} // '상세 주소' 편집 시작
                                className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                            >
                                상세 주소 수정
                            </button>
                        )}
                    </div>
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
                            // readOnly 속성 제거: 항상 수정 가능하도록
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
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
                            // readOnly 속성 제거: 항상 수정 가능하도록
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div>
                        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                id="zip_code"
                                name="zip_code"
                                value={addressForm.zip_code || ''}
                                readOnly // 항상 readOnly
                                className="mt-1 block w-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="우편번호"
                            />
                            <button
                                type="button"
                                onClick={onOpenAddressSearchModal} // 주소 검색 모달 열기
                                className="mt-1 px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
                            >
                                주소 검색
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address_main" className="block text-sm font-medium text-gray-700 mb-1">기본 주소</label>
                        <input
                            type="text"
                            id="address_main"
                            name="address_main"
                            value={addressForm.address_main || ''}
                            readOnly // 항상 readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                            readOnly={!isEditingAddress} // isEditingAddress에 따라 readOnly 제어
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