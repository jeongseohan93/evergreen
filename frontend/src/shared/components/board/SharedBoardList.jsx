import React, { useState, useMemo } from 'react';
import SharedBoardPaging from './paging/SharedBoardPaging';

function BoardList({
  boards,
  loading,
  error,
  onDelete,
  onSelectBoard,
  onRefresh,
  searchKeyword,
  onSearchInputChange,
  onSearch,
  onSearchKeyPress,
  onResetSearch,
  currentBoardType,
  onChangeBoardType,
  onNewBoardClick,
  hideHeader = false,
  hideTabs = false,
  hideNewButton = false,
  hideDivider = false,
  hideBoardListTitle = false,
  hideSearchForm = false,
  hideManagementButtons = false,
  hideNoticeButton = false,
  hidePaging = false,
}) {
  // 페이징 관련 state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // 페이징처리 게시글 갯수

  // 게시판 타입이 변경되면 첫 페이지로 이동
  React.useEffect(() => {
    setCurrentPage(1);
  }, [currentBoardType]);

  // 공지사항 목록일 때만 notice가 'Y'인 게시글만 필터링
  const filteredBoards = useMemo(() => {
    return currentBoardType === 'notice'
      ? boards.filter(board => board.notice === 'Y')
      : boards;
  }, [boards, currentBoardType]);

  // 페이징 계산
  const totalItems = filteredBoards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 현재 페이지에 해당하는 게시글들만 표시 (페이징이 숨겨져 있으면 모든 게시글 표시)
  const displayBoards = useMemo(() => {
    if (hidePaging) {
      return filteredBoards; // 페이징이 숨겨져 있으면 모든 게시글 표시
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBoards.slice(startIndex, endIndex);
  }, [filteredBoards, currentPage, itemsPerPage, hidePaging]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 페이지당 항목 수 변경 핸들러
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 페이지당 항목 수가 변경되면 첫 페이지로 이동
  };

  // 게시판 타입 텍스트
  const getBoardTypeText = (type) => {
    if (type === 'notice') return '공지사항 관리';
    if (type === 'review') return '사용후기 게시글 관리';
    if (type === 'free') return '자유 게시글 관리';
    if (type === 'qna') return '질문 게시글 관리';
    return '전체 게시글 관리';
  };

  if (loading) return <div className="p-5 text-center text-gray-700">게시글 로딩 중...</div>;
  if (error) return <div className="p-5 text-center text-red-500">에러: {error}</div>;

  return (
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      {/* 상단 게시판 타입 텍스트 */}
      {!hideHeader && (
        <div className="flex justify-between items-center mb-5">
          <h1 className="m-0 text-black text-4xl font-aggro font-bold">
            {getBoardTypeText(currentBoardType)}
          </h1>
        </div>
      )}
      {/* 게시판 타입 선택 탭/버튼 */}
      {!hideTabs && (
        <div className="mb-5 flex space-x-2">
          <button
            onClick={() => onChangeBoardType?.(null)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm ${currentBoardType === null ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            전체보기
          </button>
          {!hideNoticeButton && (
            <button
                onClick={() => onChangeBoardType?.('notice')}
                className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm ${currentBoardType === 'notice' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                공지사항 
            </button>
          )}
          <button
            onClick={() => onChangeBoardType?.('review')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm ${currentBoardType === 'review' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            사용후기 게시판
          </button>
          <button
            onClick={() => onChangeBoardType?.('free')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm ${currentBoardType === 'free' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            자유 게시판
          </button>
          <button
            onClick={() => onChangeBoardType?.('qna')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium shadow-sm ${currentBoardType === 'qna' ? 'bg-[#306f65] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            질문 게시판
          </button>
        </div>
      )}
      {/* 기존 UI */}
      {!hideDivider && (
        <div className="w-full h-0.5 border-t bg-gray-400 mb-10" />
      )}
      {!hideBoardListTitle && (
        <div className="flex justify-between items-center mb-5">
          <h2 className="m-0 text-black text-3xl font-aggro font-bold">게시글 목록</h2>
          <div className="flex flex-row gap-2">
            {!hideNewButton && currentBoardType !== 'review' && (
              <button
                onClick={onNewBoardClick}
                className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
              >
                새 게시글 작성
              </button>
            )}
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-md cursor-pointer text-white border rounded bg-[#306f65] hover:bg-white hover:border-[#306f65] hover:text-[#306f65] transition-colors"
            >
              목록 새로고침
            </button>
          </div>
        </div>
      )}
      {!hideSearchForm && (
        <div className="mb-5 flex justify-center">
          <div className="flex items-center space-x-2 w-full max-w-7xl flex-nowrap min-w-0">
            <input
              type="text"
              placeholder="제목, 내용, 작성자 검색..."
              value={searchKeyword}
              onChange={onSearchInputChange}
              onKeyPress={onSearchKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#306f65] min-w-0"
            />
            <button
              onClick={onSearch}
              className="px-4 py-2 bg-[#58bcb5] text-white rounded-md duration-200 font-medium"
            >
              검색
            </button>
            <button
              onClick={onResetSearch}
              className="px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-200 font-medium"
            >
              초기화
            </button>
          </div>
        </div>
      )}
      {(!displayBoards || displayBoards.length === 0) ? (
        <div className="p-5 text-center text-gray-500">등록된 게시글이 없습니다.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-3 w-[15%] min-w-[100px] text-center whitespace-nowrap text-base">게시판</th>
                  <th className="p-3 w-2/5 min-w-[180px] text-center whitespace-nowrap text-base">제목</th>
                  <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성자</th>
                  <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성일</th>
                  {!hideManagementButtons && (
                    <th className="p-3 w-1/5 min-w-[160px] text-center whitespace-nowrap text-base">관리</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayBoards.map(board => (
                  <tr
                    key={board.board_id}
                    className={`border-b border-gray-200 text-center ${board.notice === 'Y' ? 'bg-yellow-50 border-2 border-blue-500' : ''}`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      {board.enum === 'review'
                        ? '사용후기'
                        : board.enum === 'free'
                          ? '자유'
                          : board.enum === 'qna'
                            ? 'QnA'
                            : '기타'}
                    </td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => onSelectBoard(board.board_id)}
                        className={`cursor-pointer text-[#306f65] underline hover:text-[#58bcb5] text-center w-full block ${board.notice === 'Y' ? 'text-lg font-bold' : 'text-sm'}`}
                      >
                        {board.notice === 'Y' && <span className="text-red-500 mr-1">(공지)</span>}
                        {board.title}
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap">{board.User ? board.User.name : '알 수 없음'}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(board.created_at).toLocaleDateString()}</td>
                    {!hideManagementButtons && (
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => onSelectBoard(board.board_id)}
                            className="px-3 py-1.5 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5] hover:bg-[#4a9f99]"
                          >
                            보기
                          </button>
                          <button
                            onClick={() => onDelete(board.board_id)}
                            className="px-3 py-1.5 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 페이징 컴포넌트 */}
          {!hidePaging && totalItems > 0 && (
            <SharedBoardPaging
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}

export default BoardList; 