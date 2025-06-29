import React from 'react';
import { Link } from 'react-router-dom';


const PageHeader = ({ title }) => {
  return (
    // 상하 패딩을 줄이고, border-b로 아래쪽 테두리 추가
    // py-6 정도로 줄여서 더 상단에 붙게 함
    <div className='flex justify-between items-end py-6 border-b border-gray-300 mb-8 max-w-[1200px] h-28 mx-auto'>
        {/* 제목 */}
        <h1 className='text-3xl font-bold flex flex-row items-center gap-2'>{title}</h1>

        {/* Home > 이용약관 부분 - 텍스트 크기 줄이고, items-end로 하단 정렬 */}
        {/* 전체 div가 items-end로 정렬되므로, 여기는 따로 설정할 필요 없음 */}
        <div className='flex items-center gap-2 text-sm'> {/* text-sm 추가 */}
            <Link to='/' className='text-gray-500'>Home {'>'} </Link>
            <span>{title}</span>
        </div>
    </div>
  );
};

export default PageHeader;