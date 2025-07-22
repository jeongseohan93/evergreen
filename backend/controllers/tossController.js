// tossController.js 파일
const { Order } = require('../models');
const axios = require('axios');

exports.tossPayments = async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  // ⭐⭐⭐ 응답이 이미 전송되었는지 확인하는 플래그 ⭐⭐⭐
  let responseSent = false;

  const sendResponse = (status, data) => {
    if (!responseSent) {
      // console.log(`[sendResponse] 응답 전송: Status ${status}, Data:`, data); // 디버깅용
      res.status(status).json(data);
      responseSent = true;
    } else {
      console.warn(`[sendResponse] 경고: 이미 응답이 전송되었습니다. 중복 호출 시도 무시.`);
      // console.warn(`[sendResponse] 경고: 이미 응답이 전송되었습니다. 중복 호출 시도 무시. (데이터:`, data, ")"); // 디버깅용
    }
  };

  try {
    const secretKey = process.env.TOSS_SECRET_KEY;
    console.log('tossController 내부 secretKey (axios):', secretKey);

    if (!secretKey) {
        console.error('TOSS_SECRET_KEY가 정의되지 않았습니다. .env 파일을 확인해주세요.');
        sendResponse(500, {
            code: 'MISSING_SECRET_KEY',
            message: '.env 파일에 TOSS_SECRET_KEY가 설정되지 않았습니다.',
        });
        return; // 응답 보낸 후 함수 종료
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');
    console.log('tossController 내부 encryptedSecretKey (axios):', encryptedSecretKey);

    let tossApiResponse; // 토스페이먼츠 응답을 담을 변수 선언
    let httpStatus = 200; // 클라이언트에 보낼 HTTP 상태 코드
    let responseData = {}; // 클라이언트에 보낼 응답 데이터

    try {
        const response = await axios.post(
          "https://api.tosspayments.com/v1/payments/confirm",
          {
            orderId: orderId,
            amount: amount,
            paymentKey: paymentKey,
          },
          {
            headers: {
              Authorization: `Basic ${encryptedSecretKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        tossApiResponse = response.data; // 성공 응답 데이터 저장
        console.log("토스페이먼츠 API 성공 응답 (axios):", tossApiResponse);

        if (tossApiResponse.status === 'DONE') {
            try {
                await Order.update(
                    {
                        status: 'paid',
                        payment_key: paymentKey,
                        payment_method: tossApiResponse.method || null,
                        payment_approved_at: tossApiResponse.approvedAt ? new Date(tossApiResponse.approvedAt) : new Date(),
                    },
                    { where: { toss_order_id: orderId } }
                );
                responseData = tossApiResponse;
                httpStatus = 200;
            } catch (err) {
                console.error('DB 주문 상태 업데이트 실패 (결제는 성공):', err);
                responseData = tossApiResponse;
                httpStatus = 200; // 결제는 성공했으므로 200 응답 유지
            }
        } else {
            console.error('토스페이먼츠에서 결제 상태가 DONE이 아님:', tossApiResponse);
            try {
                await Order.update(
                    {
                        status: 'payment_failed',
                        payment_error_code: tossApiResponse.code || null,
                        payment_error_message: tossApiResponse.message || `결제 상태: ${tossApiResponse.status}`,
                    },
                    { where: { toss_order_id: orderId } }
                );
            } catch (err) {
                console.error('DB 주문 상태 업데이트 실패 (결제 상태 DONE 아님 케이스):', err);
            }
            responseData = {
                code: tossApiResponse.code || 'PAYMENT_NOT_DONE',
                message: tossApiResponse.message || `결제가 완료되지 않았습니다. 현재 상태: ${tossApiResponse.status}`,
            };
            httpStatus = 400;
        }

    } catch (axiosError) {
        console.error('토스페이먼츠 API 요청 중 오류 발생 (axiosError):');
        if (axiosError.response) {
            tossApiResponse = axiosError.response.data;
            console.error('  응답 데이터:', tossApiResponse);
            console.error('  응답 상태:', axiosError.response.status);
            responseData = {
                code: tossApiResponse.code || 'TOSS_API_ERROR',
                message: tossApiResponse.message || '토스페이먼츠 API에서 오류가 발생했습니다.',
            };
            httpStatus = axiosError.response.status;
        } else if (axiosError.request) {
            console.error('  응답 없음 (네트워크 에러):', axiosError.request);
            responseData = {
                code: 'NETWORK_ERROR',
                message: '토스페이먼츠 API에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.',
            };
            httpStatus = 500;
        } else {
            console.error('  에러 메시지 (axios 요청 설정 에러):', axiosError.message);
            responseData = {
                code: 'AXIOS_REQUEST_ERROR',
                message: axiosError.message || '결제 요청 설정 중 알 수 없는 오류가 발생했습니다.',
            };
            httpStatus = 500;
        }

        try {
            await Order.update(
                {
                    status: 'payment_failed',
                    payment_error_code: responseData.code || 'UNKNOWN_ERROR',
                    payment_error_message: responseData.message || '토스페이먼츠 API 통신 오류',
                },
                { where: { toss_order_id: orderId } }
            );
        } catch (dbUpdateError) {
            console.error('DB 주문 상태 업데이트 실패 (axios 에러 케이스):', dbUpdateError);
        }
    }

    // ⭐⭐⭐ 최종 응답은 sendResponse 함수를 통해 단 한 번만! ⭐⭐⭐
    sendResponse(httpStatus, responseData);

  } catch (outerError) {
      console.error('최종 결제 처리 중 예측 불가능한 치명적인 오류 발생:', outerError);
      sendResponse(500, {
          code: 'UNEXPECTED_SERVER_ERROR',
          message: '결제 처리 중 알 수 없는 서버 오류가 발생했습니다.',
      });
  }
};