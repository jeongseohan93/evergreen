import React from "react";

function Header() { 
    return (
       <header className="flex justify-between items-center px-8 py-5">
            {/* 로고 */}
            <div>
                {/* 만약 글자 로고라면 아래 span 사용 */}
                <span className="text-[#FF8000] font-extrabold text-[28px] tracking-[-1px]">
                    {/* 로고 텍스트 예시 */}
                    EVERLOGO
                </span>
                {/* 이미지 로고 쓸 거면 아래 코드로! */}
                {/* <img src="/img/everlogo.png" alt="logo" /> */}
            </div>
            {/* 로그인 영역 */}
            <div className="flex items-center gap-5">
            </div>
        </header>
    );
}

export default Header;