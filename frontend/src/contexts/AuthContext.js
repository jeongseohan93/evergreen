// frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // jwt-decode 라이브러리 import

// 1. AuthContext 생성: 애플리케이션의 인증 상태를 공유하기 위한 Context 객체
const AuthContext = createContext(null);

// 2. AuthProvider 컴포넌트: AuthContext의 값을 제공하는 Provider 컴포넌트
// 이 컴포넌트는 애플리케이션의 최상위 (예: App.js)에서 사용되어야 합니다.
export const AuthProvider = ({ children }) => {
  // user 상태: 현재 로그인된 사용자 정보를 저장 (예: { user_uuid: "...", name: "..." })
  const [user, setUser] = useState(null);
  // isAuthenticated 상태: 사용자가 로그인되었는지 여부를 나타냄
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // JWT 토큰에서 사용자 정보를 로드하는 함수
  const loadUserFromToken = useCallback(() => {
    // localStorage에서 'accessToken'이라는 이름으로 저장된 JWT 토큰을 가져옵니다.
    // 이 'accessToken' 키는 apiService.interceptors.request.use에서 사용하는 키와 일치해야 합니다.
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        // jwt-decode 라이브러리를 사용하여 토큰을 디코딩합니다.
        const decoded = jwtDecode(token);

        // 🚩 중요: 디코딩된 JWT 페이로드에서 user_uuid와 name을 추출합니다.
        // 백엔드에서 JWT를 생성할 때 payload에 user_uuid와 name 필드를 포함시켜야 합니다.
        // 예시 JWT payload: { user_uuid: "...", name: "...", exp: ..., iat: ... }
        const user_uuid = decoded.user_uuid;
        const name = decoded.name || '알 수 없음'; // name 필드가 없을 경우 '알 수 없음'으로 기본값 설정

        // 토큰이 유효하고 만료되지 않았는지 추가 검사 (선택 사항이지만 권장)
        // if (decoded.exp * 1000 < Date.now()) {
        //   console.warn("JWT 토큰이 만료되었습니다.");
        //   localStorage.removeItem('accessToken');
        //   setUser(null);
        //   setIsAuthenticated(false);
        //   return false;
        // }

        // 사용자 정보와 인증 상태 업데이트
        setUser({ user_uuid, name });
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        // 토큰 디코딩 실패 (예: 토큰 형식이 잘못되었거나, 만료되었거나)
        console.error("JWT 디코딩 또는 토큰 유효성 검사 실패:", error);
        localStorage.removeItem('accessToken'); // 유효하지 않은 토큰 제거
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    }
    // 토큰이 없거나 유효하지 않으면 사용자 정보 초기화
    setUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  // 컴포넌트가 마운트될 때 (앱 시작 시) 사용자 정보를 로드합니다.
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]); // loadUserFromToken 함수가 변경될 때마다 다시 실행 (deps에 useCallback으로 감싸서 안정화)

  // 로그인 함수: 백엔드 로그인 API 호출 후 받은 토큰과 사용자 데이터를 저장합니다.
  const login = useCallback((token, userData) => {
    localStorage.setItem('accessToken', token); // 받은 토큰을 localStorage에 저장
    // userData는 백엔드 로그인 응답에서 user_uuid, name 등을 포함해야 합니다.
    // 만약 userData가 없다면, 토큰을 디코딩하여 user 정보를 설정합니다.
    if (userData) {
      setUser(userData);
    } else {
      loadUserFromToken(); // userData가 없으면 토큰에서 정보를 로드
    }
    setIsAuthenticated(true);
  }, [loadUserFromToken]);

  // 로그아웃 함수: localStorage에서 토큰을 제거하고 사용자 정보를 초기화합니다.
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken'); // 토큰 제거
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // AuthContext를 통해 제공할 값들
  const authContextValue = {
    user, // 현재 로그인된 사용자 객체 ({ user_uuid, name })
    isAuthenticated, // 로그인 여부 (boolean)
    login, // 로그인 함수
    logout, // 로그아웃 함수
    loadUserFromToken, // 토큰 재로드 함수 (필요시 수동으로 호출)
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. useAuth 훅: 다른 컴포넌트에서 AuthContext의 값을 쉽게 사용할 수 있도록 돕는 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  // AuthProvider로 감싸져 있지 않은 경우 에러 발생 (개발 시 유용)
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
