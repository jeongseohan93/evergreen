// frontend/src/features/admin/components/reply/hooks/useReplyManagement.js
import { useState, useEffect, useCallback } from 'react';
import {
  getRepliesByBoardId,
  createReply,
  updateReply,
  deleteReply,
} from '../../../api/replyApi'; // replyApi 경로를 현재 파일에서 api 폴더까지의 상대 경로로 확인해줘.

const useReplyManagement = (boardId) => {
  const [replies, setReplies] = useState([]); // 댓글 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 특정 게시글의 댓글 목록 불러오는 함수
  const fetchReplies = useCallback(async () => {
    if (!boardId) {
      setReplies([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getRepliesByBoardId(boardId);
      if (result.success) {
        setReplies(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Failed to fetch replies:', err);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [boardId]); // boardId가 변경될 때마다 함수 재생성

  // 새 댓글 추가 함수
  const addReply = useCallback(async (replyData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createReply(boardId, replyData);
      if (result.success) {
        // 성공적으로 추가되면 댓글 목록 새로고침
        await fetchReplies();
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
      setError('댓글 추가에 실패했습니다.');
      return { success: false, message: '댓글 추가에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, [boardId, fetchReplies]);

  // 댓글 수정 함수
  const modifyReply = useCallback(async (replyId, updatedReplyData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateReply(replyId, updatedReplyData);
      if (result.success) {
        // 성공적으로 수정되면 댓글 목록 새로고침
        await fetchReplies();
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error(`Failed to update reply with ID ${replyId}:`, err);
      setError('댓글 수정에 실패했습니다.');
      return { success: false, message: '댓글 수정에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, [fetchReplies]);

  // 댓글 삭제 함수
  const removeReply = useCallback(async (replyId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteReply(replyId);
      if (result.success) {
        // 성공적으로 삭제되면 댓글 목록 새로고침
        await fetchReplies();
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error(`Failed to delete reply with ID ${replyId}:`, err);
      setError('댓글 삭제에 실패했습니다.');
      return { success: false, message: '댓글 삭제에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  }, [fetchReplies]);

  // 컴포넌트 마운트 시 또는 boardId 변경 시 댓글 목록 불러오기
  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  return {
    replies,
    loading,
    error,
    fetchReplies,
    addReply,
    modifyReply,
    removeReply,
  };
};

export default useReplyManagement;
