import { useEffect } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserAuthStatus } from "../../../hooks/LoginHook/UserAuthStatus";
import { logoutUser } from "../../../services/userApi";

function Header() {
  const navigate = useNavigate();

  // ✅ Hook은 컴포넌트 최상단에서 호출
  const { isLoggedIn, userRole, checkAuthStatus } = useUserAuthStatus();

  useEffect(() => {
    checkAuthStatus(); // ❌ useUserAuthStatus() 다시 부르면 안 됨
  }, []);

  const branchStatus = async () => {
    if (isLoggedIn) {
      await logoutUser();
      await checkAuthStatus();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-10 bg-black pl-10 pr-10">
      <nav className="flex justify-between items-center p-2">
        <ul className="flex space-x-4">
          <li className="flex flex-row items-center gap-2">
            <FaInstagram className="text-pink-600 text-2xl hover:text-pink-800" />
            <p className="text-white">인스타그램</p>
          </li>
        </ul>

        <ul className="flex space-x-4">
          <li>
            <p className="text-white cursor-pointer" onClick={branchStatus}>
              {isLoggedIn ? "로그아웃" : "로그인"}
            </p>
          </li>
          {!isLoggedIn && (
    <li>
      <p className="text-white" onClick={() => navigate("/register")}>
        회원가입
      </p>
    </li>
  )}
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
