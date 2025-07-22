// src/features/mypage/pages/WishlistPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ⭐️ API 함수 임포트
import { getWishlistItemsApi, deleteWishlistItemApi } from '../api/wishListApi'; 

const WishlistPage = () => {
    const navigate = useNavigate();

    // 관심 상품 목록 상태
    const [wishlistItems, setWishlistItems] = useState([]);
    // 로딩 상태
    const [loading, setLoading] = useState(true);
    // 에러 상태
    const [error, setError] = useState(null);

    // ⭐️ 관심 상품 목록 불러오기 함수
    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getWishlistItemsApi();
            if (response.success && Array.isArray(response.items)) {
                setWishlistItems(response.items);
            } else {
                setError(response.message || '관심 상품 목록을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error("관심 상품 목록 조회 오류:", err);
            setError(err.response?.data?.message || '관심 상품 목록을 불러오는 중 서버 오류가 발생했습니다.');
            if (err.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/login'); // 로그인 페이지로 리다이렉트
            }
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 관심 상품 목록 불러오기
    useEffect(() => {
        fetchWishlist();
    }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨을 의미

    // ⭐️ 관심 상품 삭제 핸들러
    const handleDeleteWishlistItem = async (wishlistId) => {
        if (window.confirm('정말로 이 관심 상품을 삭제하시겠습니까?')) {
            try {
                const response = await deleteWishlistItemApi(wishlistId);
                if (response.success) {
                    alert(response.message || '관심 상품이 성공적으로 삭제되었습니다.');
                    fetchWishlist(); // 목록 새로고침
                } else {
                    alert('관심 상품 삭제에 실패했습니다: ' + (response.message || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error("관심 상품 삭제 오류:", err);
                alert('관심 상품 삭제 중 오류가 발생했습니다: ' + (err.response?.data?.message || ''));
            }
        }
    };

    // 로딩 중일 때 표시
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center text-lg text-gray-700">
                관심 상품 목록을 불러오는 중...
            </div>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center text-lg text-red-500">
                오류: {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">관심 상품</h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center text-gray-600 py-10 text-lg">
                    등록된 관심 상품이 없습니다.
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlistItems.map((item) => (
                        <div key={item.wishlist_id} className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm">
                            {/* 상품 이미지 */}
                            <div className="w-24 h-24 mr-4 flex-shrink-0">
                                <img
                                    src={item.small_photo || 'https://via.placeholder.com/100?text=No+Image'} // 실제 이미지 URL
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>

                            {/* 상품 정보 */}
                            <div className="flex-grow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h2>
                                <p className="text-gray-700 text-base">{item.price.toLocaleString()}원</p>
                                <p className="text-gray-500 text-sm mt-1">추가일: {new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex flex-col space-y-2 ml-4">
                                <button
                                    onClick={() => navigate(`/products/${item.product_id}`)} // 상품 상세 페이지로 이동
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    상품 보기
                                </button>
                                <button
                                    onClick={() => handleDeleteWishlistItem(item.wishlist_id)}
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;