// src/features/order/components/PaymentSummarySticky.jsx
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, HelpCircle } from 'lucide-react'; // 아이콘 라이브러리 (lucide-react 사용 예시)

// 만약 lucide-react가 설치되어 있지 않다면 npm install lucide-react 또는 yarn add lucide-react
// 또는 SVG를 직접 넣거나 다른 아이콘 라이브러리를 사용하세요.

const PaymentSummarySticky = ({ payment }) => {
    // 섹션 확장/축소 상태 관리 (결제상세, 포인트혜택)
    const [isPaymentDetailExpanded, setIsPaymentDetailExpanded] = useState(true);
    const [isPointBenefitExpanded, setIsPointBenefitExpanded] = useState(true);

    if (!payment) {
        return <div className="p-4 bg-white rounded-lg shadow-md">결제 정보 로딩 중...</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
            {/* 결제상세 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPaymentDetailExpanded(!isPaymentDetailExpanded)}>
                    <h2 className="text-xl font-bold text-gray-800">결제상세</h2>
                    <div className="flex items-center text-green-600 font-bold text-lg">
                        {payment.totalPaymentAmount.toLocaleString()}원
                        {isPaymentDetailExpanded ? <ChevronUp className="w-5 h-5 ml-1" /> : <ChevronDown className="w-5 h-5 ml-1" />}
                    </div>
                </div>
                {isPaymentDetailExpanded && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center text-gray-700 text-base mb-2">
                            <span>네이버페이 머니 사용</span>
                            <span>{payment.naverPayUsage.toLocaleString()}원</span>
                        </div>
                        {/* 더 많은 결제 상세 내역이 있다면 여기에 추가 */}
                    </div>
                )}
            </div>

            {/* 포인트 혜택 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPointBenefitExpanded(!isPointBenefitExpanded)}>
                    <h2 className="text-xl font-bold text-gray-800">포인트 혜택</h2>
                    <div className="flex items-center text-green-600 font-bold text-lg">
                        최대 {payment.maxPointBenefit.toLocaleString()}원
                        {isPointBenefitExpanded ? <ChevronUp className="w-5 h-5 ml-1" /> : <ChevronDown className="w-5 h-5 ml-1" />}
                    </div>
                </div>
                {isPointBenefitExpanded && (
                    <div className="mt-4 border-t border-gray-100 pt-4 text-gray-700">
                        {/* 구매적립 */}
                        <div className="flex items-center text-base mb-2">
                            <span>구매적립</span>
                            <HelpCircle className="w-4 h-4 ml-1 text-gray-400 cursor-help" title="구매 금액에 따라 적립됩니다." />
                            <span className="ml-auto font-bold">총 {payment.purchasePoints.total.toLocaleString()}원</span>
                        </div>
                        <ul className="list-disc ml-6 text-sm text-gray-600 mb-2">
                            <li>기본적립 {payment.purchasePoints.basic.toLocaleString()}원</li>
                            <li>네이버페이 머니 결제적립 {payment.purchasePoints.naverPay.toLocaleString()}원</li>
                        </ul>

                        {/* 리뷰적립 */}
                        <div className="flex items-center text-base mt-4 mb-2">
                            <span>리뷰적립</span>
                            <HelpCircle className="w-4 h-4 ml-1 text-gray-400 cursor-help" title="리뷰 작성 시 적립됩니다." />
                            <span className="ml-auto font-bold">최대 {payment.reviewPoints.toLocaleString()}원</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-2 mb-4">
                            · 동일 상품의 상품/한달리뷰 적립은 각 1회로 제한
                        </p>

                        {/* 멤버십 포인트 받기 버튼 */}
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                            <span className="flex items-center text-green-600 font-semibold">
                                {/* N 로고와 멤버십 아이콘 SVG */}
                                {/* 실제 N로고와 멤버십 아이콘은 SVG나 이미지로 대체해야 합니다. */}
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
                                멤버십
                                <span className="ml-1 text-gray-500 text-xs">구매 감사 포인트 받기</span>
                            </span>
                            <span className="text-green-600 font-bold">+2,160원</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSummarySticky;