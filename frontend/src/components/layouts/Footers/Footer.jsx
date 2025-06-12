import React from "react";

function Footer() {
    return (
        <footer className="bg-white py-12 px-8 border-t border-gray-200 text-gray-700">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* 1열: 회사 정보 */}
                <div className="col-span-1">
                    <p className="text-sm text-gray-500 mb-2">반려동물 쇼핑몰</p>
                    <p className="text-3xl font-aggro font-bold text-black mb-6">명명하게 :)</p> {/* 폰트 클래스 적용 */}

                    <div className="text-sm leading-relaxed space-y-1">
                        <p>상호명: 디자인모아</p>
                        <p>대표자: 디자인모아</p>
                        <p>사업자등록번호: 000-00-00000</p>
                        <p>통신판매업신고번호 :</p>
                        <p>전화: 010-6561-1143</p>
                        <p>주소: 58004 전남 순천시 안산길 50 디자인모아</p>
                        <p>개인정보보호책임자: <a href="mailto:d-more@daum.net" className="text-blue-600 hover:underline">디자인모아(d-more@daum.net)</a></p>
                    </div>
                </div>

                {/* 2열: CUSTOMER CENTER & BANK INFO */}
                <div className="col-span-1">
                    <h3 className="font-bold text-lg text-black mb-4">CUSTOMER CENTER</h3>
                    <p className="text-xl font-bold text-black mb-2">010-6561-1143</p>
                    <p className="text-sm leading-relaxed mb-6">
                        평일 10:00 ~ 18:00<br />
                        점심 12:00 ~ 13:00<br />
                        토, 일, 공휴일 휴무
                    </p>

                    <h3 className="font-bold text-lg text-black mb-4">BANK INFO</h3>
                    <p className="text-sm mb-2">NH농협</p>
                    <p className="text-xl font-bold text-black mb-2">351-0669-9629-03</p>
                    <p className="text-sm">예금주: 김진영(디자인모아)</p>
                </div>

                {/* 3열: SERVICE BOARD */}
                <div className="col-span-1">
                    <h3 className="font-bold text-lg text-black mb-4">SERVICE BOARD</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">공지사항</a></li>
                        <li><a href="#" className="hover:underline">이벤트</a></li>
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                        <li><a href="#" className="hover:underline">문의하기</a></li>
                        <li><a href="#" className="hover:underline">구입후기</a></li>
                    </ul>
                </div>

                {/* 4열: About us & 교환/반품주소안내 */}
                <div className="col-span-1">
                    <h3 className="font-bold text-lg text-black mb-4">About us</h3>
                    <ul className="space-y-2 text-sm mb-6">
                        <li><a href="#" className="hover:underline">이용약관</a></li>
                        <li><a href="#" className="hover:underline">이용안내</a></li>
                        <li><a href="#" className="hover:underline">개인정보처리방침</a></li>
                    </ul>

                    <h3 className="font-bold text-lg text-black mb-4">교환/반품주소안내</h3>
                    <p className="text-sm leading-relaxed">
                        고객님의 사업장 주소가 나오는 부분입니다.<br />
                        ※ 교환 및 반품을 하기 위해서는 고객센터에 접수 후 진행해주세요
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;