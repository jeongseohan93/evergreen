// feature/userProfile/pages/Mypage.jsx (MyPageDashboard.jsx 등으로 이름 변경도 고려)
import React from "react";
// Header, Footer, SubHeader는 MypageLayout에서 관리하므로 여기서는 필요 없음

const MyPage = () => {
    return (
    <>
        <h2>환영합니다!</h2>
        <p>마이페이지에 오신 것을 환영합니다. 왼쪽 메뉴를 이용하여 원하시는 정보를 확인하고 관리하실 수 있습니다.</p>
        {/* 추가적인 요약 정보 등 */}
    </>
  );
};

export default MyPage;