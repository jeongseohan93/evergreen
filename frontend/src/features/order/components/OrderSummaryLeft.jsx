// src/features/order/components/OrderSummaryLeft.jsx
import React from 'react';

const OrderSummaryLeft = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주문 내용</h2>
            <p className="text-gray-600 mb-2">여기에 주문할 상품들의 목록, 수량, 가격 등 상세 정보가 들어갑니다.</p>
            <p className="text-gray-600 mb-2">스크롤 테스트를 위해 충분히 긴 내용을 추가합니다.</p>
            {/* 스크롤을 유발할 긴 더미 내용 */}
            {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-white p-3 border-b border-gray-100 flex justify-between items-center text-gray-700">
                    <span>상품명 {i + 1}</span>
                    <span>1개</span>
                    <span>{(10000 + i * 100).toLocaleString()}원</span>
                </div>
            ))}
            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2">배송 정보</h3>
                <p>받는 사람: 김에버그린</p>
                <p>연락처: 010-1234-5678</p>
                <p>주소: 서울시 강남구 테헤란로 123</p>
            </div>
            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2">결제 수단</h3>
                <p>네이버페이 머니</p>
            </div>
            <div className="mt-4 p-4 bg-white border rounded-md">
                <h3 className="text-xl font-semibold mb-2">추가 요청 사항</h3>
                <p>안전하게 배송 부탁드립니다.</p>
            </div>
            {[...Array(10)].map((_, i) => (
                <p key={`more-${i}`} className="text-gray-500 mt-2">더미 내용 {i + 1}...</p>
            ))}
        </div>
    );
};

export default OrderSummaryLeft;