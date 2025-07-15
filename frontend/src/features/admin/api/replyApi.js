// frontend/src/features/admin/api/replyApi.js
import { apiService } from '@/shared'; 

// 특정 게시글의 댓글 목록 조회
export const getRepliesByBoardId = async (boardId) => {
  try {
    const response = await apiService.get(`/admin/reply/${boardId}/replies`);
    return { success: true, data: response.data || [] };
  } catch (error) {
    console.error('API Error: getRepliesByBoardId', error);
    return { success: false, message: error.response?.data?.message || '댓글 목록 불러오기 실패' };
  }
};

// 특정 게시글에 댓글 추가
export const createReply = async (boardId, replyData) => {
  try {
    const response = await apiService.post(`/admin/reply/${boardId}/replies`, replyData);
    return { success: response.status === 201, data: response.data, message: '댓글이 성공적으로 작성되었습니다.' };
  } catch (error) {
    console.error('API Error: createReply', error);
    return { success: false, message: error.response?.data?.message || '댓글 작성 실패' };
  }
};

// 댓글 수정
export const updateReply = async (replyId, updatedReplyData) => {
  try {
    const response = await apiService.put(`/admin/reply/${replyId}`, updatedReplyData);
    return { success: response.status === 200, message: response.data.message || '댓글이 성공적으로 수정되었습니다.' };
  } catch (error) {
    console.error('API Error: updateReply', error);
    return { success: false, message: error.response?.data?.message || '댓글 수정 실패' };
  }
};

// 댓글 삭제
export const deleteReply = async (replyId) => {
  try {
    const response = await apiService.delete(`/admin/reply/${replyId}`);
    return { success: response.status === 200, message: response.data.message || '댓글이 성공적으로 삭제되었습니다.' };
  } catch (error) {
    console.error('API Error: deleteReply', error);
    return { success: false, message: error.response?.data?.message || '댓글 삭제 실패' };
  }
};
