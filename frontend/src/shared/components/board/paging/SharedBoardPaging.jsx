import React from 'react';

function SharedBoardPaging({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showPageInfo = true,
  showItemsPerPage = false,
  onItemsPerPageChange,
  className = '',
}) {
  // 페이지 번호 배열 생성 (최대 5개씩 표시)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // endPage가 totalPages에 가까우면 startPage를 조정
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const handleFirstClick = () => {
    handlePageClick(1);
  };

  const handleLastClick = () => {
    handlePageClick(totalPages);
  };

  // 총 페이지가 1개 이하면 페이징 UI를 숨김
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      {/* 페이징 네비게이션 */}
      <div className="flex items-center space-x-1">
        {/* 첫 페이지로 이동 */}
        <button
          onClick={handleFirstClick}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#306f65]'
          }`}
          title="첫 페이지"
        >
          {'<<'}
        </button>

        {/* 이전 페이지로 이동 */}
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#306f65]'
          }`}
          title="이전 페이지"
        >
          {'<'}
        </button>

        {/* 페이지 번호들 */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              page === currentPage
                ? 'bg-[#306f65] text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#306f65]'
            }`}
          >
            {page}
          </button>
        ))}

        {/* 다음 페이지로 이동 */}
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#306f65]'
          }`}
          title="다음 페이지"
        >
          {'>'}
        </button>

        {/* 마지막 페이지로 이동 */}
        <button
          onClick={handleLastClick}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#306f65]'
          }`}
          title="마지막 페이지"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}

export default SharedBoardPaging;
