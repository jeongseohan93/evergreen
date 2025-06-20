import React from 'react';
import { Link } from 'react-router-dom';
import { footerLinks, footerCommunity } from '@/shared';

function Footer() {
  return (
    <footer className="bg-white py-12 px-8 border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* 1열: 회사 정보 */}
        <div className="col-span-2">
          <p className="text-sm text-gray-500 mb-2">낚시전문 쇼핑몰</p>
          <p className="text-3xl font-aggro font-bold text-black mb-5">에버그린피싱</p>
          <div className="text-sm leading-relaxed space-y-1">
            <p>상호명: 에버그린피싱</p>
            <p>대표자: 윤영미</p>
            <p className="text-sm">
              사업자등록번호: 824-58-00315
              <a
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8245800315"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 px-2 py-0.5 border border-gray-400 rounded text-xs text-gray-600 hover:text-blue-600 hover:border-blue-500"
              >
                사업자정보확인
              </a>
            </p>
            <p>통신판매업신고번호: 2020-용인기흥-1217</p>
            <p>전화: 031-338-7223</p>
            <p className="whitespace-nowrap">주소: 경기도 용인시 처인구 이동읍 경기동로 790번길2</p>
            <p className="whitespace-nowrap">
              개인정보책임관리자 : 윤영미 (
              <a href="mailto:egfisning@naver.com" className="text-black-600 hover:underline font-semibold">
                egfisning@naver.com
              </a>
              )
            </p>
          </div>
        </div>

        {/* 2열: CUSTOMER CENTER & BANK INFO */}
        <div className="col-span-1 border-l border-gray-300 pl-8">
          <h3 className="font-bold text-lg text-black mb-3">CS CENTER</h3>
          <p className="text-xl font-bold text-black mb-2">010-5506-5105</p>
          <p className="text-sm font-bold">상담시간 : 오전9시~오후11시까지</p>
          <p className="text-sm leading-relaxed mb-6">
            매장오픈시간 : 오전9시 ~ 오후8시<br />
            상설매장 (연중무휴)
          </p>
          <h3 className="font-bold text-lg text-black mb-3">BANK ACCOUNT</h3>
          <p className="text-sm mb-2">NH농협</p>
          <p className="text-sm font-bold text-black mb-2">352-1773-7559-13</p>
          <p className="text-sm font-bold">예금주 : 윤영미</p>
        </div>

        {/* 3열: COMMUNITY */}
        <div className="col-span-1 flex flex-col justify-start pl-16">
          <h3 className="font-bold text-lg text-black mb-4">COMMUNITY</h3>
          <ul className="space-y-2 text-sm">
            {footerCommunity.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4열: ABOUT US */}
        <div className="col-span-1 pl-8">
          <h3 className="font-bold text-lg text-black mb-4">About us</h3>
          <ul className="space-y-2 text-sm mb-6">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-lg text-black mb-4">오프라인 매장</h3>
          <p className="text-sm leading-relaxed">
            경기도 용인시 처인구 이동읍<br />
            경기동로790번길2 에버그린피싱
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
