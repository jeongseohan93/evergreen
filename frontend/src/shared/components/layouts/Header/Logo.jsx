// frontend/src/shared/components/layouts/Header/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트를 사용해 SPA 내에서 이동

import LogoImage from '../../../../image/logo.png'; 

const Logo = () => {
  return (
    <Link to="/" className="block"> {/* to="/" 로 홈 경로 지정, block 클래스로 클릭 영역 확보 */}
   
      <img 
        src={LogoImage} // ⭐ import한 변수를 src에 할당합니다. ⭐
        alt="Logo" 
        className="h-24 w-auto" // Tailwind CSS 예시: 높이 10단위, 너비 자동
      />

    </Link>
  );
};

export default Logo;
