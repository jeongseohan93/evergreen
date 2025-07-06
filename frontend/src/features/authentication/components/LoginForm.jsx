import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '@/shared';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: handleLogin, isLoggedIn, status, error } = useAuth();

  const isLoading = status === "loading";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    if (error) {
      console.error("로그인 실패:", error);
    }
  }, [isLoggedIn, error, navigate]);

  const loginInfo = {email, password};  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(loginInfo);
  }
 
  return (
    <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md border border-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-bold rounded hover:bg-gray-800"
        >
          {isLoading ? ( 
            <div className="flex justify-center items-center">
              <Spinner size="20px" color="#ffffff" />
            </div>
            ) : ( "로그인") }
        </button>

        {error && (
          <div className="text-red-600 text-sm text-center mt-2">
            {/* 에러메세지 타입이 문자열로 정의 되어야 오류 발생 X */}
            {typeof error === "string" ? error : error?.message}  
          </div>
        )}
      </form>

      <div className="flex justify-between mt-4 text-sm">
        <Link to = '/register' className="hover:underline">
          회원가입
        </Link>

        <Link to = '/findid' className="hover:underline">
          ID 찾기
        </Link>

        <Link to = '/findpassword' className="hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
