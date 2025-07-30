// src/shared/components/PageHeaderWithButtons/PageHeaderWithButtons.jsx (BrandHeader.jsx)
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrandHeader = ({
    title, 
    currentCategoryName,   
    currentSubCategoryName, 
    currentSub2CategoryName, 
    totalResultsForCurrentSearch, 
    subCategoryButtons = [], 
    onSubCategoryButtonClick 
}) => {
    const navigate = useNavigate();

    // Breadcrumbs 생성 로직 (기존과 동일)
    const generateBreadcrumbs = () => {
        const breadcrumbs = [
            { name: '홈', path: '/' },
            { name: '카테고리', path: '/categorysearch' } 
        ];

        if (currentCategoryName) {
            breadcrumbs.push({
                name: currentCategoryName,
                path: `/categorysearch?name=${encodeURIComponent(currentCategoryName)}`
            });
            if (currentSubCategoryName) {
                breadcrumbs.push({
                    name: currentSubCategoryName,
                    path: `/categorysearch?name=${encodeURIComponent(currentCategoryName)}&sub=${encodeURIComponent(currentSubCategoryName)}`
                });
                if (currentSub2CategoryName) {
                    breadcrumbs.push({
                        name: currentSub2CategoryName,
                        path: `/categorysearch?name=${encodeURIComponent(currentCategoryName)}&sub=${encodeURIComponent(currentSubCategoryName)}&sub2=${encodeURIComponent(currentSub2CategoryName)}`
                    });
                }
            }
        }
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // ⭐️ '전체보기' 버튼 렌더링 여부를 결정하는 함수
    const shouldShowOverallButton = currentSubCategoryName || currentSub2CategoryName;

    // ⭐️ 하위 카테고리 버튼 렌더링 여부를 결정하는 함수
    const shouldShowSubCategoryButtons = subCategoryButtons.length > 0;

    return (
        <div className="w-full bg-white px-8 py-8 md:px-16 md:py-12 border-b border-gray-200">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* 상단 Breadcrumbs */}
                <div className="self-end mb-4">
                    <span className="text-sm text-gray-500">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <span 
                                    className={`cursor-pointer hover:underline ${index === breadcrumbs.length - 1 ? 'font-semibold text-gray-700' : ''}`}
                                    onClick={() => navigate(crumb.path)}
                                >
                                    {crumb.name}
                                </span>
                                {index < breadcrumbs.length - 1 && <span className="mx-1">›</span>}
                            </React.Fragment>
                        ))}
                    </span>
                </div>

                {/* 페이지 제목 */}
                <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-4">
                    {title} ({totalResultsForCurrentSearch}) 
                </h1>

                {/* ⭐️ 버튼 영역 - '전체보기' 버튼과 '하위 카테고리' 버튼들을 조건부 렌더링 */}
                <div className="flex flex-wrap justify-center gap-4"> 

                    {/* '전체보기' 버튼 */}
                    {shouldShowOverallButton && ( 
                        <button
                            onClick={() => {
                                // 1단계 카테고리로 돌아감 (sub, sub2 파라미터 제거)
                                onSubCategoryButtonClick(currentCategoryName, null); 
                            }}
                            className={`px-6 py-3 rounded-md text-base font-medium transition-all duration-200
                                        border-2 border-dashed border-gray-700 bg-white text-gray-800`}
                        >
                            {currentCategoryName} 전체 보기
                        </button>
                    )}

                    {/* 하위 카테고리 버튼들 */}
                    {shouldShowSubCategoryButtons && (
                        subCategoryButtons.map((button, index) => (
                            <button
                                key={index}
                                onClick={() => onSubCategoryButtonClick(button.name, button.isGroup)} 
                                className={`px-6 py-3 rounded-md text-base font-medium transition-all duration-200
                                            ${(button.name === currentSubCategoryName && !currentSub2CategoryName) || (button.name === currentSub2CategoryName) ? 
                                                'border-2 border-dashed border-gray-700 bg-white text-gray-800' : 
                                                'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100' 
                                            }`}
                            >
                                {button.name} 
                            </button>
                        ))
                    )}
                    
                    {/* 메시지: 하위 카테고리 버튼도 없고, 전체보기 버튼도 필요 없는 경우 */}
                    {!shouldShowOverallButton && !shouldShowSubCategoryButtons && (
                         <span className="text-gray-500">하위 카테고리가 없습니다.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandHeader;