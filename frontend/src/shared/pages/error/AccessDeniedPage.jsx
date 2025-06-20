// src/pages/error/AccessDeniedPage.jsx
import { Link } from 'react-router-dom';
import './AccessDeniedPage.css'; // 👈 CSS 분리

const AccessDeniedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="glitch text-4xl font-bold mb-4" data-text="접근 권한 없음">
        이 페이지에 접근할 수 있는 권한이 없습니다.
      </h1>
      <p className="text-gray-400 mb-6">403 Forbidden</p>
      <Link to="/" className="text-blue-400 hover:underline">홈으로 돌아가기 →</Link>
    </div>
  );
};

export default AccessDeniedPage;
