import { useState } from "react";
import { checkLoginStatus } from "../../services/userApi";

export const useUserAuthStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
  
    const checkAuthStatus = async () => {
      try {
        const result = await checkLoginStatus();
        if (result.success) {
          setIsLoggedIn(true);
          setUserRole(result.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        // ✅ 401 에러로 오는 경우에도 '로그아웃 상태'로 간주
        setIsLoggedIn(false);
        setUserRole(null);
        // ❌ throw error;  ← 이거 지워야 콘솔에 안 찍힘
      }
    };
  
    return { isLoggedIn, userRole, checkAuthStatus };
  };
  