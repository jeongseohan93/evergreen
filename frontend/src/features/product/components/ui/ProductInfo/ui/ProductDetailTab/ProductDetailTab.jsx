// src/features/product/components/ProductDetailTabs.jsx
import React, { useState } from 'react';

const ProductDetailTabs = () => {
    // 현재 활성화된 탭을 관리하는 상태 (선택적)
    const [activeTab, setActiveTab] = useState('detail-info'); // 'detail-info'는 상세정보 섹션의 ID

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth', // 부드럽게 스크롤
                block: 'start',      // 요소의 시작 부분이 뷰포트 상단에 오도록 정렬
            });
            setActiveTab(sectionId); // 활성 탭 업데이트
        }
    };

    return (
        <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20"> {/* 스티키 헤더로 고정될 수 있음 */}
            <div className="flex justify-around text-lg font-bold text-gray-700 py-4">
                <button
                    className={`px-4 py-2 ${activeTab === 'detail-info' ? 'text-black border-b-2 border-black' : 'hover:text-gray-900'}`}
                    onClick={() => scrollToSection('detail-info')}
                >
                    상세정보
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'purchase-guide' ? 'text-black border-b-2 border-black' : 'hover:text-gray-900'}`}
                    onClick={() => scrollToSection('purchase-guide')}
                >
                    구매안내
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'reviews' ? 'text-black border-b-2 border-black' : 'hover:text-gray-900'}`}
                    onClick={() => scrollToSection('reviews')}
                >
                    사용후기 (0)
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'qna' ? 'text-black border-b-2 border-black' : 'hover:text-gray-900'}`}
                    onClick={() => scrollToSection('qna')}
                >
                    Q&A (0)
                </button>
            </div>
        </div>
    );
};

export default ProductDetailTabs;