import React from 'react';
import { EvergreenLogo, SearchBar, CartIcon, UserActionIcons } from '@/shared'

function SubHeader() {
   return (
        <div className="grid grid-cols-3 h-40 border-b border-gray-200 pl-12 pr-14 bg-white">
            <div className="flex items-center">
                <EvergreenLogo />
            </div>

            {/* 두 번째 칸: 검색창 및 인기검색어 탭 */}
            <div className="flex flex-col justify-center items-center">
                {/* 검색 입력 필드와 돋보기 아이콘을 감싸는 div */}
                <SearchBar />
            </div>

            <div className="flex items-center justify-end space-x-4">
                {/* 마이페이지 아이콘 */}
                <UserActionIcons />
                <CartIcon />
            </div>
        </div>
    );
}

export default SubHeader;