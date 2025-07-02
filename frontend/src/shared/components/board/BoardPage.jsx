// src/pages/BoardPage.jsx (예시)
import React, { useState, useEffect } from 'react';
import TableComponent from '@/shared/components/board/Table/TableComponent'; // @/shared alias 사용
import SearchFilterBar from '@/shared/components/board/SearchFilterBar/SearchFilterBar'; // @/shared alias 사용

const BoardPage = () => {
    // 테이블 헤더 데이터 (스크린샷 기반)
    const tableHeaders = [
        { key: 'id', label: '번호' },
        { key: 'title', label: '제목' },
        { key: 'writer', label: '작성자' },
        { key: 'date', label: '작성일' },
        { key: 'views', label: '조회' },
    ];

    // 테이블 데이터 (스크린샷 기반의 임시 데이터)
    const [tableData, setTableData] = useState([
        { id: '공지', title: '에버그린CUP 위킹낚시페스티벌', writer: '에버그린피싱', date: '2024-04-07 18:09:19', views: 104, isNotice: true, isHit: true },
        // ... 실제로는 API에서 데이터를 받아와야 합니다.
    ]);

    // 검색 필터 옵션
    const filterOptions = [
        { value: 'week', label: '일주일' },
        { value: 'month', label: '한 달' },
        { value: 'year', label: '일 년' },
        { value: 'all', label: '전체' },
    ];

    // 검색 유형 옵션
    const searchOptions = [
        { value: 'title', label: '제목' },
        { value: 'writer', label: '작성자' },
        { value: 'content', label: '내용' },
    ];

    // 검색 실행 핸들러
    const handleSearch = ({ filter, searchType, query }) => {
        console.log("검색 실행:", { filter, searchType, query });
        // 🚨 여기에 실제 검색 로직 (API 호출 또는 로컬 필터링)을 구현합니다.
        // setTableData(...)를 사용하여 검색 결과로 업데이트합니다.
        if (!query) {
             setTableData([]); // 검색어가 없으면 '검색 결과가 없습니다.' 표시
        } else {
             // 임시로 검색 결과 없음을 시뮬레이션
             setTableData([]);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl"> {/* 페이지 중앙 정렬을 위한 컨테이너 */}
            <TableComponent headers={tableHeaders} data={tableData} className="mb-4" /> {/* mb-4로 하단 검색바와 간격 */}
            <SearchFilterBar
                filterOptions={filterOptions}
                searchOptions={searchOptions}
                onSearch={handleSearch}
            />
        </div>
    );
};

export default BoardPage;