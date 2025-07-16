// frontend/src/features/admin/pages/replyPage/ReplyManager.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext'; // AuthContext 경로 유지

// ReplyManager 컴포넌트는 댓글 목록 표시 및 댓글 추가/수정/삭제 기능을 담당합니다.
function ReplyManager({
  replies,
  repliesLoading,
  repliesError,
  onAddReply, // 새 댓글 추가 핸들러 (useReplyManagement에서 온 addReply)
  onSaveEditedReply, // 수정된 댓글 저장 핸들러 (useReplyManagement에서 온 modifyReply)
  onDeleteReply, // 댓글 삭제 핸들러 (useReplyManagement에서 온 removeReply)
  // currentUser는 이제 useAuth 훅을 통해 직접 가져오므로, 여기서는 프롭으로 받지 않습니다.
}) {
  // 새 댓글 작성을 위한 상태
  const [newReplyContent, setNewReplyContent] = useState('');
  // 수정 중인 댓글의 ID와 내용 상태
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');

  // useAuth 훅을 사용하여 현재 로그인된 사용자 정보 가져오기
  const { user: currentUser } = useAuth();

  // 댓글 수정 모드 진입 핸들러
  const handleEditReply = (reply) => {
    setEditingReplyId(reply.reply_id);
    setEditingReplyContent(reply.content);
  };

  // 댓글 수정 취소 핸들러
  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditingReplyContent('');
  };

  // 새 댓글 추가 버튼 클릭 핸들러
  const handleAddReplyClick = async () => {
    if (!newReplyContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    // currentUser에서 user_uuid를 가져와 사용합니다.
    const userIdToAddReply = currentUser?.user_uuid;

    // 이 조건은 이제 UI에서 버튼을 비활성화하여 미리 방지되지만,
    // 혹시 모를 경우를 대비하여 한 번 더 확인합니다.
    if (!userIdToAddReply) {
      alert('로그인한 사용자 정보를 찾을 수 없습니다. 댓글을 작성할 수 없습니다.'); 
      return;
    }

    // 부모 컴포넌트(BoardManager)의 onAddReply 호출
    const result = await onAddReply({ user_id: userIdToAddReply, content: newReplyContent });
    if (result.success) {
      setNewReplyContent(''); // 성공 시 입력 필드 초기화
    } else {
      alert(result.message);
    }
  };

  // 수정된 댓글 저장 버튼 클릭 핸들러
  const handleSaveEditedReplyClick = async (replyId) => {
    if (!editingReplyContent.trim()) {
      alert('수정할 댓글 내용을 입력해주세요.');
      return;
    }
    // 부모 컴포넌트(BoardManager)의 onSaveEditedReply 호출
    const result = await onSaveEditedReply(replyId, { content: editingReplyContent });
    if (result.success) {
      setEditingReplyId(null); // 수정 모드 종료
      setEditingReplyContent(''); // 수정 필드 초기화
    } else {
      alert(result.message);
    }
  };

  // 댓글 삭제 버튼 클릭 핸들러
  const handleDeleteReplyClick = async (replyId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      // 부모 컴포넌트(BoardManager)의 onDeleteReply 호출
      const result = await onDeleteReply(replyId);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  // 댓글 작성 UI를 렌더링할지 여부 및 활성화 여부
  const canAddReply = !!currentUser?.user_uuid; // currentUser.user_uuid가 존재하면 true

  return (
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
                      onClick={() => handleSaveEditedReplyClick(reply.reply_id)}
                      className="px-3 py-1.5 text-white bg-[#58bcb5] rounded-md hover:bg-[#4a9f99] transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEditReply}
                      className="px-3 py-1.5 text-white bg-gray-400 rounded-md hover:bg-gray-500 transition-colors"
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
                    {/* 현재 사용자가 댓글 작성자인 경우에만 수정/삭제 버튼 표시 */}
                    {currentUser?.user_uuid === reply.user_id && (
                      <>
                        <button
                          onClick={() => handleEditReply(reply)}
                          className="text-[#58bcb5] hover:text-[#4a9f99] text-xs"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteReplyClick(reply.reply_id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          삭제
                        </button>
                      </>
                    )}
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
        {!canAddReply && (
          <p className="text-red-500 mb-3">댓글을 작성하려면 로그인해야 합니다.</p>
        )}
        <textarea
          value={newReplyContent}
          onChange={(e) => setNewReplyContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
          rows="4"
          disabled={!canAddReply} // 로그인하지 않으면 비활성화
        ></textarea>
        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddReplyClick}
            className={`px-4 py-2 cursor-pointer text-white border-none rounded-md transition-colors ${canAddReply ? 'bg-[#58bcb5] hover:bg-[#4a9f99]' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!canAddReply} // 로그인하지 않으면 비활성화
          >
            댓글 추가
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReplyManager;
