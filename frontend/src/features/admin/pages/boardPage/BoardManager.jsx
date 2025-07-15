// frontend/src/features/admin/pages/boardPage/BoardManager.jsx
import React, { useState, useEffect } from 'react';
import useBoardManagement from '../../components/board/hooks/useBoardManagement';
import BoardList from './BoardList';
import BoardForm from './BoardForm';

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

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentBoardType, setCurrentBoardType] = useState(null); // null: 전체보기, 'review', 'free'

  useEffect(() => {
    fetchBoards(currentBoardType);
  }, [currentBoardType, fetchBoards]);

  const handleNewBoardClick = () => {
    setSelectedBoard(null);
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
    let result;
    const dataToSend = { ...formData, enum: formData.enum || 'review' }; // formData.enum이 없는 경우를 대비한 안전장치

    if (selectedBoard) {
      result = await modifyBoard(selectedBoard.board_id, dataToSend);
    } else {
      result = await addBoard(dataToSend);
    }

    if (result.success) {
      alert(result.message);
      setShowForm(false);
      setSelectedBoard(null);
      fetchBoards(currentBoardType);
    } else {
      alert(result.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDetail(false);
    setSelectedBoard(null);
    fetchBoards(currentBoardType);
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      const result = await removeBoard(boardId);
      if (result.success) {
        alert(result.message);
        if (selectedBoard && selectedBoard.board_id === boardId) {
            setSelectedBoard(null);
            setShowForm(false);
            setShowDetail(false);
        }
        fetchBoards(currentBoardType);
      } else {
        alert(result.message);
      }
    }
  };

  const handleChangeBoardType = (type) => {
    setCurrentBoardType(type);
    setShowForm(false);
    setShowDetail(false);
    setSelectedBoard(null);
  };

  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="flex justify-between items-center mb-5">
        <h1 className="m-0 text-black text-4xl font-aggro font-bold">
          {currentBoardType === 'review' ? '사용후기 게시판 관리' :
           currentBoardType === 'free' ? '자유 게시판 관리' : '전체 게시판 관리'}
        </h1>
        {/* 🚩 수정: currentBoardType이 null이 아닐 때 (특정 게시판 선택 시)에만 버튼 렌더링 */}
        {currentBoardType !== null && (
          <button
            onClick={handleNewBoardClick}
            className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5] hover:bg-[#4a9f99]"
          >
            새 게시글 작성
          </button>
        )}
      </div>

      {/* 게시판 타입 선택 탭/버튼 */}
      <div className="mb-5 flex space-x-2">
        <button
          onClick={() => handleChangeBoardType(null)}
          className={`px-4 py-2 rounded-md ${currentBoardType === null ? 'bg-[#58bcb5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4a9f99] hover:text-white transition-colors`}
        >
          전체보기
        </button>
        <button
          onClick={() => handleChangeBoardType('review')}
          className={`px-4 py-2 rounded-md ${currentBoardType === 'review' ? 'bg-[#58bcb5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4a9f99] hover:text-white transition-colors`}
        >
          사용후기 게시판
        </button>
        <button
          onClick={() => handleChangeBoardType('free')}
          className={`px-4 py-2 rounded-md ${currentBoardType === 'free' ? 'bg-[#58bcb5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4a9f99] hover:text-white transition-colors`}
        >
          자유 게시판
        </button>
      </div>

      {/* 게시글 목록 컴포넌트 */}
      {!showForm && !showDetail && (
        <BoardList
          boards={boards}
          loading={loading}
          error={error}
          onDelete={handleDeleteBoard}
          onSelectBoard={handleSelectBoard}
          onRefresh={() => fetchBoards(currentBoardType)}
        />
      )}

      {/* 게시글 작성/수정 폼 컴포넌트 */}
      {showForm && (
        <BoardForm
          initialData={selectedBoard ?
            { ...selectedBoard, enum: selectedBoard.enum || 'review' } :
            { enum: currentBoardType || 'review' }
          }
          onSave={handleSaveBoard}
          onCancel={handleCancel}
        />
      )}

      {/* 게시글 상세 보기 컴포넌트 */}
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
              <span className="font-semibold">타입:</span> {selectedBoard.enum === 'review' ? '사용후기' : '자유'}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleEditBoardClick}
              className="px-4 py-2 cursor-pointer text-white border-none rounded-md transition-colors bg-[#58bcb5] hover:bg-[#4a9f99] font-medium text-sm"
            >
              수정
            </button>
            <button
              onClick={() => handleDeleteBoard(selectedBoard.board_id)}
              className="px-4 py-2 cursor-pointer bg-red-500 text-white border-none rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 cursor-pointer text-white border-none rounded-md transition-colors bg-gray-400 hover:bg-gray-500 font-medium text-sm"
            >
              목록으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardManager;