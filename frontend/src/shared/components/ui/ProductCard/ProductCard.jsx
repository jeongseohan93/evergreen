import React from 'react';

const ProductCard = ({ imageUrl, name, price, hashtags, likes }) => { // likes prop 추가
    return (
        // 카드 전체 컨테이너
        <div className="max-w-xs bg-white rounded-lg overflow-hidden shadow-lg font-sans">
            {/* 상품 이미지 컨테이너 - 상대적 위치 지정을 위해 relative 추가 */}
            <div className="relative group"> {/* 'group' 클래스를 추가하여 하위 요소의 호버 상태를 제어합니다. */}
                {/* 상품 이미지 */}
                <img
                    className="w-full h-auto object-cover"
                    src={imageUrl}
                    alt={name}
                />

                {/* 호버 시 나타날 아이콘들 (오버레이 없음, 하단 오른쪽에 가로로 배치) */}
                <div className="absolute bottom-4 right-4 flex flex-row-reverse space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* 좋아요 (엄지) 아이콘 및 갯수 */}
                    {/* flex를 사용하여 아이콘과 텍스트를 한 줄에 정렬 */}
                    <div className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center space-x-1">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.432a2.5 2.5 0 00.584 1.637l1.378 1.488c.399.429.618.665 1.13.665h4.135c.783 0 1.5-.421 1.766-1.125l.898-3.05a1.5 1.5 0 00.287-.803V8.5c0-.966-.784-1.75-1.75-1.75h-5.5a1.5 1.5 0 01-1.5-1.5v-2.25C11.5 2.112 10.888 1.5 10.135 1.5H8.75c-.743 0-1.35.612-1.25 1.353l-.934 7.028z"></path></svg>
                        <span className="text-sm font-bold text-gray-700">{likes}</span>
                    </div>

                    {/* 하트 아이콘 */}
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>

                    {/* 장바구니 아이콘 */}
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </button>

                    {/* 돋보기 아이콘 */}
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>

            {/* 상품 정보 영역 */}
            <div className="p-4">
                {/* 상품명 */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {name}
                </h3>

                {/* 가격 */}
                <p className="text-xl font-extrabold text-gray-800 mb-3">
                    {price.toLocaleString()}원
                </p>

                {/* 해시태그 */}
                <div className="text-sm text-gray-500">
                    {hashtags.map((tag) => (
                        <span key={tag} className="mr-2">{`#${tag}`}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;