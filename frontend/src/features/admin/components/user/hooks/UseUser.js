import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, restoreUser, getUserById, updateUser } from "../../../api/userApi";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [userDetailError, setUserDetailError] = useState(null);

  // 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      setError("회원 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 회원 삭제
  const handleDeleteUser = async (userUuid) => {
    await deleteUser(userUuid);
    fetchUsers();
  };

  // 회원 복구
  const handleRestoreUser = async (userUuid) => {
    await restoreUser(userUuid);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 회원 상세 조회
  const fetchUserById = async (userUuid) => {
    setUserDetailLoading(true);
    setUserDetailError(null);
    try {
      const user = await getUserById(userUuid);
      setSelectedUser(user);
      return user;
    } catch (e) {
      setUserDetailError("회원 정보를 불러오지 못했습니다.");
      setSelectedUser(null);
      return null;
    } finally {
      setUserDetailLoading(false);
    }
  };

  // 회원 정보 수정
  const updateUserInfo = async (userUuid, updateData) => {
    try {
      await updateUser(userUuid, updateData);
      return { success: true };
    } catch (e) {
      return { success: false, error: "회원 정보 수정에 실패했습니다." };
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    handleDeleteUser,
    handleRestoreUser,
    setUsers,
    selectedUser,
    userDetailLoading,
    userDetailError,
    fetchUserById,
    updateUserInfo,
  };

  
}




