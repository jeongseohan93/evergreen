import React from 'react';

function SharedBoardDetail({
  selectedBoard,
  replies,
  repliesLoading,
  repliesError,
  editingReplyId,
  editingReplyContent,
  newReplyContent,
  handleEditBoardClick,
  handleDeleteBoard,
  handleCancel,
  handleEditReply,
  handleSaveEditedReply,
  handleCancelEditReply,
  handleDeleteReply,
  handleAddReply,
  setNewReplyContent,
  setEditingReplyContent,
  currentUser,
  isAdmin = false,
  onReplyInputFocus,
}) {
  if (!selectedBoard) return null;

  return (
    <div className="p-6 mt-5 mb-5 border border-[#306f65] rounded-lg bg-white max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-[#306f65] font-aggro mb-0">{selectedBoard.title}</h2>
        <div className="flex flex-col items-end space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
            {selectedBoard.notice === 'Y' ? '공지사항' : '일반글'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#58bcb5] text-white">
            {selectedBoard.enum === 'review'
              ? '사용후기 게시글'
              : selectedBoard.enum === 'free'
                ? '자유 게시글'
                : selectedBoard.enum === 'qna'
                  ? '질문 게시글'
                  : '기타 게시글'}
          </span>
        </div>
      </div>
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
        <p className="font-bold text-[#306f65] text-base mb-1 mt-10">내용</p>
        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">{selectedBoard.content?.text || '내용 없음'}</div>
      </div>
      {selectedBoard.reply && (
        <div className="mb-3 text-gray-700">
          <p className="font-semibold mb-1">답변:</p>
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50 whitespace-pre-wrap">{selectedBoard.reply}</div>
        </div>
      )}
      <div className="flex justify-end space-x-3">
        {(isAdmin || (selectedBoard.User && currentUser && String(selectedBoard.User.user_uuid) === String(currentUser.user_uuid))) && (
          <>
            <button
              onClick={handleEditBoardClick}
              className="px-3 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
            >
              게시글 수정
            </button>
            <button
              onClick={() => handleDeleteBoard(selectedBoard.board_id)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              게시글 삭제
            </button>
          </>
        )}
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium"
        >
          목록으로
        </button>
      </div>
      {/* 댓글 섹션 */}
      <div className="mt-5 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-[#58bcb5] font-aggro mb-4">댓글</h3>
        {repliesLoading ? (
          <div className="text-center text-gray-600">댓글 로딩 중...</div>
        ) : repliesError ? (
          <div className="text-center text-red-500">댓글 에러: {repliesError}</div>
        ) : replies.length === 0 ? (
          <div className="text-center text-gray-500">등록된 댓글이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.reply_id} className="p-4 border border-gray-200 rounded-md bg-gray-100">
                {editingReplyId === reply.reply_id ? (
                  <div className="flex flex-col space-y-2">
                    <textarea
                      value={editingReplyContent}
                      onChange={(e) => setEditingReplyContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65] resize-none"
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
                  <>
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-700">
                        {reply.User ? reply.User.name : '알 수 없음'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
                    {reply.User && currentUser && reply.User.user_uuid === currentUser.user_uuid && (
                      <div className="flex items-center justify-start space-x-2 mt-5">
                        {(isAdmin || (reply.User && currentUser && String(reply.User.user_uuid) === String(currentUser.user_uuid))) && (
                          <>
                            <button
                              onClick={() => handleEditReply(reply)}
                              className="py-1.5 text-[#58bcb5] text-sm font-medium"
                            >
                              수정 
                            </button>
                            <span>|</span>
                            <button
                              onClick={() => handleDeleteReply(reply.reply_id)}
                              className="py-1.5 text-red-500 text-sm font-medium"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {/* 댓글 작성 폼 */}
        <div className="mt-6 p-4 border border-gray-200 rounded-md bg-white shadow-sm">
          <h4 className="font-bold text-[#306f65] text-base mb-2">댓글 작성</h4>
          <textarea
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder="댓글을 작성하려면 로그인하세요."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65] resize-none"
            rows="4"
            onFocus={onReplyInputFocus}
          ></textarea>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddReply}
              className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
            >
              댓글 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedBoardDetail;
