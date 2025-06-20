// feature/userProfile/layouts/MypageLayout.jsx
import { useEffect } from "react";
import { Link, Outlet } from 'react-router-dom'; // Outlet 필요
import { Header, Footer, SubHeader} from '@/app';

const MyPageLayout = () => { // 이름 MyPageLayout으로 변경 권장
    useEffect(() => {
        console.log('[MyPageLayout] 렌더링됨');
      }, []);
    return (
    <>
    <Header />
    <SubHeader />
        <div>
            <h1>마이페이지</h1>
                <nav>
                    <ul className="flex gap-4">
                        <li><Link to="orders">주문내역</Link></li>
                        <li><Link to="account">회원정보</Link></li>
                        <li><Link to="wishlist">관심상품</Link></li>
                        <li><Link to="points">적립금</Link></li>
                        <li><Link to="posts">게시물</Link></li>
                        <li><Link to="address">배송지</Link></li> {/* appRoutes.js와 일치하도록 'address'로 변경 고려 */}
                    </ul>
            </nav>
        <hr />
        <Outlet /> {/* 실제 자식 페이지들이 렌더링될 위치 */}
    </div>
    <Footer />
    </>
  );
};

export default MyPageLayout;