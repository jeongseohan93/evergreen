import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. productId를 받고, props에 기본값을 설정하여 안정성 확보
const ProductCard = ({ productId, imageUrl, name, price = 0, hashtags = [], likes = 0 }) => {
    const navigate = useNavigate();

    // 2. 상품 ID를 기반으로 상세 페이지로 이동
    const handleCardClick = () => {
        // ProductDetailPage가 'imageUrl'을 쿼리 파라미터로 사용하므로,
        // 이 형식에 맞게 URL을 생성하여 이동시킵니다.
        navigate(`/products/${productId}`); 
    };
    // 3. 아이콘 클릭 이벤트 핸들러 분리 (이벤트 버블링 방지)
    const handleActionClick = (e, action) => {
        e.stopPropagation(); // 카드 전체 클릭(페이지 이동) 방지
        console.log(`${action} 클릭! 상품 ID: ${productId}`);
        // 여기에 실제 로직 추가 (예: 장바구니 추가 API 호출)
    };

    return (
        <div 
            className="w-full max-w-xs bg-white rounded-lg overflow-hidden font-sans group cursor-pointer" 
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    className="w-full h-auto object-cover aspect-square" // 이미지 비율 고정
                    src={imageUrl || '/images/default_product.png'} // 이미지가 없을 경우 기본 이미지
                    alt={name}
                    onError={(e) => { e.target.onerror = null; e.target.src='/images/default_product.png' }} // 이미지 로드 실패 시
                />

                <div className="absolute bottom-4 right-4 flex flex-row-reverse space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {/* 좋아요 (엄지) 아이콘 */}
                    <div className="bg-white p-2 rounded-full shadow-md flex items-center space-x-1 cursor-default">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.432a2.5 2.5 0 00.584 1.637l1.378 1.488c.399.429.618.665 1.13.665h4.135c.783 0 1.5-.421 1.766-1.125l.898-3.05a1.5 1.5 0 00.287-.803V8.5c0-.966-.784-1.75-1.75-1.75h-5.5a1.5 1.5 0 01-1.5-1.5v-2.25C11.5 2.112 10.888 1.5 10.135 1.5H8.75c-.743 0-1.35.612-1.25 1.353l-.934 7.028z"></path></svg>
                        <span className="text-sm font-bold text-gray-700">{likes}</span>
                    </div>

                    {/* 하트, 장바구니, 돋보기 아이콘 버튼 */}
                    <button onClick={(e) => handleActionClick(e, '찜하기')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                    <button onClick={(e) => handleActionClick(e, '장바구니')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </button>
                    <button onClick={(e) => handleActionClick(e, '미리보기')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>

            <div className='p-4'> {/* 내부 패딩 추가 */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{name}</h3>
                <p className="text-xl font-extrabold text-gray-800 mb-3">{price.toLocaleString()}원</p>
                <div className="text-sm text-gray-500 truncate">
                    {hashtags.map((tag) => (
                        <span key={tag} className="mr-2">{`#${tag}`}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;