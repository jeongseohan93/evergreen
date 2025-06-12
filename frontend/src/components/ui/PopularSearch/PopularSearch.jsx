import React from 'react';

const PopularSearch = () => {
    const popularSearches = ['건식사료', '덴탈껌', '소프트사료', '껌', '비스킷'];
    
    return (
        <div className="w-full mt-4 flex items-baseline flex-wrap"> 
        <span className="font-bold text-gray-800 mr-2 whitespace-nowrap">인기검색어</span>
        {popularSearches.map((tag, index) => (
            <button
                key={index}
                className="text-sm text-gray-600 hover:text-blue-600 mr-2 mb-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors whitespace-nowrap"
                onClick={() => alert(`#${tag} 검색`)} // 클릭 시 동작
            >
                #{tag}
            </button>
        ))}
    </div>
    );
};

export default PopularSearch;