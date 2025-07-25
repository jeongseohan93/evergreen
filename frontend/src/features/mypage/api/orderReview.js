import { getAllBoards } from '@/features/admin/api/boardApi';

// 기존 사용후기 작성 여부 체크
export const checkExistingReview = async (userUuid, productId) => {
  if (!userUuid || !productId) return { alreadyWroteReview: false, existingReview: null };
  
  const result = await getAllBoards('review', '', '');
  if (result.success) {
    const found = result.data.find(
      board => board.user_id === userUuid && board.product_id === productId
    );
    if (found) {
      return { alreadyWroteReview: true, existingReview: found };
    } else {
      return { alreadyWroteReview: false, existingReview: null };
    }
  }
  return { alreadyWroteReview: false, existingReview: null };
};

// 사용후기 저장 (작성 또는 수정)
export const saveReview = async (formData, alreadyWroteReview, existingReview, addBoard, updateBoard) => {
  // 게시판 타입을 사용후기로 고정
  const reviewFormData = {
    ...formData,
    board_type: 'review'
  };

  let result;
  if (alreadyWroteReview && existingReview) {
    // 수정 모드
    result = await updateBoard(existingReview.board_id, reviewFormData);
    if (result.success) {
      alert('사용후기가 성공적으로 수정되었습니다!');
      window.location.reload();
    } else {
      alert(result.message || '사용후기 수정에 실패했습니다.');
    }
  } else {
    // 새로 작성 모드
    result = await addBoard(reviewFormData);
    if (result.success) {
      alert('사용후기가 성공적으로 등록되었습니다!');
      window.location.reload();
    } else {
      alert(result.message || '사용후기 등록에 실패했습니다.');
    }
  }
  return result;
};