// ===============================
// [에러 처리 미들웨어]
// - notFound: 존재하지 않는 라우터(404) 처리 (요청 메서드/URL 정보 포함)
// - errorHandler: 서버 내부/전체 에러 처리 (운영/개발 환경 분기, JSON 응답)
// ===============================

// 404 Not Found 처리 미들웨어
// - 등록되지 않은 라우터로 접근 시 에러 객체를 만들어 다음 미들웨어(errorHandler)로 전달
function notFound(req, res, next) {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
}

// 서버 내부 에러 처리 미들웨어
// - 에러 객체를 받아 상태코드/메시지/에러 상세정보를 JSON 형태로 클라이언트에 응답
// - 개발환경에서는 에러 전체를, 운영환경에서는 메시지만 노출(보안)
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || '서버 오류가 발생했습니다.';
  const errorDetails = process.env.NODE_ENV !== 'production' ? err : {};

  res.status(status).json({
    message,        // 에러 메시지
    error: errorDetails, // 에러 상세 정보(개발용)
  });
}

module.exports = { notFound, errorHandler };
