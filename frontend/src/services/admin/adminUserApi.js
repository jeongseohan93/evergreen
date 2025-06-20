import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 전체 회원 목록 조회 함수
 * @returns {Promise<Array>} - 회원 목록 데이터
 */
export async function getAllUsers() {
  const res = await axios.get(`${BASE_URL}/adminUser`, {
    withCredentials: true // 쿠키 인증 정보 포함
  });
  return res.data;
}

/**
 * 회원 제명(삭제) 함수
 * @param {string} userUuid - 제명할 회원의 UUID
 * @returns {Promise<Object>} - 제명 처리 결과
 */
export async function deleteUser(userUuid) {
  const res = await axios.delete(`${BASE_URL}/adminUser/${userUuid}`, {
    withCredentials: true
  });
  return res.data;
}

/**
 * 회원 제명 해제 함수
 * @param {string} userUuid - 제명 해제할 회원의 UUID
 * @returns {Promise<Object>} - 제명 해제 처리 결과
 */
export async function restoreUser(userUuid) {
  const res = await axios.post(`${BASE_URL}/adminUser/${userUuid}/restore`, {}, {
    withCredentials: true
  });
  return res.data;
}

/**
 * 단일 회원 정보 조회 함수
 * @param {string} userUuid - 조회할 회원의 UUID
 * @returns {Promise<Object>} - 회원 정보 데이터
 */
export async function getUserById(userUuid) {
  const res = await axios.get(`${BASE_URL}/adminUser/${userUuid}`, {
    withCredentials: true
  });
  return res.data;
}

/**
 * 회원 정보 수정 함수
 * @param {string}userUuid - 수정할 회원의 UUID
 * @param {Object} data - 수정할 회원 정보
 * @returns {Promise<Object>} - 수정된 회원 정보
 */
export async function updateUser(userUuid, data) {
  const res = await axios.put(`${BASE_URL}/adminUser/${userUuid}`, data, {
    withCredentials: true
  });
  return res.data;
}

// 모든 API 함수를 하나의 객체로 묶어서 export
export const adminUserApi = {
  getAllUsers,
  deleteUser,
  restoreUser,
  getUserById,
  updateUser
};

  