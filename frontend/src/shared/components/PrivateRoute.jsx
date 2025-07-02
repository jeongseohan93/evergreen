import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsLoggedIn,
  selectRole,
  selectStatus
} from '@/features/authentication/authSlice';

const PrivateRoute = ({ children, role: allowedRoles = [] }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectRole);
  const status = useSelector(selectStatus);
  const location = useLocation();

  // 1. 인증/권한 정보가 준비될 때까지 대기 (idle 또는 loading)
  if (status === 'loading' || status === 'idle') {
    // 로딩 스피너를 보여주거나 null 반환
    return null; // 또는 <Spinner />
  }
 // 2. 로그인 안 돼 있음 → /login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. 역할 체크
  const normalizedRole = userRole?.toLowerCase() || '';
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to="/403" replace />;
  }
  return children;  
};

export default PrivateRoute;
