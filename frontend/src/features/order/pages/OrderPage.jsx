import React from "react";
import { Footer } from '@/app';
import OrderHeader from "../components/OrderHeader";
import OrderSummaryLeft from "../components/OrderSummaryLeft";
import PaymentSummarySticky from "../components/PaymentSummarySticky";

const OrderPage = () => {
    const paymentData = {
        totalPaymentAmount: 54000, // 결제상세 총액
        naverPayUsage: 54000,       // 네이버페이 머니 사용액
        maxPointBenefit: 1900,      // 포인트 혜택 최대 금액
        purchasePoints: {           // 구매적립 상세
            total: 1350,
            basic: 540,
            naverPay: 810,
        },
        reviewPoints: 550,          // 리뷰적립 최대 금액
        purchaseThanksPoints: 2160, // 구매 감사 포인트 (+2,160원)
    };
    return (
        <>
            <OrderHeader />

            <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:space-x-8 mt-8">
                {/* 🚨 왼쪽 주문 내용 영역 */}
                <div className="w-full lg:w-3/5 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm mb-8 lg:mb-0">
                    <OrderSummaryLeft />
                </div>

                {/* 🚨 오른쪽 결제 상세/포인트 혜택 영역 (Sticky 적용) */}
                <div className="w-full lg:w-2/5 lg:sticky lg:top-20 h-fit"> {/* h-fit으로 내용물만큼 높이 차지, top-20은 헤더 높이 고려 */}
                    <PaymentSummarySticky payment={paymentData} />
                </div>
            </div>


            <Footer />
        </>
    );
};

export default OrderPage;