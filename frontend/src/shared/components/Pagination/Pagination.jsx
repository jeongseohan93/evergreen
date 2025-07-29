// src/shared/components/Pagination/Pagination.jsx
import React from 'react';

const Pagination = ({
    currentPage,        // 현재 활성화된 페이지 (예: 1)
    totalPages,         // 전체 페이지 수 (예: 10)
    onPageChange        // 페이지 변경 시 호출될 함수 (인자로 새 페이지 번호를 받음)
}) => {
    const handleFirstPage = () => onPageChange(1);
    const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
    const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));
    const handleLastPage = () => onPageChange(totalPages);

    // ⭐️ 페이지 번호들을 동적으로 생성하는 로직
    const getPageNumbers = () => {
        const pageNumbers = [];
        // totalPages가 0이거나 1이면 페이지 번호를 만들 필요 없음
        if (totalPages <= 1) return [1]; // 최소 1페이지는 항상 표시

        // 일반적으로 현재 페이지 주변의 몇 개 페이지만 표시하지만,
        // 여기서는 간단하게 모든 페이지를 표시하도록 구현했습니다.
        // (복잡한 페이지 그룹핑 로직은 필요시 추가)
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

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

                {/* ⭐️ 동적으로 생성되는 페이지 번호들 */}
                {getPageNumbers().map((pageNumber) => (
                    <li key={pageNumber}>
                        <button
                            className={`px-4 py-2 border-l border-gray-300 focus:outline-none ${
                                currentPage === pageNumber
                                    ? 'text-white bg-gray-700 font-bold relative cursor-default' // 현재 페이지 스타일
                                    : 'text-gray-600 bg-white hover:bg-gray-50' // 다른 페이지 스타일
                            }`}
                            onClick={() => onPageChange(pageNumber)}
                            disabled={currentPage === pageNumber} // 현재 페이지는 클릭 불가
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                        >
                            {pageNumber}
                            {currentPage === pageNumber && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-700 rounded-full"></span>
                            )}
                        </button>
                    </li>
                ))}

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