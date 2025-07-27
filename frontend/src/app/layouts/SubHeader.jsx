import { useState, useEffect } from 'react';
import { EvergreenLogo, CartIcon, UserActionIcons, WishlistIcon, SearchBar } from '@/shared'
import { apiService }from '@/shared';
import { FaSearch } from 'react-icons/fa';
import Logo from '../../shared/components/layouts/Header/Logo';


function SubHeader() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
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
            // axios 에러 처리: error.response, error.request, error.message 등으로 상세 정보 확인
            if (error.response) {
                // 서버가 응답했지만 상태 코드가 2xx 범위 밖인 경우
                console.error("장바구니 개수 불러오기 실패 (서버 응답 오류):", error.response.data);
                console.error("상태 코드:", error.response.status);
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 오류 등)
                console.error("장바구니 개수 불러오기 실패 (네트워크 오류): 응답을 받지 못했습니다.", error.request);
            } else {
                // 요청 설정 중 오류가 발생한 경우
                console.error("장바구니 개수 불러오기 실패 (요청 설정 오류):", error.message);
            }
            setCartItemCount(0); // 오류 발생 시 0으로 설정
        }
    };

    const fetchWishlistItemCount = async () => {
        try {
            console.log("API에서 장바구니 개수를 불러오는 중...");
            const response = await apiService.get('/users/wishlist-count');

            const data = response.data;

            if (data.success) {
                setWishlistItemCount(data.count); 
                console.log(`장바구니 개수: ${data.count}`);
            } else {
                console.error("장바구니 개수 불러오기 실패 (API 응답):", data.message);
                setWishlistItemCount(0);
            }
            

        } catch (error) {
            // axios 에러 처리: error.response, error.request, error.message 등으로 상세 정보 확인
            if (error.response) {
                // 서버가 응답했지만 상태 코드가 2xx 범위 밖인 경우
                console.error("장바구니 개수 불러오기 실패 (서버 응답 오류):", error.response.data);
                console.error("상태 코드:", error.response.status);
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 오류 등)
                console.error("장바구니 개수 불러오기 실패 (네트워크 오류): 응답을 받지 못했습니다.", error.request);
            } else {
                // 요청 설정 중 오류가 발생한 경우
                console.error("장바구니 개수 불러오기 실패 (요청 설정 오류):", error.message);
            }
            setCartItemCount(0); // 오류 발생 시 0으로 설정
        }
    };

    useEffect(() => {
        fetchCartItemCount();
        fetchWishlistItemCount();
        // 의존성 배열이 비어있으므로 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
    }, []);

    const toggleSearchBar = () => {
        if (!showSearchBar) {
            // 검색창을 보여줄 때는 바로 애니메이션 시작
            setIsAnimating(true);
            setShowSearchBar(true);
        } else {
            // 검색창을 숨길 때는 애니메이션을 먼저 실행하고, 끝난 뒤 숨김 처리
            setIsAnimating(true);
            setShowSearchBar(false);
        }
    };

    const handleTransitionEnd = (e, isSearchBar) => {
        // transform 속성의 전환이 끝났을 때만 처리
        if (e.propertyName === 'transform') {
            if (isSearchBar && !showSearchBar) {
                // SearchBar가 숨김 상태로 전환이 완료되면
                setIsAnimating(false); // 애니메이션 상태 종료 (이때 `hidden` 적용)
            } else if (!isSearchBar && showSearchBar) {
                // Logo가 숨김 상태로 전환이 완료되면
                setIsAnimating(false); // 애니메이션 상태 종료 (이때 `hidden` 적용)
            }
        }
    };


    return (
        <div className="grid grid-cols-3 h-40 border-b border-gray-200 pl-32 pr-36 bg-white">
            <div className="flex items-center">
                <EvergreenLogo />
            </div>

            {/* 두 번째 칸: 조건부 렌더링 및 애니메이션 적용 */}
            <div className="flex flex-col justify-center items-center relative w-full h-full overflow-hidden">
                {/* Logo 컴포넌트 */}
                {/* 로고는 왼쪽에서 오른쪽으로 밀려나고, 오른쪽에서 왼쪽으로 돌아옵니다. */}
                <div
                    className={`
                        absolute inset-0 flex items-center justify-center 
                        transition-transform duration-300 ease-out 
                        ${showSearchBar ? '-translate-x-full' : 'translate-x-0'} 
                        ${isAnimating || !showSearchBar ? '' : 'hidden'}
                        ${!showSearchBar ? 'pointer-events-auto' : 'pointer-events-none'}
                    `}
                    onTransitionEnd={(e) => handleTransitionEnd(e, false)} // isSearchBar = false (Logo)
                >
                    <Logo />
                </div>

                {/* SearchBar 컴포넌트 */}
                {/* 서치바는 오른쪽에서 왼쪽으로 밀려 들어오고, 왼쪽으로 밀려 나갑니다. */}
                <div
                    className={`
                        absolute inset-0 flex items-center justify-center 
                        transition-transform duration-300 ease-out 
                        ${showSearchBar ? 'translate-x-0' : 'translate-x-full'} 
                        ${isAnimating || showSearchBar ? '' : 'hidden'}
                        ${showSearchBar ? 'pointer-events-auto' : 'pointer-events-none'}
                    `}
                    onTransitionEnd={(e) => handleTransitionEnd(e, true)} // isSearchBar = true (SearchBar)
                >
                    <SearchBar />
                </div>
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