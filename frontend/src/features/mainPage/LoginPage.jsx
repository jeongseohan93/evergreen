import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userApi";
import Header from "../../components/layouts/Headers/Header";
import SearchBar from "../../components/layouts/Headers/SubHeader";
import MenuBar from "../../components/ui/MenuBar/MenuBar";
import Footer from "../../components/layouts/Footers/Footer";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ email, password: pw });
      if (result.success) {
        const userRole = result.role;
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      } else {
        alert(result.message || "로그인 실패");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  function RegisterPage() {
    navigate("/register");
  };

  return (
    <>
    <Header />
    <SearchBar />
    <MenuBar />
    <div className="flex justify-center items-center min-h-[500px] bg-white">
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
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoComplete="current-password"
        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      />
      <button
        type="submit"
        className="w-full py-3 bg-black text-white font-bold rounded hover:bg-gray-800"
      >
      로그인
      </button>
    </form>

    <div className="flex justify-between mt-4 text-sm">
      <a href="#" className="hover:underline">회원가입</a>
      <a href="#" className="hover:underline">ID 찾기</a>
      <a href="#" className="hover:underline">비밀번호 찾기</a>
  </div>
</div>
</div>

    <Footer />
    </>
  );
}

export default LoginPage;
