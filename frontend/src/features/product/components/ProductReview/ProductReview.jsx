import React, { useState, useEffect } from 'react';
import useBoardManagement from '@/features/admin/components/board/hooks/useBoardManagement';
import SharedBoardList from '@/shared/components/board/SharedBoardList';
import SharedBoardDetail from '@/shared/components/board/SharedBoardDetail';
import { getRepliesByBoardId, createReply, updateReply, deleteReply } from '@/features/admin/api/replyApi';

const ProductReview = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [replies, setReplies] = useState([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesError, setRepliesError] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editingReplyContent, setEditingReplyContent] = useState('');
    const [newReplyContent, setNewReplyContent] = useState('');
    const { fetchBoards, boards: allBoards, fetchBoardById, selectedBoard } = useBoardManagement();

    // 사용후기 가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;
            try {
                setReviewsLoading(true);
                await fetchBoards('review', '', '');
            } catch (err) {
                console.error('사용후기 조회 실패:', err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [productId, fetchBoards]);

    // allBoards 상태가 변경될 때 해당 상품의 사용후기 필터링
    useEffect(() => {
        if (allBoards && productId) {
            console.log('allBoards:', allBoards);
            console.log('현재 productId:', productId, '타입:', typeof productId);
            
            const productReviews = allBoards.filter(review => {
                console.log('review.product_id:', review.product_id, '타입:', typeof review.product_id);
                console.log('비교 결과:', review.product_id === parseInt(productId));
                return review.product_id === parseInt(productId);
            });
            console.log('필터링된 사용후기:', productReviews);
            setReviews(productReviews);
        }
    }, [allBoards, productId]);

    // 게시글 선택 핸들러
    const handleSelectReview = async (boardId) => {
        try {
            setRepliesLoading(true);
            setRepliesError(null);
            
            // 게시글 상세 정보 가져오기
            await fetchBoardById(boardId);
            
            // 댓글 가져오기
            const repliesResult = await getRepliesByBoardId(boardId);
            if (repliesResult.success) {
                setReplies(repliesResult.data);
            } else {
                setRepliesError(repliesResult.message);
                setReplies([]);
            }
        } catch (err) {
            console.error('게시글 상세 조회 실패:', err);
            setRepliesError('게시글을 불러오는데 실패했습니다.');
        } finally {
            setRepliesLoading(false);
        }
    };

    // selectedBoard가 변경될 때 selectedReview 업데이트
    useEffect(() => {
        if (selectedBoard) {
            setSelectedReview(selectedBoard);
        }
    }, [selectedBoard]);

    // 목록으로 돌아가기
    const handleBackToList = () => {
        setSelectedReview(null);
        setReplies([]);
        setEditingReplyId(null);
        setEditingReplyContent('');
        setNewReplyContent('');
        setRepliesError(null);
    };

    // 댓글 관련 핸들러들
    const handleEditReply = (reply) => {
        setEditingReplyId(reply.reply_id);
        setEditingReplyContent(reply.content);
    };

    const handleSaveEditedReply = async (replyId) => {
        try {
            const result = await updateReply(replyId, { content: editingReplyContent });
            if (result.success) {
                const updatedReplies = await getRepliesByBoardId(selectedReview.board_id);
                if (updatedReplies.success) {
                    setReplies(updatedReplies.data);
                }
                setEditingReplyId(null);
                setEditingReplyContent('');
            } else {
                console.error('댓글 수정 실패:', result.message);
            }
        } catch (err) {
            console.error('댓글 수정 실패:', err);
        }
    };

    const handleCancelEditReply = () => {
        setEditingReplyId(null);
        setEditingReplyContent('');
    };

    const handleDeleteReply = async (replyId) => {
        try {
            const result = await deleteReply(replyId);
            if (result.success) {
                const updatedReplies = await getRepliesByBoardId(selectedReview.board_id);
                if (updatedReplies.success) {
                    setReplies(updatedReplies.data);
                }
            } else {
                console.error('댓글 삭제 실패:', result.message);
            }
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
        }
    };

    const handleAddReply = async () => {
        if (!newReplyContent.trim()) return;
        try {
            const result = await createReply(selectedReview.board_id, { content: newReplyContent });
            if (result.success) {
                const updatedReplies = await getRepliesByBoardId(selectedReview.board_id);
                if (updatedReplies.success) {
                    setReplies(updatedReplies.data);
                }
                setNewReplyContent('');
            } else {
                console.error('댓글 추가 실패:', result.message);
            }
        } catch (err) {
            console.error('댓글 추가 실패:', err);
        }
    };

    const handleReplyInputFocus = () => {
        // 로그인 체크 등의 로직이 필요하다면 여기에 추가
    };

    if (reviewsLoading) {
        return (
            <div className="py-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">사용후기 ({reviews.length})</h3>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#306f65] mx-auto"></div>
                    <p className="mt-2 text-gray-600">사용후기를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 상세보기 모드일 때
    if (selectedReview) {
        return (
            <div className="py-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">사용후기 상세보기</h3>
                <SharedBoardDetail
                    selectedBoard={selectedReview}
                    replies={replies}
                    repliesLoading={repliesLoading}
                    repliesError={repliesError}
                    editingReplyId={editingReplyId}
                    editingReplyContent={editingReplyContent}
                    newReplyContent={newReplyContent}
                    handleEditBoardClick={() => {}}
                    handleDeleteBoard={() => {}}
                    handleCancel={handleBackToList}
                    handleEditReply={handleEditReply}
                    handleSaveEditedReply={handleSaveEditedReply}
                    handleCancelEditReply={handleCancelEditReply}
                    handleDeleteReply={handleDeleteReply}
                    handleAddReply={handleAddReply}
                    setNewReplyContent={setNewReplyContent}
                    setEditingReplyContent={setEditingReplyContent}
                    currentUser={null}
                    isAdmin={false}
                    onReplyInputFocus={handleReplyInputFocus}
                    hideEditDeleteButtons={true}
                    hideReplyForm={true}
                />
            </div>
        );
    }

    // 목록 보기 모드일 때
    return (
        <div className="py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용후기 ({reviews.length})</h3>
            {reviews.length > 0 ? (
                <SharedBoardList
                    boards={reviews}
                    hideHeader={true}
                    hideTabs={true}
                    hideNewButton={true}
                    hideDivider={true}
                    hideBoardListTitle={true}
                    hideSearchForm={true}
                    hideManagementButtons={true}
                    onSelectBoard={handleSelectReview}
                    hidePaging={true}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">아직 등록된 사용후기가 없습니다. 첫 후기를 남겨보세요!</p>
                </div>
            )}
        </div>
    );
};

export default ProductReview;
