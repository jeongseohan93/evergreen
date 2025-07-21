// src/features/order/components/OrderSummaryLeft.jsx

import React from 'react';

/**
 * @param {Array} items - 주문할 상품 목록
 * @param {object} addressForm - 배송지 정보 상태 객체 (부모로부터 받음)
 * @param {function} handleAddressChange - 배송지 정보 변경 핸들러 (부모로부터 받음)
 * @param {string} additionalRequests - 추가 요청 사항 상태 (부모로부터 받음)
 * @param {function} handleAdditionalRequestsChange - 추가 요청 사항 변경 핸들러 (부모로부터 받음)
 * @param {function} onQuantityChange - 상품 수량 변경 시 호출될 콜백 함수 (productId, newQuantity)
 */
const OrderSummaryLeft = ({
    items,
    addressForm = {},
    handleAddressChange,
    additionalRequests,
    handleAdditionalRequestsChange,
    onQuantityChange
}) => {
    // totalItemsAmount 계산 로직은 유지하되, UI에서는 사용하지 않음
    const totalItemsAmount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주문 내용</h2>
            
            {/* 주문 상품 목록 */}
            <div className="mb-6 border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    주문 상품 ({Array.isArray(items) ? items.length : 0}개)
                </h3>
                {/* items가 배열이 아니거나 비어있을 경우 처리 */}
                {!Array.isArray(items) || items.length === 0 ? (
                    <p className="text-gray-600">주문할 상품이 없습니다.</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="flex flex-col mb-3 p-2 border border-gray-100 rounded-md">
                            <p className="font-medium text-gray-900 text-lg mb-1">{item.name}</p>
                            <div className="flex justify-between items-end mt-1">
                                <div className="flex flex-col text-sm text-gray-600">
                                    <span>{item.price.toLocaleString()}원</span>
                                    {/* 수량 입력 필드 */}
                                    <div className="flex items-center mt-1">
                                        <label htmlFor={`quantity-${item.productId}`} className="sr-only">수량</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.productId}`}
                                            value={item.quantity}
                                            onChange={(e) => onQuantityChange(item.productId, parseInt(e.target.value, 10))}
                                            min="1" // 최소 수량 1
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

            {/* 배송 정보 입력 필드 (이제 입력 가능) */}
            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2">배송 정보</h3>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">수령인 이름</label>
                        <input
                            type="text"
                            id="recipientName"
                            name="recipientName"
                            value={addressForm.recipientName || ''}
                            onChange={handleAddressChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                            onChange={handleAddressChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div>
                        <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                        <input
                            type="text"
                            id="fullAddress"
                            name="fullAddress" // 주소와 상세 주소를 통합
                            value={addressForm.fullAddress || ''}
                            onChange={handleAddressChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="주소와 상세 주소를 함께 입력하세요 (예: 서울시 강남구 테헤란로 123, 101호)"
                        />
                    </div>
                </div>
            </div>
            
            {/* 추가 요청 사항 입력 필드 (이제 입력 가능) */}
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
