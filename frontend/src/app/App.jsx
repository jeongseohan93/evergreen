// src/App.jsx - 최종 확인 코드

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// authSlice에서 selectStatus를 꼭 import 해주세요.
import { checkAuthAsync, selectStatus } from '@/features/authentication/authSlice';
import AppRoutes from './routes';

const App = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectStatus);

  useEffect(() => {
    // 'idle'(초기) 상태일 때만 dispatch를 실행하도록 조건을 추가합니다.
    if (authStatus === 'idle') {
      dispatch(checkAuthAsync());
    }
  }, [authStatus, dispatch]); // 의존성 배열이 [authStatus, dispatch]로 되어 있는지 마지막으로 확인해주세요.

  return <AppRoutes />;
};

export default App;