const redis = require('redis');
const client = redis.createClient(); // Redis 클라이언트 인스턴스 생성 (설정 옵션 추가 가능)

// Redis 서버에 연결 (비동기)
client.connect();

// ===============================
// [ Redis 토큰 관리 유틸리티 ]
// - JWT 토큰 등 인증 정보를 Redis에 저장/조회/삭제하는 함수 제공
// - 세션/블랙리스트/만료 관리 등 다양한 인증 시나리오에서 활용 가능
// ===============================
module.exports = {
  // 토큰 저장: 지정한 key에 token 값을 저장, ttl(만료시간, 초 단위) 설정 가능 (기본 1시간)
  setToken: async (key, token, ttl = 3600) => {
    await client.set(key, token, { EX: ttl }); // EX 옵션으로 만료시간 지정
  },

  // 토큰 조회: key로 저장된 token 값을 반환 (없으면 null)
  getToken: async (key) => {
    return await client.get(key);
  },

  // 토큰 삭제: key로 저장된 token 값을 삭제
  deleteToken: async (key) => {
    await client.del(key);
  },
};
