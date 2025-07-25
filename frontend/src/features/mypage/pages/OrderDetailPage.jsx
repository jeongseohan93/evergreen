// frontend/src/features/mypage/pages/OrderDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터 (orderId)를 가져오기 위해
import { useSelector } from 'react-redux'; // user_uuid를 가져오기 위해
import { format } from 'date-fns'; // 날짜 포맷팅
import { fetchOrderDetailApi } from '../api/mypage';
import SharedBoardForm from '@/shared/components/board/SharedBoardForm'; // SharedBoardForm 컴포넌트 추가
import useBoardManagement from '@/features/admin/components/board/hooks/useBoardManagement';
import { getAllBoards } from '@/features/admin/api/boardApi';

function OrderDetailPage() {
    const { orderId } = useParams(); // URL에서 orderId 가져오기
    const userUuid = useSelector(state => state.auth.user.user_uuid); // Redux store에서 user_uuid 가져오기
    const { addBoard } = useBoardManagement();

    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 이미 사용후기 작성 여부 체크 (최상단으로 이동)
    const [alreadyWroteReview, setAlreadyWroteReview] = useState(false);

    useEffect(() => {
        const getOrderDetail = async () => {
            if (!orderId || !userUuid) {
                setError('주문 정보를 불러올 수 없습니다. (ID 또는 사용자 정보 누락)');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await fetchOrderDetailApi(orderId, userUuid); // API 호출
                setOrderDetail(data);
            } catch (err) {
                setError('주문 상세 내역을 불러오는데 실패했습니다.');
                console.error('Failed to fetch order detail:', err);
            } finally {
                setLoading(false);
            }
        };

        getOrderDetail();
    }, [orderId, userUuid]); // orderId 또는 userUuid가 변경될 때마다 다시 호출

    // 이미 사용후기 작성 여부 체크
    let productId = null;
    if (orderDetail && orderDetail.OrderItems && orderDetail.OrderItems.length > 0) {
      productId = orderDetail.OrderItems[0].Product?.product_id || null;
    }
    useEffect(() => {
      const checkAlreadyWroteReview = async () => {
        if (!userUuid || !productId) return;
        const result = await getAllBoards('review', '', '');
        if (result.success) {
          const found = result.data.some(
            board => board.user_id === userUuid && board.product_id === productId
          );
          setAlreadyWroteReview(found);
        }
      };
      checkAlreadyWroteReview();
    }, [userUuid, productId]);

    // 사용후기 작성 핸들러
    const handleSaveBoard = async (formData) => {
      const result = await addBoard(formData);
      if (result.success) {
        alert('사용후기가 성공적으로 등록되었습니다!');
        window.location.reload(); // 또는 fetchBoards 등 새로고침/리셋
      } else {
        alert(result.message || '사용후기 등록에 실패했습니다.');
      }
    };

    // 디버깅: productId 값 확인
    console.log('OrderDetailPage - productId:', productId);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">주문 상세 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-
            48">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!orderDetail) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">주문 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    // ⭐ 상태 값을 한글로 매핑하는 함수 (OrderHistorySummary와 동일)
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

    return (
        <div className="p-6 bg-white rounded-lg border border-[#306f65]">
            <h2 className="text-2xl font-bold font-aggro mb-6 text-center">주문 상세 내역</h2>
            
            <div className="mb-6 border-b pb-4">
                <p className="text-xl font-semibold text-gray-700">주문 번호: <span className='text-[#306f65]'>{orderDetail.order_id}</span></p>
                <p className="text-sm text-gray-600 mb-3">주문일: <span className='text-[#58bcb5]'>{format(new Date(orderDetail.created_at), 'yyyy년 MM월 dd일 HH:mm')}</span></p>
                <p className="text-gray-700 font-bold mb-3">총 결제 금액: {orderDetail.total_amount.toLocaleString()}원</p>
                <p className="text-gray-700 font-bold">주문 상태: <span className="text-[#306f65] font-bold">{getStatusInKorean(orderDetail.status)}</span></p>
                {/* 배송지 정보 등 추가 가능 */}
                {/* {orderDetail.delivery_address && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="font-semibold">배송지 정보:</p>
                        <p>{orderDetail.delivery_address.recipient_name} ({orderDetail.delivery_address.phone_number})</p>
                        <p>{orderDetail.delivery_address.address} {orderDetail.delivery_address.detail_address}</p>
                        <p>우편번호: {orderDetail.delivery_address.postal_code}</p>
                    </div>
                )} */}
            </div>

            <h3 className="text-xl font-bold font-aggro text-[#306f65]">주문 상품</h3>
            <div className="space-y-4 mb-8">
                {orderDetail.OrderItems && orderDetail.OrderItems.length > 0 ? (
                    orderDetail.OrderItems.map(item => (
                        <div key={item.order_item_id} className="flex items-center space-x-4 border border-gray-100 p-3 rounded-md">
                            {item.Product && item.Product.small_photo && (
                                <img 
                                    src={item.Product.small_photo} // ⭐ Product 모델의 small_photo 필드 사용
                                    alt={item.Product.name}       // ⭐ Product 모델의 name 필드 사용
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            )}
                            <div>
                                <p className="text-gray-800 font-medium font-aggro">{item.Product ? item.Product.name : '알 수 없는 상품'}</p>
                                <p className="text-gray-700">수량: {item.quantity}개</p>
                                <p className="text-gray-700">단가: {item.price.toLocaleString()}원</p>
                                <p className="text-gray-800 font-semibold">총 가격: {(item.quantity * item.price).toLocaleString()}원</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">주문된 상품이 없습니다.</p>
                )}
            </div>
            <h2 className="text-2xl font-bold font-aggro mb-6 text-center">사용후기 작성</h2>
            {alreadyWroteReview ? (
              <>
                <div className="text-center text-red-500 font-bold mt-8">
                  사용후기는 1번만 작성하실 수 있습니다.
                </div>
                <div className="mt-6 text-right">
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </>
            ) : (
              <SharedBoardForm
                initialData={null}
                onSave={handleSaveBoard}
                onCancel={() => { window.history.back(); }}
                currentUserId={userUuid}
                currentBoardType="review"
                hideNoticeOption={true}
                productId={productId}
              />
            )}
        </div>
    );
}

export default OrderDetailPage;