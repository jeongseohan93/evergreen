import { useState, useEffect } from 'react';
import { EvergreenLogo, CartIcon, UserActionIcons, WishlistIcon, SearchBar } from '@/shared';
import { apiService } from '@/shared';
import { FaSearch } from 'react-icons/fa';
import Logo from '../../shared/components/layouts/Header/Logo';


function SubHeader() {
    // 검색창 표시 여부만 관리합니다. 애니메이션 상태는 더 이상 필요 없습니다.
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [wishlistItemCount, setWishlistItemCount] = useState(0);

    const fetchCartItemCount = async () => {
        try {
            console.log("API에서 장바구니 개수를 불러오는 중...");
            const response = await apiService.get('/cart/count');

            const data = response.data;

            if (data.success) {
                setCartItemCount(data.count); 
                console.log(`장바구니 개수: ${data.count}`);
            } else {
                console.error("장바구니 개수 불러오기 실패 (API 응답):", data.message);
                setCartItemCount(0);
            }
            
        } catch (error) {
            if (error.response) {
                console.error("장바구니 개수 불러오기 실패 (서버 응답 오류):", error.response.data);
                console.error("상태 코드:", error.response.status);
            } else if (error.request) {
                console.error("장바구니 개수 불러오기 실패 (네트워크 오류): 응답을 받지 못했습니다.", error.request);
            } else {
                console.error("장바구니 개수 불러오기 실패 (요청 설정 오류):", error.message);
            }
            setCartItemCount(0);
        }
    };

    const fetchWishlistItemCount = async () => {
        try {
            console.log("API에서 위시리스트 개수를 불러오는 중..."); // 로그 메시지 수정
            const response = await apiService.get('/users/wishlist-count');

            const data = response.data;

            if (data.success) {
                setWishlistItemCount(data.count); 
                console.log(`위시리스트 개수: ${data.count}`); // 로그 메시지 수정
            } else {
                console.error("위시리스트 개수 불러오기 실패 (API 응답):", data.message); // 로그 메시지 수정
                setWishlistItemCount(0);
            }
            
        } catch (error) {
            if (error.response) {
                console.error("위시리스트 개수 불러오기 실패 (서버 응답 오류):", error.response.data); // 로그 메시지 수정
                console.error("상태 코드:", error.response.status);
            } else if (error.request) {
                console.error("위시리스트 개수 불러오기 실패 (네트워크 오류): 응답을 받지 못했습니다.", error.request); // 로그 메시지 수정
            } else {
                console.error("위시리스트 개수 불러오기 실패 (요청 설정 오류):", error.message); // 로그 메시지 수정
            }
            setWishlistItemCount(0); // 오류 발생 시 0으로 설정
        }
    };

    useEffect(() => {
        fetchCartItemCount();
        fetchWishlistItemCount();
    }, []);

    // 검색창 토글 함수는 단순히 showSearchBar 상태를 반전시킵니다.
    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    return (
        <div className="grid grid-cols-3 h-40 border-b border-gray-200 pl-32 pr-36 bg-white">
            <div className="flex items-center">
                <EvergreenLogo />
            </div>

            {/* 두 번째 칸: 조건부 렌더링으로 로고 또는 검색바 표시 */}
            <div className="flex flex-col justify-center items-center relative w-full h-full overflow-hidden">
                {/* showSearchBar가 true이면 SearchBar를, false이면 Logo를 렌더링 */}
                {showSearchBar ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <SearchBar />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Logo />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end space-x-4">
                <FaSearch size="30px" onClick={toggleSearchBar} className="cursor-pointer" />
                <UserActionIcons />
                <WishlistIcon wishlistItemCount={wishlistItemCount} />
                <CartIcon cartItemCount={cartItemCount} />
            </div>
        </div>
    );
}

export default SubHeader;