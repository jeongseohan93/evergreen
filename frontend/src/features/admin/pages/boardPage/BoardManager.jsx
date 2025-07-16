import React, { useState, useEffect } from 'react'; // useCallback 제거
import useBoardManagement from '../../components/board/hooks/useBoardManagement';
import useReplyManagement from '../../components/reply/hooks/useReplyManagements'; 
import { useAuth } from '../../../authentication/hooks/useAuth'; 

import BoardList from './BoardList';
import BoardForm from './BoardForm'; // BoardForm의 경로를 현재 파일에서 상대 경로로 확인해줘.

// Custom message box component (alert, confirm 대신 사용)
const MessageBox = ({ message, onConfirm, onCancel, type = 'alert' }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              취소
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [messageBox, setMessageBox] = useState({
    show: false,
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    onConfirm: () => {},
    onCancel: () => {}
  });

  // 메시지 박스 표시 함수
  const showMessageBox = (message, type = 'alert', onConfirm = () => {}, onCancel = () => {}) => {
    setMessageBox({ show: true, message, type, onConfirm, onCancel });
  };

  // 메시지 박스 닫기 함수
  const hideMessageBox = () => {
    setMessageBox({ show: false, message: '', type: 'alert', onConfirm: () => {}, onCancel: () => {} });
  };


  useEffect(() => {
    fetchBoards(currentBoardType, ''); 
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
      <div className="flex justify-between items-center mb-5">
        <h1 className="m-0 text-black text-4xl font-aggro font-bold">
          {currentBoardType === 'review' ? '사용후기 게시판 관리' :
           currentBoardType === 'free' ? '자유 게시판 관리' : '전체 게시판 관리'}
        </h1>
        {currentBoardType !== null && (
          <button
            onClick={handleNewBoardClick}
            className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            새 게시글 작성
          </button>
        )}
      </div>

      {/* 게시판 타입 선택 탭/버튼 */}
      <div className="mb-5 flex space-x-2">
        <button
          onClick={() => handleChangeBoardType(null)}
          className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm hover:shadow-md ${currentBoardType === null ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          전체보기
        </button>
        <button
          onClick={() => handleChangeBoardType('review')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm hover:shadow-md ${currentBoardType === 'review' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          사용후기 게시판
        </button>
        <button
          onClick={() => handleChangeBoardType('free')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm hover:shadow-md ${currentBoardType === 'free' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          자유 게시판
        </button>
      </div>

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
          />
          {/* 검색 입력 필드 및 버튼 */}
          <div className="mt-5 flex justify-center">
            <div className="flex items-center space-x-2 w-full max-w-lg">
              <input
                type="text"
                placeholder="제목, 내용, 작성자 검색..."
                value={searchKeyword}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                검색
              </button>
            </div>
          </div>
        </>
      )}

      {/* 게시글 작성/수정 폼 컴포넌트 */}
      {showForm && (
        <>
          {/* ✨ BoardForm 렌더링 직전에 currentUserId 값 확인 */}
          {console.log("[BoardManager] BoardForm으로 전달되는 currentUserId:", currentUser?.user_uuid)}
          <BoardForm
            // selectedBoard가 null이면 새 게시글 작성 모드이므로 initialData를 null로 전달
            initialData={selectedBoard || null} 
            onSave={handleSaveBoard}
            onCancel={handleCancel}
            currentUserId={currentUser?.user_uuid}
            // currentBoardType 프롭 전달. 주석을 별도의 줄로 분리하여 SyntaxError 해결
            currentBoardType={currentBoardType} 
          />
        </>
      )}

      {/* 게시글 상세 보기 컴포넌트 (댓글 기능 추가) */}
      {showDetail && selectedBoard && (
        <div className="p-6 mt-5 border border-gray-200 rounded-lg shadow-md bg-white max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedBoard.title}</h2>
          <div className="mb-3 text-gray-700 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{selectedBoard.User ? selectedBoard.User.name : '알 수 없음'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(selectedBoard.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mb-4 text-gray-700">
            <p className="font-semibold mb-1">내용:</p>
            <div className="p-4 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">{selectedBoard.content?.text || '내용 없음'}</div>
          </div>

          {selectedBoard.reply && (
            <div className="mb-3 text-gray-700">
              <p className="font-semibold mb-1">답변:</p>
              <div className="p-4 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">{selectedBoard.reply}</div>
            </div>
          )}

          <div className="mb-3 text-gray-700 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h.01M12 11c1.666 0 3-1.5 3-3S13.666 5 12 5s-3 1.5-3 3 1.334 3 3 3zM19 8a7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7 7 7 0 017 7zm-2 9v2m-6 2v2m-2-2h10a2 2 0 012 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 012-2h10z" />
              </svg>
              <span>좋아요: {selectedBoard.like_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5m5-4h.01M9 10h.01M3 12l3 3m-3-3l6 6m-3-3h10a2 2 0 012-2v-6a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>싫어요: {selectedBoard.hate_count}</span>
            </div>
            <div>
              <span className="font-semibold">공지사항:</span> {selectedBoard.notice === 'Y' ? '예' : '아니오'}
            </div>
            <div>
              <span className="font-semibold">게시판:</span> {selectedBoard.enum === 'review' ? '사용후기' : '자유'}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleEditBoardClick}
              className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              수정
            </button>
            <button
              onClick={() => handleDeleteBoard(selectedBoard.board_id)}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              목록으로
            </button>
          </div>

          {/* 댓글 섹션 추가 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">댓글</h3>
            {repliesLoading ? (
              <div className="text-center text-gray-600">댓글 로딩 중...</div>
            ) : repliesError ? (
              <div className="text-center text-red-500">댓글 에러: {repliesError}</div>
            ) : replies.length === 0 ? (
              <div className="text-center text-gray-500">등록된 댓글이 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.reply_id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    {editingReplyId === reply.reply_id ? (
                      // 댓글 수정 폼
                      <div className="flex flex-col space-y-2">
                        <textarea
                          value={editingReplyContent}
                          onChange={(e) => setEditingReplyContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
                          rows="3"
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleSaveEditedReply(reply.reply_id)}
                            className="px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEditReply}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 일반 댓글 표시
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">
                            {reply.User ? reply.User.name : '알 수 없음'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handleEditReply(reply)}
                            className="px-3 py-1.5 text-[#58bcb5] hover:text-[#306f65] text-xs font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.reply_id)}
                            className="px-3 py-1.5 text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 댓글 작성 폼 */}
            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-white shadow-sm">
              <h4 className="font-semibold mb-2">댓글 작성</h4>
              <textarea
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
                rows="4"
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleAddReply}
                  className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  댓글 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 전역 메시지 박스 렌더링 */}
      {messageBox.show && (
        <MessageBox
          message={messageBox.message}
          type={messageBox.type}
          onConfirm={messageBox.onConfirm}
          onCancel={messageBox.onCancel}
        />
      )}
    </div>
  );
}

export default BoardManager;
