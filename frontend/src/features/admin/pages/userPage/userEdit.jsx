import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../../hooks/useUser";

const UserEdit = () => {
  const navigate = useNavigate();
  const { userUuid } = useParams();
  const {
    selectedUser,
    userDetailLoading,
    userDetailError,
    fetchUserById,
    updateUserInfo,
  } = useUsers();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserById(userUuid);
      if (user) {
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [userUuid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUserInfo(userUuid, form);
    if (result.success) {
      alert("회원 정보가 수정되었습니다.");
      navigate("/admin/user");
    } else {
      alert(result.error);
    }
  };

  //배경색 임시 설정
  React.useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f2f2e8';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  if (userDetailLoading) return <div className="p-5">로딩 중...</div>;
  if (userDetailError) return <div className="p-5 text-red-500">{userDetailError}</div>;
  
  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="p-5 max-w-xl mx-auto">
        <h2 className="mb-5 text-black text-4xl font-aggro font-bold">회원 정보 수정</h2>
        <div className="bg-white p-8 rounded-lg border border-[#306f65]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              required
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="전화번호"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="주소"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65]"
              >
                저장
              </button>
              <button
                type="button"
                className="px-4 py-2 cursor-pointer text-[#306f65] border-transparent rounded transition-colors bg-white border-[#306f65] border"
                onClick={() => navigate("/admin/user")}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;