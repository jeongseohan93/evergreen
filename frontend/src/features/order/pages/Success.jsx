// frontend/src/features/order/pages/Success.jsx

import { useEffect, useState, useRef } from "react"; // useRef 임포트 유지
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios'; // axios 임포트 유지

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null); // 이 상태는 UI에 직접 표시되지 않아도, 요청 결과 저장을 위해 유지

  // 요청 전송 여부를 추적하기 위한 ref (중복 요청 방지)
  const hasRequested = useRef(false);

  // console.log('SuccessPage component rendered'); // 디버깅 로그 (이제 필요 없다면 제거 가능)

  useEffect(() => {
    // console.log('SuccessPage useEffect is running'); // 디버깅 로그 (이제 필요 없다면 제거 가능)

    // 핵심 로직: 이미 요청을 보냈다면 다시 보내지 않음 (Strict Mode 중복 호출 방지)
    if (hasRequested.current) {
      // console.log('Request already sent, skipping.'); // 디버깅 로그 (이제 필요 없다면 제거 가능)
      return;
    }

    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      // console.log('Sending POST request to /toss/success with data:', requestData); // 디버깅 로그 (이제 필요 없다면 제거 가능)

      try {
        const response = await axios.post("/toss/success", requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        // console.log('Received response from /toss/success:', data); // 디버깅 로그 (이제 필요 없다면 제거 가능)
        
        // axios는 2xx가 아닌 응답에 대해 자동으로 에러를 throw하므로
        // 별도의 response.status 확인 로직은 불필요하지만, 명시적으로 둘 수도 있음.
        // if (response.status !== 200) {
        //     throw { message: data.message, code: data.code };
        // }
        
        return data; // 응답 데이터를 반환
      } catch (error) {
        // console.error('Error during /toss/success request (frontend):', error); // 디버깅 로그 (이제 필요 없다면 제거 가능)
        if (error.response) {
          throw {
            message: error.response.data.message || '알 수 없는 오류 발생',
            code: error.response.data.code || 'UNKNOWN_ERROR'
          };
        } else if (error.request) {
          throw {
            message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
            code: 'NETWORK_ERROR'
          };
        } else {
          throw {
            message: error.message || '요청 중 알 수 없는 오류 발생',
            code: 'CLIENT_ERROR'
          };
        }
      }
    }

    // 요청 시작 전 hasRequested.current를 true로 설정
    hasRequested.current = true;

    confirm()
      .then((data) => {
        setResponseData(data); // 성공 시 데이터 저장
      })
      .catch((error) => {
        // 오류 발생 시 fail 페이지로 이동
        navigate(`/toss/pay/fail?code=${error.code}&message=${error.message}`);
      });
  }, [searchParams, navigate]); // 의존성 배열은 그대로 유지

  return (
    <>
      <div className="box_section" style={{width: "600px",
          margin: "0 auto", // ⭐⭐ 이 부분 추가 ⭐⭐
          marginTop: "50px"}}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="결제 완료" />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        {/* paymentKey는 사용자에게 직접 보여주지 않는 것이 보안상 더 좋으므로 주석 처리 */}
        {/*
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
        */}
        <div className="p-grid-col" style={{ marginTop: "30px" }}>
          {/* 메인으로 돌아가기 버튼 추가 */}
          <Link to="/">
            <button className="button p-grid-col-full" style={{ width: "100%", backgroundColor: "#6366f1", color: "#fff" }}>
              메인으로 돌아가기
            </button>
          </Link>
          {/* 기존 연동 문서, 실시간 문의 버튼은 이제 필요 없다면 삭제 가능 */}
          {/*
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
              실시간 문의
            </button>
          </Link>
          */}
        </div>
      </div>
      {/* Response Data 섹션 제거 */}
      {/*
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
      */}
    </>
  );
}