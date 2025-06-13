import {useEffect, useState} from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate    } from "react-router-dom";
function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn ] = useState(null);

    

    return (
        <div className="h-10 bg-black pl-10 pr-10">
            <nav className="flex justify-between items-center p-2">
                <ul className="flex space-x-4">
                    <li>
                        <FaFacebook className="text-blue-600 text-2xl hover:text-blue-800" />
                    </li>

                    <li>
                        <FaInstagram className="text-pink-600 text-2xl hover:text-pink-800" />
                    </li>
                    
                </ul>

                <ul className="flex space-x-4">
                    <li>
                        <p className="text-white" onClick={() => navigate('/login')}>로그인</p>
                    </li>
                    <li>
                        <p className="text-white">회원가입</p>
                    </li>
                    <li>
                        <p className="text-white">주문/배송조회</p>
                    </li>
                    <li>
                        <p className="text-white">고객센터</p>
                    </li>   
                </ul>
            </nav>
        </div>
    );
}

export default Header;