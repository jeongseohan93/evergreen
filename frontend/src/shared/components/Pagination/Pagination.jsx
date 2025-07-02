// src/shared/components/Pagination/Pagination.jsx
import React from 'react';

const Pagination = ({
    currentPage,        // 현재 활성화된 페이지 (예: 1)
    totalPages,         // 전체 페이지 수 (예: 10)
    onPageChange        // 페이지 변경 시 호출될 함수 (인자로 새 페이지 번호를 받음)
}) => {
    // 페이지 번호들을 동적으로 생성할 수 있지만, 스크린샷에는 '1'만 있으므로
    // 기본적으로 '<<', '<', 현재 페이지, '>', '>>' 만 구현하겠습니다.
    // 만약 여러 페이지 번호를 표시해야 한다면, 여기에 페이지 배열 생성 로직이 추가됩니다.
    
    const handleFirstPage = () => onPageChange(1);
    const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
    const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));
    const handleLastPage = () => onPageChange(totalPages);

    return (
        <nav className="flex justify-center items-center my-8"> {/* 중앙 정렬 및 여백 */}
            <ul className="flex list-none p-0 m-0 border border-gray-300 rounded-md overflow-hidden">
                {/* 첫 페이지로 이동 (<<) */}
                <li>
                    <button
                        className="px-4 py-2 text-gray-600 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleFirstPage}
                        disabled={currentPage === 1}
                        aria-label="첫 페이지"
                    >
                        &laquo;
                    </button>
                </li>

                {/* 이전 페이지로 이동 (<) */}
                <li>
                    <button
                        className="px-4 py-2 text-gray-600 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        aria-label="이전 페이지"
                    >
                        &lsaquo;
                    </button>
                </li>

                {/* 현재 페이지 번호 */}
                <li>
                    <button
                        className="px-4 py-2 text-white bg-gray-700 font-bold border-l border-gray-300
                                   focus:outline-none cursor-default relative" // 현재 페이지는 클릭 비활성화, 밑줄을 위해 relative
                        aria-current="page"
                        disabled // 현재 페이지는 클릭 불가
                    >
                        {currentPage}
                        {/* 현재 페이지 밑줄 (스크린샷처럼) */}
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-700 rounded-full"></span>
                    </button>
                </li>

                {/* 다음 페이지로 이동 (>) */}
                <li>
                    <button
                        className="px-4 py-2 text-gray-600 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        aria-label="다음 페이지"
                    >
                        &rsaquo;
                    </button>
                </li>

                {/* 마지막 페이지로 이동 (>>) */}
                <li>
                    <button
                        className="px-4 py-2 text-gray-600 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
                        onClick={handleLastPage}
                        disabled={currentPage === totalPages}
                        aria-label="마지막 페이지"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;