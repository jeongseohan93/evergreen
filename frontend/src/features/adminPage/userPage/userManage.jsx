// localhost:3000/admin/user
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser, restoreUser } from "../../../services/admin/adminUserApi";

const UserManage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (e) {
      console.error('회원 목록 조회 실패:', e);
      setError('회원 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 검색 처리 함수
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 회원 제명 처리 함수
  const handleDeleteUser = async (userUuid) => {
    if (window.confirm('정말로 이 회원을 제명하시겠습니까?')) {
      try {
        await deleteUser(userUuid);
        alert('회원이 성공적으로 제명되었습니다.');
        fetchUsers();
      } catch (error) {
        console.error('회원 제명 실패:', error);
        alert('회원 제명 중 오류가 발생했습니다.');
      }
    }
  };

  // 회원 제명 해제 처리 함수
  const handleRestoreUser = async (userUuid) => {
    if (window.confirm('이 회원의 제명을 해제하시겠습니까?')) {
      try {
        await restoreUser(userUuid);
        alert('회원 제명이 해제되었습니다.');
        fetchUsers();
      } catch (error) {
        console.error('회원 제명 해제 실패:', error);
        alert('회원 제명 해제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="m-0">회원 관리</h2>
        <button 
          onClick={() => navigate('/admin')}
          className="px-4 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
        >
          대시보드로 이동
        </button>
      </div>

      {/* 검색 영역 추가 */}
      <div className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="회원 이름을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-3">이름</th>
              <th className="p-3">이메일</th>
              <th className="p-3">전화번호</th>
              <th className="p-3">주소</th>
              <th className="p-3">가입일</th>
              <th className="p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-5 text-center">로딩 중...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-5 text-center text-red-500">{error}</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-5 text-center">등록된 회원이 없습니다.</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-5 text-center">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.user_uuid} className={`border-b border-gray-200 ${user.deletedAt ? 'text-gray-400' : ''}`}>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.address}</td>
                  <td className="p-3">{new Date(user.createdAt).toISOString().split('T')[0]}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {user.deletedAt ? (
                        <button 
                          className="px-3 py-1.5 cursor-pointer bg-gray-300 text-white border-none rounded hover:bg-blue-400 transition-colors"
                          onClick={() => handleRestoreUser(user.user_uuid)}
                        >
                          제명 해제
                        </button>
                      ) : (
                        <>
                          <button 
                            className="px-3 py-1.5 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
                            onClick={() => handleDeleteUser(user.user_uuid)}
                          >
                            회원 제명
                          </button>
                          <button 
                            className="px-3 py-1.5 cursor-pointer bg-green-500 text-white border-none rounded hover:bg-green-600 transition-colors"
                            onClick={() => navigate(`/admin/user/edit/${user.user_uuid}`)}
                          >
                            수정
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManage;

