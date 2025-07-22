import React from 'react';
import { useNavigate } from 'react-router-dom';

// API 함수 임포트 경로는 그대로 유지합니다.
import { addWishList } from '../../../../features/product/api/ProductApi';
import { addToCartApi } from '../../../../features/cart/api/cartApi';

import { toast } from 'react-toastify';


const ProductCard = ({ productId, imageUrl, name, price = 0, hashtags = [], likes = 0, productDetails = {} }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/products/${productId}`);
    };

    const handleActionClick = async (e, action) => {
        e.stopPropagation();

        let confirmMessage = '';
        let successMessage = '';
        let apiCall = null;
        let apiArgs = null;
        let redirectPath = '';

        if (action === '찜하기') {
            confirmMessage = '이 상품을 관심 상품에 추가하시겠습니까?';
            successMessage = '관심 상품에 추가되었습니다!';
            apiCall = addWishList;
            apiArgs = productId;
            redirectPath = '/mypage/wishlist';
        } else if (action === '장바구니') {
            confirmMessage = '이 상품을 장바구니에 추가하시겠습니까?';
            successMessage = '장바구니에 추가되었습니다!';
            apiCall = addToCartApi;
            apiArgs = [productId, 1];
            redirectPath = '/cart';
        } else {
            console.log(`${action} 클릭! 상품 ID: ${productId}`);
            return;
        }

        if (window.confirm(confirmMessage)) {
            try {
                // apiCall(addWishList)은 이미 response.data 객체를 반환합니다.
                const response = Array.isArray(apiArgs) ? await apiCall(...apiArgs) : await apiCall(apiArgs);

                // ================== ⭐️ 수정된 부분 시작 ⭐️ ==================
                // 디버깅 로그에서도 .data를 제거하여 확인합니다.
                console.log('--- API 응답 상세 확인 ---');
                console.log('응답 객체 (response):', response);
                console.log('response.success의 타입:', typeof response.success);
                console.log('response.success의 실제 값:', response.success);
                console.log('response.message의 실제 값:', response.message);
                console.log('---------------------------');

                // response.data.success -> response.success 로 변경
                if (response.success) {
                    toast.success(successMessage);
                    console.log('성공 조건 만족. 페이지 이동 시도:', redirectPath);
                    if (redirectPath) {
                        navigate(redirectPath);
                    }
                } else {
                    // response.data.message -> response.message 로 변경
                    console.log('실패 조건 만족. 에러 토스트 표시:', response.message);
                    toast.error(`추가 실패: ${response.message || '알 수 없는 오류'}`);
                }
                // ================== ⭐️ 수정된 부분 끝 ⭐️ ====================

            } catch (error) {
                console.error(`${action} 오류 (catch 블록 진입):`, error);
                console.error('에러 응답 데이터:', error.response?.data);
                toast.error(`${action} 중 오류가 발생했습니다. 다시 시도해주세요.`);
            }
        }
    };

    return (
        <div
            className="w-full max-w-xs bg-white rounded-lg overflow-hidden font-sans group cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    className="w-full h-80 object-cover"
                    src={imageUrl || '/images/default_product.png'}
                    alt={name}
                    onError={(e) => { e.target.onerror = null; e.target.src='/images/default_product.png' }}
                />

                <div className="absolute bottom-4 right-4 flex flex-row-reverse space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-white p-2 rounded-full shadow-md flex items-center space-x-1 cursor-default">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.432a2.5 2.5 0 00.584 1.637l1.378 1.488c.399.429.618.665 1.13.665h4.135c.783 0 1.5-.421 1.766-1.125l.898-3.05a1.5 1.5 0 00.287-.803V8.5c0-.966-.784-1.75-1.75-1.75h-5.5a1.5 1.5 0 01-1.5-1.5v-2.25C11.5 2.112 10.888 1.5 10.135 1.5H8.75c-.743 0-1.35.612-1.25 1.353l-.934 7.028z"></path></svg>
                        <span className="text-sm font-bold text-gray-700">{likes}</span>
                    </div>

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

            <div className='p-4'>
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