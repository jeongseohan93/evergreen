import React, { useState } from 'react';

const ProductDetailTabs = () => {
    const [activeTab, setActiveTab] = useState('detail-info'); // 'detail-info'는 상세정보 섹션의 ID

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            // 헤더 높이를 고려하여 스크롤 위치 조정
            const headerOffset = 150; // 대략적인 헤더와 SubHeader의 높이 + 여백
            const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth', // 부드럽게 스크롤
            });
            setActiveTab(sectionId); // 활성 탭 업데이트
        }
    };

    return (
        <div className="w-full bg-white border-t border-b border-gray-200 mt-8 shadow-sm">
            <div className="max-w-screen-xl mx-auto flex justify-around text-base font-medium text-gray-700">
                <button
                    className={`flex-1 py-4 text-center transition-all duration-300 ease-in-out ${activeTab === 'detail-info' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'hover:text-blue-500 hover:border-b-2 hover:border-gray-300'}`}
                    onClick={() => scrollToSection('detail-info')}
                >
                    상세정보
                </button>
                <button
                    className={`flex-1 py-4 text-center transition-all duration-300 ease-in-out ${activeTab === 'purchase-guide' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'hover:text-blue-500 hover:border-b-2 hover:border-gray-300'}`}
                    onClick={() => scrollToSection('purchase-guide')}
                >
                    구매안내
                </button>
                <button
                    className={`flex-1 py-4 text-center transition-all duration-300 ease-in-out ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'hover:text-blue-500 hover:border-b-2 hover:border-gray-300'}`}
                    onClick={() => scrollToSection('reviews')}
                >
                    사용후기 (0)
                </button>
                <button
                    className={`flex-1 py-4 text-center transition-all duration-300 ease-in-out ${activeTab === 'qna' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'hover:text-blue-500 hover:border-b-2 hover:border-gray-300'}`}
                    onClick={() => scrollToSection('qna')}
                >
                    Q&A (0)
                </button>
            </div>
        </div>
    );
};

export default ProductDetailTabs;