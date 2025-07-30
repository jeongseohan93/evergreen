// frontend/src/features/order/pages/Checkout.jsx

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState, useRef } from "react"; // useRef 추가
import { useLocation, useNavigate } from 'react-router-dom';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount: initialAmount, orderName, customerEmail, customerName, customerMobilePhone, userUuid } = location.state || {};

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: initialAmount || 50000,
  });
  const [ready, setReady] = useState(false);

  // useRef를 사용하여 widgets 인스턴스를 저장. 리렌더링 시에도 값이 유지됨.
  const widgetsRef = useRef(null);

  useEffect(() => {
    if (!orderId || !initialAmount || !orderName || !userUuid) {
      console.error('결제에 필요한 정보가 누락되었습니다. 주문 페이지로 돌아갑니다.');
      navigate('/order', { replace: true });
    }
  }, [orderId, initialAmount, orderName, userUuid, navigate]);

  // ⭐⭐ 위젯 초기화 로직 (한 번만 실행되도록) ⭐⭐
  useEffect(() => {
    async function initializeTossPaymentsWidgets() {
      // 이미 초기화되었다면 다시 초기화하지 않음
      if (widgetsRef.current) {
        setReady(true); // 이미 위젯이 있다면 준비 상태로 설정
        return;
      }

      try {
        const tossPayments = await loadTossPayments(clientKey);
        const customerKeyToUse = userUuid || generateRandomString();

        const newWidgets = tossPayments.widgets({
          customerKey: customerKeyToUse,
        });

        widgetsRef.current = newWidgets; // useRef에 위젯 인스턴스 저장
        setReady(true); // 위젯 객체 생성 완료
      } catch (error) {
        console.error("Error initializing TossPayments widget:", error);
      }
    }

    initializeTossPaymentsWidgets();

    // ⭐⭐⭐ Cleanup 함수 (가장 중요한 변경점) ⭐⭐⭐
    return () => {
      // 컴포넌트 언마운트 시 또는 useEffect 재실행 시 기존 위젯 정리
      // widgetsRef.current가 존재하는 경우에만 정리 로직 실행
      if (widgetsRef.current) {
        try {
          // 토스 위젯이 렌더링된 DOM 요소들을 비워줌
          const paymentMethodDiv = document.getElementById('payment-method');
          const agreementDiv = document.getElementById('agreement');
          if (paymentMethodDiv) paymentMethodDiv.innerHTML = '';
          if (agreementDiv) agreementDiv.innerHTML = '';
          // widgetsRef.current = null; // 위젯 인스턴스를 null로 초기화 (선택 사항, 메모리 해제)
        } catch (e) {
          console.error("Error during TossPayments widgets cleanup:", e);
        }
      }
    };
  }, [clientKey, userUuid]); // widgetsRef는 의존성 배열에 넣지 않음!

  // ⭐⭐ 위젯 렌더링 로직 (widgetsRef.current가 준비되면 실행) ⭐⭐
  useEffect(() => {
    async function renderPaymentWidgets() {
      // widgetsRef.current가 아직 초기화되지 않았다면 대기
      if (!widgetsRef.current) {
        return;
      }

      // OrderPage에서 받은 실제 금액으로 위젯 금액 설정
      await widgetsRef.current.setAmount(amount);

      await widgetsRef.current.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });

      await widgetsRef.current.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      // 여기서는 setReady(true)를 호출할 필요 없음.
      // 위젯 초기화 useEffect에서 이미 설정됨.
    }

    // ready 상태가 true일 때만 렌더링 시작 (위젯 객체가 준비되었을 때)
    if (ready) {
      renderPaymentWidgets();
    }
  }, [ready, amount]); // ready 상태와 amount를 의존성 배열에 추가

  const updateAmount = async (newAmount) => {
    setAmount(newAmount);
    // widgetsRef.current가 null이 아닐 때만 setAmount 호출
    if (widgetsRef.current) {
      await widgetsRef.current.setAmount(newAmount);
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 금액 및 주문명 표시 (OrderPage에서 받은 값) */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">결제하기</h1>
        <p className="mb-4 text-center text-lg">결제 금액: <strong className="text-indigo-600">{amount.value.toLocaleString()}원</strong></p>
        <p className="mb-4 text-center text-md text-gray-600">주문명: {orderName || "상품"}</p>

        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={async (event) => {
                  await updateAmount({
                    currency: amount.currency,
                    value: event.target.checked
                      ? amount.value - 5000
                      : amount.value + 5000,
                  });
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          onClick={async () => {
            try {
              // ⭐ widgetsRef.current를 사용 ⭐
              await widgetsRef.current.requestPayment({
                orderId: orderId,
                orderName: orderName,
                successUrl: `${window.location.origin}/toss/success`,
                failUrl: `${window.location.origin}/toss/pay/fail`,
                customerEmail: customerEmail,
                customerName: customerName,
                customerMobilePhone: customerMobilePhone,
              });
            } catch (error) {
              console.error(error);
              if (error.code === 'USER_CANCEL') {
                  alert('결제를 취소하셨습니다.');
              } else {
                  alert(`결제 오류: ${error.message}`);
              }
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}