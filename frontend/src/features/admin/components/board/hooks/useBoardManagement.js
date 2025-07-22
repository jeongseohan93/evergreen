// frontend/src/features/admin/components/board/hooks/useBoardManagement.js
import { useState, useEffect, useCallback } from 'react';
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../../../api/boardApi'; // boardApi 경로를 현재 파일에서 api 폴더까지의 상대 경로로 확인해줘.

const useBoardManagement = () => {
  const [boards, setBoards] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedBoard, setSelectedBoard] = useState(null); // 특정 게시글 상세 보기 시 사용

  // 모든 게시글 불러오는 함수 (boardType과 keyword 인자 추가)
  // `boardType`은 'review' 또는 'free'가 될 수 있으며, 기본값은 빈 문자열로 설정하여 필터링 없음
  // `keyword`는 검색어이며, 기본값은 빈 문자열로 설정하여 검색 없음
  const fetchBoards = useCallback(async (boardType = '', keyword = '', notice = '') => { // notice 인자 추가
    setLoading(true);
    setError(null);
    try {
      const result = await getAllBoards(boardType, keyword, notice); // notice 인자 전달
      if (result.success) {
        setBoards(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Failed to fetch boards:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열 비워둠: useCallback으로 감싸져 있으므로 인자가 변경되어도 함수 재생성 방지 (하지만 boardType과 keyword는 인자이므로 상관없음)

  // 특정 게시글 불러오는 함수 (변경 없음)
  const fetchBoardById = useCallback(async (boardId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBoardById(boardId);
      if (result.success) {
        setSelectedBoard(result.data);
      } else {
        setError(result.message);
        setSelectedBoard(null);
      }
    } catch (err) {
      console.error(`Failed to fetch board with ID ${boardId}:`, err);
      setError('게시글 상세 정보를 불러오는데 실패했습니다.');
      setSelectedBoard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 새 게시글 추가 함수 (변경 없음, newBoardData에 enum이 포함되어야 함)
  const addBoard = useCallback(async (newBoardData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBoard(newBoardData);
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Failed to add board:', err);
      setError('게시글 추가에 실패했습니다.');
      return { success: false, message: '게시글 추가에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, []); // fetchBoards 의존성 제거, 호출하는 곳(BoardManager.jsx)에서 handleSaveBoard 이후 fetchBoards(currentBoardType) 호출 권장

  // 게시글 수정 함수 (변경 없음, updatedBoardData에 enum이 포함되어야 함)
  const modifyBoard = useCallback(async (boardId, updatedBoardData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateBoard(boardId, updatedBoardData);
      if (result.success) {
        // 성공적으로 수정되면 목록을 새로고침 (fetchBoards 호출 시 현재 boardType을 알아야 함)
        // await fetchBoards(); // 🚩 이 부분 대신 BoardManager.jsx에서 처리
        // 만약 수정된 게시글이 현재 선택된 게시글이라면 업데이트
        if (selectedBoard && selectedBoard.board_id === boardId) {
            setSelectedBoard(prev => ({ ...prev, ...updatedBoardData, updated_at: new Date().toISOString() }));
        }
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error(`Failed to update board with ID ${boardId}:`, err);
      setError('게시글 수정에 실패했습니다.');
      return { success: false, message: '게시글 수정에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, [selectedBoard]); // fetchBoards 의존성 제거, 호출하는 곳(BoardManager.jsx)에서 handleSaveBoard 이후 fetchBoards(currentBoardType) 호출 권장

  // 게시글 삭제 함수
  const removeBoard = useCallback(async (boardId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteBoard(boardId);
      if (result.success) {
        // 성공적으로 삭제되면 목록에서 제거
        setBoards(prevBoards => prevBoards.filter(board => board.board_id !== boardId));
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error(`Failed to delete board with ID ${boardId}:`, err);
      setError('게시글 삭제에 실패했습니다.');
      return { success: false, message: '게시글 삭제에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 게시글 목록 불러오기 (초기 로드)
  useEffect(() => {
    fetchBoards(); // 🚩 인자 없이 호출하면 기본값인 모든 게시글을 가져옴.
                   //    BoardManager.jsx에서 currentBoardType에 따라 fetchBoards를 다시 호출할 예정이므로 문제 없음.
  }, [fetchBoards]); // fetchBoards가 useCallback으로 감싸져 있으므로 한번만 실행됨

  return {
    boards,
    selectedBoard,
    loading,
    error,
    fetchBoards, // 변경된 fetchBoards 함수 노출
    fetchBoardById,
    addBoard,
    modifyBoard,
    removeBoard,
    setSelectedBoard // 필요하다면 외부에서 selectedBoard를 초기화할 수 있도록 노출
  };
};

export default useBoardManagement;
