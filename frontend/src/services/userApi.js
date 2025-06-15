// axios 라이브러리 import (HTTP 통신용)
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
/**
 * 로그인 요청 함수
 * @param {Object} param0 - 로그인 정보(이메일, 비밀번호)
 * @returns {Object} - 서버에서 응답한 데이터
 */
export async function loginUser({ email, password }) {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password }, {
    withCredentials: true
  });
  console.log(res.data);
  return res.data; // 응답 데이터 반환 (axios가 JSON 파싱함
}

/**
 * 이메일(아이디) 중복 체크 함수
 * @param {Object} param0 - 이메일 정보
 * @returns {Object} - 서버의 중복 여부 응답
 */
export async function idcheck({ email }) {
  const res = await axios.post(`${BASE_URL}/auth/idcheck`, { email });
  return res.data; // 응답 데이터 반환
};

/**
 * 회원가입 요청 함수
 * @param {Object} form - 회원가입 폼 전체 데이터
 * @returns {Promise} - 서버 응답 (회원가입 처리 결과)
 */
export async function register(form) {
  return await axios.post(`${BASE_URL}/auth/register`, form);
}

export async function checkLoginStatus() {
  const res = await axios.post(`${BASE_URL}/auth/logincheck`, 
  {},
  {withCredentials: true});
  return res.data;
}

export async function logoutUser() {
  const res = await axios.post(`${BASE_URL}/auth/logout`, 
  {},
  {withCredentials: true});
  return res.data;
}