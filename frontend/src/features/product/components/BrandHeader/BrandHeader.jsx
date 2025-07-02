// src/shared/components/PageHeaderWithButtons/PageHeaderWithButtons.jsx
import React from 'react';

const BrandHeader = ({title}) => {
    return (
        <div className="w-full bg-white px-8 py-8 md:px-16 md:py-12 border-b border-gray-200">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* 상단 우측 Breadcrumbs Placeholder */}
                <div className="self-end mb-4">
                    <span className="text-sm text-gray-500">
                        홈 <span className="mx-1">›</span> 싹이싹거리 <span className="mx-1">›</span> 싹가리로드
                    </span>
                </div>

                {/* 페이지 제목 Placeholder */}
                <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-4">{title}</h1>

                {/* 🚨 두 개의 버튼 영역 */}
                <div className="flex space-x-4">
                    <button
                        className="px-6 py-3 rounded-md text-base font-medium transition-all duration-200
                                   border-2 border-dashed border-gray-700 bg-white text-gray-800"
                    >
                        싹가리로드 (19)
                    </button>
                    <button
                        className="px-6 py-3 rounded-md text-base font-medium transition-all duration-200
                                   border border-gray-300 bg-gray-50 text-gray-600"
                    >
                        싹이로드 (10)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandHeader;