// frontend/src/features/admin/pages/boardPage/BoardList.jsx
import React from 'react';

function BoardList({ boards, loading, error, onDelete, onSelectBoard, onRefresh }) {
  if (loading) return <div className="p-5 text-center text-gray-700">게시글 로딩 중...</div>;
  if (error) return <div className="p-5 text-center text-red-500">에러: {error}</div>;

  return (
    // ReportManage와 유사하게 p-5, max-w-7xl, mx-auto, font-light, text-sm, text-gray-800 적용
    <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
      <div className="flex justify-between items-center mb-5">
        <h2 className="m-0 text-black text-4xl font-aggro font-bold">게시글 목록</h2>
        {/* ReportManage의 '조행기 작성' 버튼과 유사한 스타일 */}
        <button
          onClick={onRefresh}
          className="px-4 py-2 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5] hover:bg-[#4a9f99]"
        >
          목록 새로고침
        </button>
      </div>

      {(!boards || boards.length === 0) ? (
        <div className="p-5 text-center text-gray-500">등록된 게시글이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto"> {/* 테이블이 넘칠 때 스크롤 가능하도록 */}
          <table className="w-full table-fixed"> {/* ReportManage와 동일 */}
            <thead>
              <tr className="border-b-2 border-gray-200"> {/* ReportManage와 동일 */}
                <th className="p-3 w-16 text-center whitespace-nowrap text-base">ID</th>
                <th className="p-3 w-[15%] min-w-[100px] text-center whitespace-nowrap text-base">게시판</th> {/* 🚩 타입 컬럼 추가 */}
                <th className="p-3 w-2/5 min-w-[180px] text-center whitespace-nowrap text-base">제목</th>
                <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성자</th>
                <th className="p-3 w-1/5 min-w-[120px] text-center whitespace-nowrap text-base">작성일</th>
                <th className="p-3 w-1/5 min-w-[160px] text-center whitespace-nowrap text-base">관리</th>
              </tr>
            </thead>
            <tbody>
              {boards.map(board => (
                <tr
                  key={board.board_id}
                  // 🚩 공지사항(notice === 'Y')일 때 배경색 및 굵은 파란색 테두리 추가
                  className={`border-b border-gray-200 text-center ${board.notice === 'Y' ? 'bg-yellow-50 border-2 border-blue-500' : ''}`}
                >
                  <td className="p-3 whitespace-nowrap">{board.board_id}</td>
                  <td className="p-3 whitespace-nowrap"> {/* 🚩 타입 값 렌더링 */}
                    {board.enum === 'review' ? '사용후기' : (board.enum === 'free' ? '자유' : '기타')}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <button
                      onClick={() => onSelectBoard(board.board_id)}
                      // ReportManage의 제목 링크와 유사한 스타일
                      // 🚩 공지사항일 때 글자 크기, 굵기 조정
                      className={`cursor-pointer text-[#306f65] underline hover:text-[#58bcb5] text-left w-full block ${board.notice === 'Y' ? 'text-lg font-bold' : 'text-sm'}`}
                    >
                      {/* 🚩 공지사항일 때 빨간색 (공지) 텍스트 추가 */}
                      {board.notice === 'Y' && <span className="text-red-500 mr-1">(공지)</span>}
                      {board.title}
                    </button>
                  </td>
                  <td className="p-3 whitespace-nowrap">{board.User ? board.User.name : '알 수 없음'}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(board.created_at).toLocaleDateString()}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2 justify-center"> {/* ReportManage의 버튼 그룹과 동일 */}
                      <button
                        onClick={() => onSelectBoard(board.board_id)}
                        // ReportManage의 '수정' 버튼과 유사한 스타일
                        className="px-3 py-1.5 cursor-pointer text-white border-none rounded transition-colors bg-[#58bcb5] hover:bg-[#4a9f99]"
                      >
                        보기
                      </button>
                      <button
                        onClick={() => onDelete(board.board_id)}
                        // ReportManage의 '삭제' 버튼과 유사한 스타일
                        className="px-3 py-1.5 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BoardList;
