import React, { useState, useEffect, useRef } from 'react';
import { Header, SubHeader, Footer } from '@/app';
import BoardList from '@/shared/components/board/SharedBoardList';
import SharedBoardDetail from '@/shared/components/board/SharedBoardDetail';
import SharedMessageBox from '../../../shared/components/board/SharedMessageBox';
import useBoardManagement from '@/features/admin/components/board/hooks/useBoardManagement';
import useReplyManagement from '@/features/admin/components/reply/hooks/useReplyManagements';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SharedBoardForm from '@/shared/components/board/SharedBoardForm';

const ReviewListPage = () => {
  const {
    boards,
    loading,
    error,
    fetchBoards,
    fetchBoardById,
    removeBoard,
    setSelectedBoard,
    selectedBoard,
    addBoard,
    setBoards,
  } = useBoardManagement();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxType, setMessageBoxType] = useState('alert');
  const [messageBoxMessage, setMessageBoxMessage] = useState('');
  const [pendingDeleteReplyId, setPendingDeleteReplyId] = useState(null);
  const [pendingDeleteBoardId, setPendingDeleteBoardId] = useState(null);
  const [showBoardForm, setShowBoardForm] = useState(false);

  // 댓글 관리 훅 (상세보기 게시글 기준)
  const {
    replies,
    loading: repliesLoading,
    error: repliesError,
    fetchReplies,
    addReply,
    modifyReply,
    removeReply,
  } = useReplyManagement(showDetail ? selectedBoard?.board_id : null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const isRedirectingRef = useRef(false);
  
  // 댓글 입력란 포커스 시 로그인 체크
  const handleReplyInputFocus = () => {
    if (!user && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      setTimeout(() => {
        navigate('/login');
        isRedirectingRef.current = false;
      }, 100);
    }
  };

  // 댓글 작성
  const handleAddReply = async () => {
    if (!newReplyContent.trim() || !selectedBoard?.board_id) return;
    await addReply({ content: newReplyContent, user_id: user?.user_uuid });
    setNewReplyContent('');
    fetchReplies();
  };

  // 댓글 수정
  const handleEditReply = (reply) => {
    setEditingReplyId(reply.reply_id);
    setEditingReplyContent(reply.content);
  };
  const handleSaveEditedReply = async (replyId) => {
    if (!editingReplyContent.trim()) return;
    await modifyReply(replyId, { content: editingReplyContent });
    setEditingReplyId(null);
    setEditingReplyContent('');
    fetchReplies();
  };
  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditingReplyContent('');
  };
  // 댓글 삭제
  const handleDeleteReply = (replyId) => {
    setPendingDeleteReplyId(replyId);
    setMessageBoxType('confirm');
    setMessageBoxMessage('정말로 이 댓글을 삭제하시겠습니까?');
    setShowMessageBox(true);
  };

  // 게시글 삭제
  const handleDeleteBoard = (boardId) => {
    setPendingDeleteBoardId(boardId);
    setMessageBoxType('confirm');
    setMessageBoxMessage('정말로 이 게시글을 삭제하시겠습니까?');
    setShowMessageBox(true);
  };

  const handleOpenMessageBox = (type = 'alert', message = '확인하시겠습니까?') => {
    setMessageBoxType(type);
    setMessageBoxMessage(message);
    setShowMessageBox(true);
  };
  const handleConfirmMessageBox = async () => {
    setShowMessageBox(false);
    // 댓글 삭제 확정
    if (pendingDeleteReplyId) {
      await removeReply(pendingDeleteReplyId);
      fetchReplies();
      setPendingDeleteReplyId(null);
      return;
    }
    // 게시글 삭제 확정
    if (pendingDeleteBoardId) {
      await removeBoard(pendingDeleteBoardId);
      setShowDetail(false);
      setSelectedBoard(null);
      fetchBoards('review', '', '');
      setPendingDeleteBoardId(null);
      return;
    }
    // 여기에 확인 시 동작 추가 가능
  };
  const handleCancelMessageBox = () => {
    setShowMessageBox(false);
    setPendingDeleteReplyId(null);
    setPendingDeleteBoardId(null);
  };

  useEffect(() => {
    fetchBoards('review', '', ''); // 사용후기 게시글만
  }, [fetchBoards]);

  useEffect(() => {
    return () => {
      setBoards([]); // 페이지를 벗어날 때 boards 상태 초기화
      setSelectedBoard(null);
    };
  }, []);

  const handleSelectBoard = async (boardId) => {
    await fetchBoardById(boardId);
    setShowDetail(true);
    setShowForm(false);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setShowForm(false);
    setSelectedBoard(null);
    fetchBoards('review', '', '');
  };

  const handleNewBoardClick = () => {
    setSelectedBoard(null);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleSaveBoard = async (formData) => {
    await addBoard(formData);
    setShowForm(false);
    setSelectedBoard(null);
    fetchBoards('review', '', '');
  };

  const handleCancelBoardForm = () => {
    setShowForm(false);
    setSelectedBoard(null);
    fetchBoards('review', '', '');
  };

  const handleEditBoardClick = () => {
    setShowForm(true);
    setShowDetail(false);
  };

  return (
    <>
      <Header />
      <SubHeader />
      <main className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-full max-w-7xl">
          {!showForm && !showDetail && (
            <BoardList
              boards={boards}
              loading={loading}
              error={error}
              onDelete={removeBoard}
              onSelectBoard={handleSelectBoard}
              onRefresh={() => fetchBoards('review', '', '')}
              searchKeyword={searchKeyword}
              onSearchInputChange={e => setSearchKeyword(e.target.value)}
              onSearch={() => fetchBoards('review', searchKeyword, '')}
              onSearchKeyPress={e => { if (e.key === 'Enter') fetchBoards('review', searchKeyword, ''); }}
              onResetSearch={() => { setSearchKeyword(''); fetchBoards('review', '', ''); }}
              currentBoardType="review"
              onChangeBoardType={() => {}} // 탭 전환 비활성화
              onNewBoardClick={handleNewBoardClick}
              hideHeader={true}
              hideTabs={true}
              //hideNewButton={true}
              hideDivider={true}
              hideNoticeButton={true}
            />
          )}
          {showForm && (
            <SharedBoardForm
              initialData={selectedBoard || null}
              onSave={handleSaveBoard}
              onCancel={handleCancelBoardForm}
              currentUserId={user?.user_uuid}
              //currentBoardType="review"
              hideNoticeOption={true}
            />
          )}
          {showDetail && selectedBoard && (
            <SharedBoardDetail
              selectedBoard={selectedBoard}
              handleCancel={handleBackToList}
              replies={replies}
              repliesLoading={repliesLoading}
              repliesError={repliesError}
              handleEditBoardClick={handleEditBoardClick}
              handleDeleteBoard={handleDeleteBoard}
              handleEditReply={handleEditReply}
              handleSaveEditedReply={handleSaveEditedReply}
              handleCancelEditReply={handleCancelEditReply}
              handleDeleteReply={handleDeleteReply}
              handleAddReply={handleAddReply}
              setNewReplyContent={setNewReplyContent}
              setEditingReplyContent={setEditingReplyContent}
              editingReplyId={editingReplyId}
              editingReplyContent={editingReplyContent}
              newReplyContent={newReplyContent}
              currentUser={user}
              onReplyInputFocus={handleReplyInputFocus}
            />
          )}
        </div>
      </main>
      <Footer />
      {showMessageBox && (
        <SharedMessageBox
          message={messageBoxMessage}
          onConfirm={handleConfirmMessageBox}
          onCancel={handleCancelMessageBox}
          type={messageBoxType}
        />
      )}
    </>
  );
};

export default ReviewListPage; 