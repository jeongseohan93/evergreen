import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/admin/adminUserApi";

const UserEdit = () => {
  const navigate = useNavigate();
  const { userUuid } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = await getUserById(userUuid);
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      } catch (e) {
        setError("회원 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userUuid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userUuid, form);
      alert("회원 정보가 수정되었습니다.");
      navigate("/admin/user");
    } catch (e) {
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-5">로딩 중...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-5">회원 정보 수정</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름"
          className="px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일"
          className="px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="전화번호"
          className="px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="주소"
          className="px-4 py-2 border rounded"
        />
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            저장
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
            onClick={() => navigate("/admin/user")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
