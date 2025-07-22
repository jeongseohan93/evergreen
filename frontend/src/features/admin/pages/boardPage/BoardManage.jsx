import React, { useState, useEffect } from 'react'; // useCallback 제거
import useBoardManagement from '../../components/board/hooks/useBoardManagement';
import useReplyManagement from '../../components/reply/hooks/useReplyManagements'; 
import useBoardMessageBox from '../../components/board/hooks/useBoardMessageBox';
import { useAuth } from '../../../authentication/hooks/useAuth'; 

import BoardList from '@/shared/components/board/SharedBoardList';
import BoardMessageBox from '@/shared/components/board/SharedMessageBox';
import SharedBoardForm from '@/shared/components/board/SharedBoardForm';
import SharedBoardDetail from '@/shared/components/board/SharedBoardDetail';

function BoardManager() {
  const {
    boards,
    selectedBoard,
    loading,
    error,
    fetchBoards,
    fetchBoardById,
    addBoard,
    modifyBoard,
    removeBoard,
    setSelectedBoard,
  } = useBoardManagement();

  const {
    replies,
    loading: repliesLoading,
    error: repliesError,
    fetchReplies,
    addReply,
    modifyReply,
    removeReply,
  } = useReplyManagement(selectedBoard?.board_id);

  const { user: currentUser } = useAuth(); // 현재 로그인된 사용자 정보 (user_uuid, name 등 포함)

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentBoardType, setCurrentBoardType] = useState(null); 
  const [searchKeyword, setSearchKeyword] = useState(''); 
  const [newReplyContent, setNewReplyContent] = useState(''); 
  const [editingReplyId, setEditingReplyId] = useState(null); 
  const [editingReplyContent, setEditingReplyContent] = useState(''); 

  // 메시지 박스 상태 관리
  const { messageBox, showMessageBox, hideMessageBox } = useBoardMessageBox();

  // 검색 입력 초기화 함수 (검색창을 빈칸으로 만들고 전체 게시글 보여주기)
  const handleResetSearch = () => {
    setSearchKeyword('');
    fetchBoards(currentBoardType, '');
  };


  useEffect(() => {
    if (currentBoardType === 'notice') {
      fetchBoards('', '', 'Y');
    } else {
      fetchBoards(currentBoardType, '', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBoardType, fetchBoards]); 

  useEffect(() => {
    if (selectedBoard?.board_id) {
      fetchReplies();
    }
  }, [selectedBoard?.board_id, fetchReplies]);


  const handleNewBoardClick = () => {
    setSelectedBoard(null); // 새 게시글 작성 시 selectedBoard를 null로 설정
    setShowForm(true);
    setShowDetail(false);
  };

  const handleSelectBoard = async (boardId) => {
    await fetchBoardById(boardId);
    setShowDetail(true);
    setShowForm(false);
  };

  const handleEditBoardClick = () => {
    setShowForm(true);
    setShowDetail(false);
  };

  const handleSaveBoard = async (formData) => {
    // 새 게시글 작성 시 user_id 유효성 검사 추가 (이미 BoardForm에서 처리되지만, 이중 확인)
    if (!selectedBoard && !currentUser?.user_uuid) {
      showMessageBox('로그인한 사용자 정보를 찾을 수 없습니다. 게시글을 작성할 수 없습니다.', 'alert', hideMessageBox);
      return;
    }

    let result;
    const dataToSend = { ...formData, enum: formData.enum || 'review' }; 

    // 게시글 저장 시 전송될 데이터 확인 (프론트엔드에서 최종적으로 보내는 데이터)
    console.log("[BoardManager] handleSaveBoard - 전송될 데이터:", dataToSend); 
    console.log("[BoardManager] handleSaveBoard - user_id:", dataToSend.user_id);

    if (selectedBoard) {
      result = await modifyBoard(selectedBoard.board_id, dataToSend);
    } else {
      result = await addBoard(dataToSend);
    }

    if (result.success) {
      showMessageBox(result.message, 'alert', () => {
        hideMessageBox();
        setShowForm(false);
        setSelectedBoard(null);
        fetchBoards(currentBoardType, searchKeyword); 
      });
    } else {
      showMessageBox(result.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDetail(false);
    setSelectedBoard(null);
    fetchBoards(currentBoardType, searchKeyword); 
  };

  const handleDeleteBoard = async (boardId) => {
    showMessageBox('정말로 이 게시글을 삭제하시겠습니까?', 'confirm', async () => {
      hideMessageBox();
      const result = await removeBoard(boardId);
      if (result.success) {
        showMessageBox(result.message, 'alert', () => {
          hideMessageBox();
          if (selectedBoard && selectedBoard.board_id === boardId) {
              setSelectedBoard(null);
              setShowForm(false);
              setShowDetail(false);
          }
          fetchBoards(currentBoardType, searchKeyword); 
        });
      } else {
        showMessageBox(result.message);
      }
    }, hideMessageBox);
  };

  const handleChangeBoardType = (type) => {
    setCurrentBoardType(type);
    setSearchKeyword(''); 
    setShowForm(false);
    setShowDetail(false);
    setSelectedBoard(null);
    if (type === 'notice') {
      fetchBoards('', '', 'Y'); // 공지사항만
    } else {
      fetchBoards(type, '', ''); // 기존 게시판
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    fetchBoards(currentBoardType, searchKeyword); 
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddReply = async () => {
    if (!newReplyContent.trim() || !selectedBoard?.board_id) {
      showMessageBox('댓글 내용을 입력해주세요.');
      return;
    }
    const userIdToAddReply = currentUser?.user_uuid;

    if (!userIdToAddReply) {
      showMessageBox('로그인한 사용자 정보를 찾을 수 없습니다. 댓글을 작성할 수 없습니다.');
      return;
    }

    const result = await addReply({ user_id: userIdToAddReply, content: newReplyContent });
    if (result.success) {
      setNewReplyContent('');
    } else {
      showMessageBox(result.message);
    }
  };

  const handleEditReply = (reply) => {
    setEditingReplyId(reply.reply_id);
    setEditingReplyContent(reply.content);
  };

  const handleSaveEditedReply = async (replyId) => {
    if (!editingReplyContent.trim()) {
      showMessageBox('수정할 댓글 내용을 입력해주세요.');
      return;
    }
    const result = await modifyReply(replyId, { content: editingReplyContent });
    if (result.success) {
      setEditingReplyId(null);
      setEditingReplyContent('');
    } else {
      showMessageBox(result.message);
    }
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  const handleDeleteReply = async (replyId) => {
    showMessageBox('정말로 이 댓글을 삭제하시겠습니까?', 'confirm', async () => {
      hideMessageBox();
      const result = await removeReply(replyId);
      if (!result.success) {
        showMessageBox(result.message);
      }
    }, hideMessageBox);
  };


  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      {/* 게시글 목록 컴포넌트 */}
      {!showForm && !showDetail && (
        <>
          <BoardList
            boards={boards}
            loading={loading}
            error={error}
            onDelete={handleDeleteBoard}
            onSelectBoard={handleSelectBoard}
            onRefresh={() => fetchBoards(currentBoardType, searchKeyword)}
            searchKeyword={searchKeyword}
            onSearchInputChange={handleSearchInputChange}
            onSearch={handleSearch}
            onSearchKeyPress={handleKeyPress}
            onResetSearch={handleResetSearch}
            currentBoardType={currentBoardType}
            onChangeBoardType={handleChangeBoardType}
            onNewBoardClick={handleNewBoardClick}
          />
        </>
      )}

      {/* 게시글 작성/수정 폼 컴포넌트 */}
      {showForm && (
        <>
          {/* ✨ BoardForm 렌더링 직전에 currentUserId 값 확인 */}
          {console.log("[BoardManager] BoardForm으로 전달되는 currentUserId:", currentUser?.user_uuid)}
          <SharedBoardForm
            initialData={selectedBoard || null}
            onSave={handleSaveBoard}
            onCancel={handleCancel}
            currentUserId={currentUser?.user_uuid}
            currentBoardType={currentBoardType}
          />
        </>
      )}

      {/* 게시글 상세 보기 컴포넌트 (댓글 기능 추가) */}
      {showDetail && selectedBoard && (
        <SharedBoardDetail
          selectedBoard={selectedBoard}
          replies={replies}
          repliesLoading={repliesLoading}
          repliesError={repliesError}
          editingReplyId={editingReplyId}
          editingReplyContent={editingReplyContent}
          newReplyContent={newReplyContent}
          handleEditBoardClick={handleEditBoardClick}
          handleDeleteBoard={handleDeleteBoard}
          handleCancel={handleCancel}
          handleEditReply={handleEditReply}
          handleSaveEditedReply={handleSaveEditedReply}
          handleCancelEditReply={handleCancelEditReply}
          handleDeleteReply={handleDeleteReply}
          handleAddReply={handleAddReply}
          setNewReplyContent={setNewReplyContent}
          setEditingReplyContent={setEditingReplyContent}
          currentUser={currentUser}
          isAdmin={true}
        />
      )}

      {/* 전역 메시지 박스 렌더링 */}
      <BoardMessageBox
        show={messageBox.show}
        message={messageBox.message}
        type={messageBox.type}
        onConfirm={messageBox.onConfirm}
        onCancel={messageBox.onCancel}
      />
    </div>
  );
}

export default BoardManager;
