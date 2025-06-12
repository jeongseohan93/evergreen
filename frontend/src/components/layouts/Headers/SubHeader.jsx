import { useEffect } from "react"; // `useState`는 더 이상 필요 없습니다.
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import PopularSearch from "../../ui/PopularSearch/PopularSearch";

// Redux 훅들을 임포트합니다. 경로에 주의하세요!
import { useAppSelector, useAppDispatch } from '../../../stores/hooks';
// 장바구니 상태를 업데이트할 액션 생성자를 임포트합니다.
import { setCartItemCount } from '../../../stores/slices/CartSlice';

function SearchBar() {
    // useAppSelector를 사용하여 Redux 스토어의 'cart' 슬라이스에서 'count' 값을 가져옵니다.
    // 'state.cart'는 store/index.js에서 'cart'라는 이름으로 cartReducer를 연결했기 때문입니다.
    const cartItemCount = useAppSelector((state) => state.cart.count);

    // 액션을 디스패치할 함수를 가져옵니다.
    const dispatch = useAppDispatch();

    // 컴포넌트가 처음 마운트될 때 (렌더링될 때) 장바구니 개수를 초기 설정합니다.
    // 실제 애플리케이션에서는 이 부분에서 서버 API를 호출하여
    // 현재 로그인한 사용자의 실제 장바구니 개수를 비동기적으로 가져와서 디스패치해야 합니다.
    useEffect(() => {
        // 임시로 하드코딩된 값 '3'으로 설정하는 예시입니다.
        // 이 액션은 Redux 스토어의 cart.count 값을 3으로 변경합니다.
        dispatch(setCartItemCount(3));
    }, [dispatch]); // dispatch 함수는 변경되지 않으므로 의존성 배열에 포함해도 안전합니다.

    return (
        <div className="grid grid-cols-3 h-40 border-b border-gray-200 pl-12 pr-14 bg-white">
            <div className="flex items-center">
                <p className="text-black text-4xl font-aggro font-bold ">에버그린</p>
            </div>

            {/* 두 번째 칸: 검색창 및 인기검색어 탭 */}
            <div className="flex flex-col justify-center items-center">
                {/* 검색 입력 필드와 돋보기 아이콘을 감싸는 div */}
                <div className="relative w-full flex items-center border-b border-gray-400 focus-within:border-blue-500">
                    <input
                        type="text"
                        className="w-full h-10 px-2 py-1 bg-transparent focus:outline-none"
                        placeholder="검색어를 입력하세요..."
                    />
                    <button className="absolute right-0 p-2 text-gray-500 hover:text-gray-700">
                        <FaSearch className="text-xl" />
                    </button>
                </div>

                <PopularSearch />

            </div>

            <div className="flex items-center justify-end space-x-4">
                {/* 마이페이지 아이콘 */}
                <a href="/mypage" className="text-black-600 hover:text-blue-500 transition-colors">
                    <FaUser className="text-3xl" />
                </a>

                {/* 카트 아이콘 */}
                <a href="/cart" className="relative text-black-600 hover:text-blue-500 transition-colors">
                    <FaShoppingCart className="text-3xl" />

                    {/* cartItemCount가 0보다 클 경우에만 배지 렌더링 */}
                    {cartItemCount > 0 && ( // 이제 cartItemCount는 Redux 상태입니다.
                        <span
                            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold
                                       rounded-full h-5 w-5 flex items-center justify-center
                                       transform translate-x-1/4 -translate-y-1/4"
                        >
                            {cartItemCount} {/* Redux 스토어에서 가져온 값 */}
                        </span>
                    )}
                </a>
            </div>
        </div>
    );
}

export default SearchBar;