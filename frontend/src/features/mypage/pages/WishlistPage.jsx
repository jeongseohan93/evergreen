import React, { useState, useEffect } from 'react';
import { Header, Footer, SubHeader } from '@/app';
import { addToCartApi } from '../../../features/cart/api/cartApi';
import { useNavigate } from 'react-router-dom';

// ⭐️ API 함수 임포트 (UI 개선에는 직접 사용되지 않지만, 컴포넌트 동작을 위해 유지)
import { getWishlistItemsApi, deleteWishlistItemApi } from '../api/wishListApi'; 

// 임시 장바구니 아이콘 (필요시 실제 아이콘 컴포넌트로 교체)
const AddToCartIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 12 5.5 12h9a1 1 0 00.95-.623l3-7A1 1 0 0017 3H6.293l-.867-3.468A1 1 0 004.33 0H3zM6 14a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4z"></path>
    </svg>
);


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

    // ⭐️ 장바구니 추가 핸들러 (상품 ID만 alert로 띄움)
    const handleAddToCart = async (productId) => {
        if (!productId) return;
                try {
                    const result = await addToCartApi(productId, 1);
        
                    console.log('API 응답:', result);
        
                    if (result.success) {
                        alert('장바구니에 상품을 담았습니다.');
                        navigate('/cart');
                    } else {
                        alert(`장바구니 추가 실패: ${result.message || '알 수 없는 오류'}`);
                    }
                } catch (err) {
                    console.error('API 호출 중 오류 발생:', err);
                    alert('장바구니 추가에 실패했습니다. 서버 또는 네트워크를 확인해주세요.');
                }
        
    };

    // --- 로딩 중일 때 표시 ---
    if (loading) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8"> {/* 헤더 높이만큼 공간 확보 */}
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">관심 상품 목록을 불러오는 중...</p>
                </div>
                <Footer />
            </>
        );
    }

    // --- 에러 발생 시 표시 ---
    if (error) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">오류가 발생했습니다!</h2>
                    <p className="text-lg text-gray-700 text-center">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* 고정된 헤더와 서브헤더 (현재 sticky 해제됨) */}
            <header>
                <Header />
                <SubHeader />
            </header>

            
            <main className="pb-16"> 
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">나의 관심 상품</h1>

                    {wishlistItems.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow-md text-center border-2 border-dashed border-gray-300">
                            <p className="text-3xl mb-4" role="img" aria-label="Empty Box">📦</p>
                            <p className="text-xl font-semibold text-gray-700 mb-4">아직 관심 상품이 없습니다.</p>
                            <p className="text-gray-500 mb-6">좋아하는 상품을 찜하고 더 쉽게 찾아보세요!</p>
                            <button
                                onClick={() => navigate('/')} // 상품 목록 페이지로 이동
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                            >
                                상품 둘러보기
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6"> 
                            {wishlistItems.map((item) => (
                                <div key={item.wishlist_id} className="flex flex-col sm:flex-row items-center p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                                    {/* 상품 이미지 */}
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0 border rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={item.small_photo || 'https://via.placeholder.com/160x160?text=No+Image'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* 상품 정보 (이름, 가격, 추가일) */}
                                    <div className="flex-grow text-center sm:text-left min-w-0">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate sm:whitespace-normal sm:line-clamp-2">
                                            {item.name}
                                        </h2>
                                        <p className="text-green-700 text-xl font-semibold mb-2">{item.price.toLocaleString()}원</p>
                                        <p className="text-gray-500 text-sm">추가일: {new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    {/* 액션 버튼 그룹 */}
                                    <div className="flex flex-col space-y-3 sm:space-y-2 sm:space-x-0 sm:ml-6 mt-6 sm:mt-0 w-full sm:w-auto min-w-[150px]">
                                        {/* 상품 보기 버튼 */}
                                        <button
                                            onClick={() => navigate(`/products/${item.product_id}`)}
                                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                                        >
                                            <span className="mr-2">상품 보기</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </button>
                                        {/* 장바구니 담기 버튼 */}
                                        <button
                                            onClick={() => handleAddToCart(item.product_id)} 
                                            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-purple-700 transition-colors w-full"
                                        >
                                            <AddToCartIcon />
                                            <span className="ml-2">장바구니 담기</span>
                                        </button>
                                        {/* 삭제 버튼 */}
                                        <button
                                            onClick={() => handleDeleteWishlistItem(item.wishlist_id)}
                                            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-red-600 transition-colors w-full"
                                        >
                                            <span className="mr-2">삭제</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default WishlistPage;