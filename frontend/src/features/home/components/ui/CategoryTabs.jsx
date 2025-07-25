import React from 'react';

const CategoryTabs = ({ activeCategory, onTabChange }) => {
    // 탭 목록 정의
    const categories = [
        { id: 'evergreen-recommend', name: '에버그린추천' },
        { id: 'reel-recommend', name: '릴추천' },
        { id: 'popular-products', name: '인기상품' },
        { id: 'hard-bait', name: '하드베이트' },
        { id: 'soft-bait', name: '소프트베이트' },
        { id: 'tackle-bag-small-items', name: '태클가방/소품' },
    ];

    return (
        <div className="flex justify-center bg-white shadow-sm mt-8">
            <div className="
                flex justify-between 
                max-w-[1330px] mx-auto px-12 
                overflow-x-auto hide-scroll-bar
                w-full 
            ">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onTabChange(category.id)}
                        className={`
                            flex-grow 
                            text-center 
                            px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4
                            text-base sm:text-lg font-semibold whitespace-nowrap
                            transition-all duration-200 ease-in-out
                            border
                            ${activeCategory === category.id
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50'
                            }
                        `}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;