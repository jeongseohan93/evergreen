import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../components/user/hooks/UseUser';

const UserManage = ({ onEditUser }) => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    handleDeleteUser,
    handleRestoreUser,
    setUsers,
  } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  // users가 바뀔 때마다 filteredUsers도 동기화
  React.useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="flex justify-between items-center mb-5">
        <h2 className="m-0 text-black text-4xl font-aggro font-bold">회원 관리</h2>
      </div>

      {/* 검색 영역 추가 */}
      <div className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="회원 이름을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          style={{ backgroundColor: '#58bcb5' }}
          className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors"
          onClick={handleSearch}
        >
          검색
        </button>
        <button
          className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-gray-400 hover:bg-gray-500"
          onClick={() => {
            setSearchTerm("");
            setFilteredUsers(users);
          }}
        >
          초기화
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-4 text-base">이름</th>
              <th className="p-4 text-base">이메일</th>
              <th className="p-4 text-base">전화번호</th>
              <th className="p-4 text-base">주소</th>
              <th className="p-4 text-base">가입일</th>
              <th className="p-4 text-base">관리</th>
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
                <tr key={user.user_uuid} className={`border-b border-gray-400 ${user.deletedAt ? 'text-gray-400' : ''}`}>
                  <td className="p-3 text-sm">{user.name}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm">{user.phone}</td>
                  <td className="p-3 text-sm">{user.address}</td>
                  <td className="p-3 text-sm">{new Date(user.createdAt).toISOString().split('T')[0]}</td>
                  <td className="p-3 text-sm">
                    <div className="flex gap-2">
                      {user.deletedAt ? (
                        <button 
                        className="px-3 py-1.5 cursor-pointer text-white border-transparent rounded transition-colors bg-[#306f65] hover:bg-white hover:text-[#306f65] hover:border-[#306f65] border"
                          onClick={() => handleRestoreUser(user.user_uuid)}
                        >
                          제명 해제
                        </button>
                      ) : (
                        <>
                          <button 
                            className="px-3 py-1.5 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
                            onClick={() => {
                              if (window.confirm('정말로 이 회원을 제명하시겠습니까?')) {
                                handleDeleteUser(user.user_uuid);
                              }
                            }}
                          >
                            회원 제명
                          </button>
                          <button 
                            className="px-3 py-1.5 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5]"
                            onClick={() => onEditUser && onEditUser(user.user_uuid)}
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

