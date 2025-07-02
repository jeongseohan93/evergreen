import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link

// 아이콘 SVG 또는 라이브러리 사용
// 여기서는 간단한 SVG 아이콘을 직접 포함하겠습니다.
const OrderIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const ProfileIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const WishlistIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>;
const MileageIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>;
const BoardIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const AddressIcon = () => <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;


const MyPageNavGrid = () => {
    const navItems = [
        { icon: <OrderIcon />, label: 'ORDER', description: '주문내역 조회', to: '/mypage/orders' },
        { icon: <ProfileIcon />, label: 'PROFILE', description: '회원 정보', to: '/mypage/profile' },
        { icon: <WishlistIcon />, label: 'WISH LIST', description: '관심 상품', to: '/mypage/wishlist' },
        { icon: <MileageIcon />, label: 'MILEAGE', description: '적립금', to: '/mypage/mileage' },
        { icon: <BoardIcon />, label: 'BOARD', description: '게시물관리', to: '/mypage/board' },
        { icon: <AddressIcon />, label: 'ADDRESS', description: '배송 주소록 관리', to: '/mypage/addresses' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
            {navItems.map((item, index) => (
                <Link key={index} to={item.to} className="block"> {/* Link 컴포넌트를 사용 */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center h-48 hover:shadow-md transition-shadow duration-200">
                        {item.icon}
                        <p className="text-xl font-bold text-gray-800 mb-1">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MyPageNavGrid;