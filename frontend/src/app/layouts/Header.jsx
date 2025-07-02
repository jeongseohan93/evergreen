import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { FaInstagram } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn, logoutAsync, selectRole } from '@/features/authentication/authSlice';


function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectRole);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/');
  };
    return(
      <div className="h-10 bg-black pl-10 pr-10">
        <nav className="flex justify-between items-center p-2">
          <ul className="flex space-x-4">
            <li className="flex flex-row items-center gap-2">
              <a
                href="https://www.instagram.com/e.g.bassfishing_kor?igsh=bGExang4cHFyeW82"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center gap-2 group"
                >
                  <FaInstagram className="text-pink-600 text-2xl group-hover:text-pink-800 transition-colors duration-200" />
                  <p className="text-white group-hover:text-pink-400 transition-colors duration-200 font-semibold tracking-wide">
                  Instagram
                  </p>
                </a>
            </li>
          </ul>

          <ul className="flex space-x-4">
  {!isLoggedIn ? (
    // 여기를 주목해주세요! React Fragment로 두 개의 <li>를 감싸줍니다.
    <>
      <li>  
        <Link to='/login' className="text-white hover:text-blue-400 transition-colors duration-200">로그인</Link>
      </li>
      <li>  
        <Link to='/register' className="text-white hover:text-blue-400 transition-colors duration-200">회원가입</Link>
      </li>
    </>
  ) : (
    // 이 부분은 하나의 <li>만 있으므로 괜찮습니다.
    <li>
      <button onClick={handleLogout} className="text-white hover:text-blue-400 transition-colors duration-200">로그아웃</button>
    </li>
  )}
  {userRole === 'admin' && (
    <li>
      <Link to='/admin' className="text-white hover:text-blue-400 transition-colors duration-200">
        관리자 페이지
      </Link>
    </li>
  )}
  {/* 이 아래 <li> 태그들은 조건부 렌더링과 무관하게 항상 렌더링됩니다. */}
  <li>
    <Link to='/mypage/orders' className="text-white hover:text-blue-400 transition-colors duration-200">
      주문/배송조회
    </Link>
  </li>

  <li>
    <Link to='/community/support' className="text-white hover:text-blue-400 transition-colors duration-200">
      고객센터
    </Link>
  </li>
</ul>
        </nav>
    </div>
    )
}

export default Header;