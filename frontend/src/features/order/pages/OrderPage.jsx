// frontend/src/features/order/pages/OrderPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

// 컴포넌트 임포트
import OrderHeader from "../components/OrderHeader";
import OrderSummaryLeft from "../components/OrderSummaryLeft";
import PaymentSummarySticky from "../components/PaymentSummarySticky";
import ShippingAddressListModal from "../components/ShippingAddressListModal"; // ⭐⭐ 모달 컴포넌트 임포트 ⭐⭐

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phoneNumber: '',
    zip_code: '',
    address_main: '',
    address_detail: '',
    fullAddress: '',
  });

  const [additionalRequests, setAdditionalRequests] = useState('');
  const user = useSelector(state => state.auth.user);
  const userUuid = user?.user_uuid;

  // ⭐⭐ 배송지 목록 모달 상태 ⭐⭐
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 상품 정보 로드 useEffect
  useEffect(() => {
    const receivedItems = location.state?.items;

    if (!receivedItems || receivedItems.length === 0) {
      setError('결제할 상품 정보가 없습니다. 이전 페이지에서 상품을 선택해주세요.');
      setLoading(false);
      navigate('/', { replace: true });
      return;
    }
    setItems(receivedItems);
  }, [location.state, navigate]);

  // ⭐⭐ 기본 배송지 정보 로드 useEffect ⭐⭐
  useEffect(() => {
    if (!userUuid) {
        setLoading(false);
        setError('로그인 정보가 없어서 기본 배송지 정보를 불러올 수 없습니다.');
        return;
    }

    const fetchDefaultShippingAddress = async () => {
        setLoading(true);
        try {
            // 토큰을 헤더에 포함하여 전송 (백엔드 verifyToken 미들웨어 사용 시)
            const response = await axios.get('/order/addresses-default', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에 토큰 저장 가정
                }
            });
            
            if (response.data.success && response.data.data) {
                const defaultAddress = response.data.data;
                setAddressForm({
                    recipientName: defaultAddress.recipient_name || '',
                    phoneNumber: defaultAddress.recipient_phone || '',
                    zip_code: defaultAddress.zip_code || '',
                    address_main: defaultAddress.address_main || '',
                    address_detail: defaultAddress.address_detail || '',
                    fullAddress: `${defaultAddress.address_main || ''} ${defaultAddress.address_detail || ''}`.trim(),
                });
                console.log('기본 배송지 로드 성공:', defaultAddress);
            } else {
                console.log('기본 배송지가 설정되어 있지 않거나 정보를 불러올 수 없습니다.');
            }
        } catch (err) {
            console.error('기본 배송지 로드 중 오류 발생:', err);
            // setError(`기본 배송지 정보를 불러오는데 실패했습니다: ${err.message || '서버 오류'}`);
        } finally {
            setLoading(false);
        }
    };

    if (userUuid) {
        fetchDefaultShippingAddress();
    }

  }, [userUuid]);

  // OrderSummaryLeft에서 'e' 대신 'updatedForm' 객체 전체를 받습니다.
  const handleAddressChange = useCallback((updatedForm) => {
    setAddressForm(updatedForm);
  }, []);

  const handleAdditionalRequestsChange = (e) => {
    setAdditionalRequests(e.target.value);
  };

  const handleItemQuantityChange = (productId, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // ⭐⭐ 모달 열기 핸들러 ⭐⭐
  const handleOpenAddressModal = useCallback(() => {
    setIsAddressModalOpen(true);
  }, []);

  // ⭐⭐ 모달 닫기 핸들러 ⭐⭐
  const handleCloseAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  // ⭐⭐ 모달에서 주소 선택 시 호출될 핸들러 ⭐⭐
  const handleSelectAddressFromModal = useCallback((selectedAddress) => {
    setAddressForm({
        recipientName: selectedAddress.recipient_name || '',
        phoneNumber: selectedAddress.recipient_phone || '',
        zip_code: selectedAddress.zip_code || '',
        address_main: selectedAddress.address_main || '',
        address_detail: selectedAddress.address_detail || '',
        fullAddress: `${selectedAddress.address_main || ''} ${selectedAddress.address_detail || ''}`.trim(),
    });
    // 모달은 onSelectAddress 내부에서 닫히지만, 명시적으로 호출할 수도 있습니다.
    // setIsAddressModalOpen(false); 
  }, []);


  const handleProceedToPayment = async () => {
    if (!addressForm.recipientName || !addressForm.phoneNumber || !addressForm.zip_code || !addressForm.address_main || !addressForm.address_detail) {
      alert('모든 필수 주소 정보를 입력해주세요. (수령인 이름, 연락처, 우편번호, 기본 주소, 상세 주소)');
      return;
    }
    if (addressForm.fullAddress.trim().length < 5) {
        alert('유효한 주소를 입력해주세요.');
        return;
    }

    if (!userUuid) {
      alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
      return;
    }

    const cleanedPhoneNumber = addressForm.phoneNumber.replace(/[^0-9]/g, '');

    if (cleanedPhoneNumber.length < 10 || cleanedPhoneNumber.length > 11) {
        alert('유효한 전화번호를 입력해주세요. (예시: 01012345678)');
        return;
    }

    console.log('OrderPage: Sending items to backend:', items);

    try {
      setLoading(true);

      const orderData = {
        items: items,
        user_uuid: userUuid,
        order_address: addressForm.fullAddress,
        recipient_name: addressForm.recipientName,
        recipient_phone: cleanedPhoneNumber,
        additional_requests: additionalRequests,
        zip_code: addressForm.zip_code,
        address_main: addressForm.address_main,
        address_detail: addressForm.address_detail,
      };

      console.log('주문 생성 요청 데이터:', orderData);

      const orderCreationResponse = await axios.post('/order', orderData, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // 주문 생성에도 토큰 필요
          }
      });

      if (!orderCreationResponse.data.success) {
        throw new Error(orderCreationResponse.data.message || '주문 생성에 실패했습니다.');
      }

      const { orderId, amount, orderName } = orderCreationResponse.data;

      console.log('주문이 성공적으로 생성되었습니다:', { orderId, amount, orderName });

      navigate('/order/toss', {
        state: {
          orderId,
          amount,
          orderName,
          customerEmail: user?.email || '',
          customerName: addressForm.recipientName,
          customerMobilePhone: cleanedPhoneNumber,
          userUuid: userUuid
        }
      });

    } catch (err) {
      console.error("주문 생성 중 오류 발생:", err);
      setError(err.message || '주문 생성 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmountBeforePayment = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  const paymentSummaryProps = {
    totalPaymentAmount: totalAmountBeforePayment,
    naverPayUsage: 0,
    maxPointBenefit: 0,
    purchasePoints: { total: 0, basic: 0, naverPay: 0 },
    reviewPoints: 0,
  };

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
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">주문/배송 정보</h1>

          <OrderSummaryLeft
            items={items}
            addressForm={addressForm}
            handleAddressChange={handleAddressChange}
            additionalRequests={additionalRequests}
            handleAdditionalRequestsChange={handleAdditionalRequestsChange}
            onQuantityChange={handleItemQuantityChange}
            onOpenAddressModal={handleOpenAddressModal} // ⭐⭐ prop 전달 ⭐⭐
          />

          <button
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 font-semibold text-lg mt-6"
            onClick={handleProceedToPayment}
            disabled={loading}
          >
            결제하기
          </button>
        </div>

        <div className="w-full md:w-1/3 md:sticky md:top-4 h-fit">
          <PaymentSummarySticky payment={paymentSummaryProps} />
        </div>
      </div>

      {/* ⭐⭐ 배송지 목록 모달 렌더링 ⭐⭐ */}
      <ShippingAddressListModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onSelectAddress={handleSelectAddressFromModal}
        userUuid={userUuid} // 모달에서 배송지 목록을 가져오기 위해 userUuid 전달
      />
    </div>
  );
}

export default OrderPage;