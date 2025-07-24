// EvergreenLogo.jsx
import React from "react";
import { Link } from "react-router-dom";
import everlogo  from '@/assets/image/everlogo.png';

// 🚨 fontSizeClass prop을 추가합니다.
// 기본값으로 'text-4xl'을 설정하여, prop을 전달하지 않아도 기존처럼 작동하게 합니다.
const EvergreenLogo = ({ fontSizeClass = "text-4xl" }) => { 
    return (
        <Link to='/'>
            {/* 🚨 className에 fontSizeClass prop을 사용합니다. */}
            <img src={everlogo} alt="에버그린 로고" className="w-60" />
        </Link>
       
    );
};

export default EvergreenLogo;