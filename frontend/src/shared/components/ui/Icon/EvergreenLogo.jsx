// EvergreenLogo.jsx
import React from "react";
import { Link } from "react-router-dom";


// 🚨 fontSizeClass prop을 추가합니다.
// 기본값으로 'text-4xl'을 설정하여, prop을 전달하지 않아도 기존처럼 작동하게 합니다.
const EvergreenLogo = ({ fontSizeClass = "text-4xl" }) => { 
    return (
        <Link to='/'>
            <p className="text-black text-4xl font-aggro font-bold hover:text-blue-500">에버그린</p> 
        </Link>
       
    );
};

export default EvergreenLogo;