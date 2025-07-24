import React from 'react';
import { format } from 'date-fns'; // 날짜 포맷팅을 위한 라이브러리 (설치 필요: npm install date-fns)
import { useNavigate } from 'react-router-dom'; // ⭐ useNavigate 임포트

function OrderHistorySummary({ order }) {
    const navigate = useNavigate(); // ⭐ useNavigate 훅 사용

    // order 객체에서 필요한 정보 추출 (백엔드에서 가공된 representative_product 포함)
    const { 
        order_id, 
        total_amount, 
        status, // 백엔드에서 넘어오는 status 값 (예: 'shipping', 'paid', 'delivered', 'cancelled', 'pending', 'payment_failed')
        created_at, 
        representative_product // 백엔드에서 매핑하여 보낸 대표 상품 정보
    } = order;

    // 날짜 포맷팅
    const formattedDate = created_at ? format(new Date(created_at), 'yyyy년 MM월 dd일 HH:mm') : '날짜 미정';

    // 상태 값을 한글로 매핑하는 함수 (ENUM 값에 맞춰 수정)
    const getStatusInKorean = (statusCode) => {
        switch (statusCode) {
            case 'paid':
                return '결제 완료';
            case 'shipping':
                return '배송 중';
            case 'delivered':
                return '배송 완료';
            case 'cancelled':
                return '주문 취소';
            case 'pending':
                return '결제 대기 중';
            case 'payment_failed':
                return '결제 실패';
            default:
                return '상태 미정';
        }
    };

    // 상태에 따른 Tailwind CSS 클래스를 반환하는 함수 (새로운 ENUM 값에 맞춰 색상 추가)
    const getStatusClassName = (statusCode) => {
        switch (statusCode) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'shipping':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment_failed':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // ⭐ 상세 보기 버튼 클릭 핸들러
    const handleViewDetail = () => {
        navigate(`/mypage/orders/${order_id}`); // orderId를 포함하여 상세 페이지로 이동
    };

    return (
        <div className="border border-[#58bcb5] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-700">주문 번호: <span className='text-[#306f65]'>{order_id}</span></h3>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClassName(status)}`}>
                    {getStatusInKorean(status)} {/* 한글로 변환된 상태 표시 */}
                </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">주문일: <span className='text-[#58bcb5]'>{formattedDate}</span></p>
            <p className="text-gray-700 font-bold mb-3">총 결제 금액: {total_amount.toLocaleString()}원</p>

            {representative_product ? (
                <div className="flex items-center space-x-4 border-t border-gray-300 pt-3 mt-3">
                    {representative_product.product_thumbnail && (
                        <img 
                            src={representative_product.product_thumbnail} 
                            alt={representative_product.product_name} 
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    )}
                    <div>
                        <p className="text-gray-800 font-medium font-aggro">{representative_product.product_name}</p>
                        {representative_product.total_product_types > 1 && (
                            <p className="text-gray-500 text-sm">
                                외 {representative_product.total_product_types - 1}개 상품
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-sm border-t border-gray-200 pt-3 mt-3">상품 정보 없음</p>
            )}

            {/* 상세 보기 버튼 */}
            <div className="mt-4 text-right">
                <button 
                    onClick={handleViewDetail} // ⭐ 실제 라우팅 로직으로 변경
                    className="px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors"
                >
                    상세 보기
                </button>
            </div>
        </div>
    );
}

export default OrderHistorySummary;