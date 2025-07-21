// frontend/src/features/order/pages/OrderPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Redux에서 user 정보를 가져오기 위해 필요

// 컴포넌트 임포트
// 프로젝트 구조에 따라 경로는 다를 수 있어. 확인하고 수정해줘.
import OrderHeader from "../components/OrderHeader";
import OrderSummaryLeft from "../components/OrderSummaryLeft";
import PaymentSummarySticky from "../components/PaymentSummarySticky";

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // ProductDetailPage에서 전달받은 상품 정보

  // 배송지 정보 입력 필드 상태
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    fullAddress: '', // 주소와 상세 주소를 통합한 필드
    phoneNumber: '',
  });

  // 추가 요청 사항 상태
  const [additionalRequests, setAdditionalRequests] = useState('');

  // Redux에서 현재 로그인된 사용자 정보 가져오기
  const user = useSelector(state => state.auth.user);
  const userUuid = user?.user_uuid; // 사용자 고유 ID (Toss customerKey로 사용)

  // 컴포넌트 마운트 시 상품 정보 로드
  useEffect(() => {
    const receivedItems = location.state?.items;

    // 상품 정보가 없으면 에러 설정 후 홈으로 리다이렉트
    if (!receivedItems || receivedItems.length === 0) {
      setError('결제할 상품 정보가 없습니다. 이전 페이지에서 상품을 선택해주세요.');
      setLoading(false);
      navigate('/', { replace: true }); // replace: true를 사용하여 뒤로가기 방지
      return;
    }
    setItems(receivedItems); // 상품 정보 상태 업데이트
    setLoading(false); // 로딩 완료
  }, [location.state, navigate]);

  // 주소 입력 필드 변경 핸들러
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  // 추가 요청 사항 변경 핸들러
  const handleAdditionalRequestsChange = (e) => {
    setAdditionalRequests(e.target.value);
  };

  // 상품 수량 변경 핸들러
  const handleItemQuantityChange = (productId, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // '결제하기' 버튼 클릭 시 주문 생성 및 다음 페이지로 이동 처리
  const handleProceedToPayment = async () => {
    // 필수 주소 정보 및 사용자 UUID 유효성 검사
    if (!addressForm.recipientName || !addressForm.fullAddress || !addressForm.phoneNumber) {
      alert('모든 필수 주소 정보를 입력해주세요.'); // 사용자에게 알림
      return;
    }
    if (!userUuid) {
      alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
      // 필요에 따라 로그인 페이지로 리다이렉션: navigate('/login');
      return;
    }

    // ⭐⭐⭐ 전화번호 정규화 로직 (이 부분만 추가됨) ⭐⭐⭐
    // 전화번호에서 숫자만 남기고 모든 특수문자와 공백을 제거합니다.
    const cleanedPhoneNumber = addressForm.phoneNumber.replace(/[^0-9]/g, '');

    // 정규화된 전화번호의 유효성 검사 (선택 사항이지만 추천)
    // 10자 또는 11자가 아닌 경우 (예: 0101234567, 01012345678) 오류 알림
    if (cleanedPhoneNumber.length < 10 || cleanedPhoneNumber.length > 11) {
        alert('유효한 전화번호를 입력해주세요. (예시: 01012345678)');
        return;
    }
    // ⭐⭐⭐ 여기까지 추가됨 ⭐⭐⭐

    // 백엔드로 보낼 상품 정보 콘솔 출력 (디버깅용)
    console.log('OrderPage: Sending items to backend:', items);

    try {
      setLoading(true); // 로딩 상태 시작

      // 백엔드에 보낼 주문 데이터 구성
      const orderData = {
        items: items, // 현재 OrderPage에서 관리하는 상품 목록 (수량 반영됨)
        user_uuid: userUuid, // Redux에서 가져온 사용자 고유 ID
        order_address: addressForm.fullAddress,
        recipient_name: addressForm.recipientName,
        recipient_phone: cleanedPhoneNumber, // ⭐⭐⭐ 정규화된 전화번호 사용 ⭐⭐⭐
        additional_requests: additionalRequests,
      };

      console.log('주문 생성 요청 데이터:', orderData);

      // 백엔드 API 호출: 주문 생성
      const orderCreationResponse = await axios.post('/order', orderData);

      // 백엔드 응답 확인: success 필드가 false면 에러 발생
      if (!orderCreationResponse.data.success) {
        throw new Error(orderCreationResponse.data.message || '주문 생성에 실패했습니다.');
      }

      // 백엔드에서 받은 주문 정보 추출
      const { orderId, amount, orderName } = orderCreationResponse.data;

      console.log('주문이 성공적으로 생성되었습니다:', { orderId, amount, orderName });

      // 주문 생성 성공 시, 필요한 정보를 state에 담아 /order/toss 페이지로 이동
      navigate('/order/toss', {
        state: {
          orderId,               // 백엔드에서 생성된 고유 주문 ID
          amount,                // 백엔드에서 계산된 최종 결제 금액
          orderName,             // 백엔드에서 정의된 주문명
          customerEmail: user?.email || '',       // Redux user 객체에서 사용자 이메일 (선택 사항)
          customerName: addressForm.recipientName, // 수령인 이름
          customerMobilePhone: cleanedPhoneNumber, // ⭐⭐⭐ 여기도 정규화된 전화번호 사용 ⭐⭐⭐
          userUuid: userUuid      // TossPaymentPage의 customerKey로 사용될 사용자 UUID
        }
      });

    } catch (err) {
      console.error("주문 생성 중 오류 발생:", err);
      setError(err.message || '주문 생성 중 알 수 없는 오류가 발생했습니다.');
      // 사용자에게 오류 메시지를 보여주거나, 특정 오류 페이지로 리다이렉트할 수 있어.
      // 예: navigate(`/error?message=${encodeURIComponent(err.message)}`);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 총 결제 예정 금액 계산 (상품 목록과 수량에 따라 동적으로 계산)
  const totalAmountBeforePayment = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  // PaymentSummarySticky 컴포넌트에 전달할 props
  const paymentSummaryProps = {
    totalPaymentAmount: totalAmountBeforePayment,
    // 기타 결제 요약 정보 (네이버페이, 포인트 등)는 현재 임시값
    naverPayUsage: 0,
    maxPointBenefit: 0,
    purchasePoints: { total: 0, basic: 0, naverPay: 0 },
    reviewPoints: 0,
  };

  // 로딩 상태일 때 보여줄 UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-700">주문 정보를 불러오는 중입니다...</p>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // 에러 상태일 때 보여줄 UI
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md text-red-600">
          <h2 className="text-2xl font-bold mb-4">주문 정보 오류</h2>
          <p className="text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-inter">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        {/* 왼쪽 섹션: 주문 내용 및 배송지 정보 */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">주문/배송 정보</h1>

          <OrderSummaryLeft
            items={items}
            addressForm={addressForm}
            handleAddressChange={handleAddressChange}
            additionalRequests={additionalRequests}
            handleAdditionalRequestsChange={handleAdditionalRequestsChange}
            onQuantityChange={handleItemQuantityChange}
          />

          {/* '결제하기' 버튼 */}
          <button
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 font-semibold text-lg mt-6"
            onClick={handleProceedToPayment}
            disabled={loading} // 로딩 중에는 버튼 비활성화
          >
            결제하기
          </button>
        </div>

        {/* 오른쪽 섹션: 결제 요약 (sticky) */}
        <div className="w-full md:w-1/3 md:sticky md:top-4 h-fit">
          <PaymentSummarySticky payment={paymentSummaryProps} />
        </div>
      </div>
    </div>
  );
}

export default OrderPage;