import React, { useState, useEffect } from "react";
import { useUsers } from '../../components/user/hooks/UseUser';

const UserEdit = ({ userUuid, onCancel }) => {
  const {
    userDetailLoading,
    userDetailError,
    fetchUserById,
    updateUserInfo,
  } = useUsers();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    addressMain: "",
    addressDetail: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserById(userUuid);
      if (user) {
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          zipCode: user.zipCode || "",
          addressMain: user.addressMain || "",
          addressDetail: user.addressDetail || "",
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
      if (onCancel) onCancel();
    } else {
      alert(result.error);
    }
  };

  if (userDetailLoading) return <div className="p-5">로딩 중...</div>;
  if (userDetailError) return <div className="p-5 text-red-500">{userDetailError}</div>;
  
  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="p-5 max-w-2xl mx-auto">
        <h2 className="mb-5 text-black text-4xl font-aggro font-bold">회원 정보 수정</h2>
        <div className="bg-white p-8 rounded-lg border border-[#306f65]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">회원명 *:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">회원 이메일 *:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">회원 전화번호 *:</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">우편번호:</label>
              <input
                type="text"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="우편번호"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">기본주소:</label>
              <input
                type="text"
                name="addressMain"
                value={form.addressMain}
                onChange={handleChange}
                placeholder="기본주소"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-left text-[#58bcb5]">상세주소:</label>
              <input
                type="text"
                name="addressDetail"
                value={form.addressDetail}
                onChange={handleChange}
                placeholder="상세주소"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-[#58bcb5]"
              >
                저장
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 cursor-pointer text-white border-transparent rounded transition-colors border-[#306f65] border hover:bg-gray-500"
                onClick={onCancel}
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