import React from 'react';
import Header from '../../components/layouts/Headers/Header';
import SearchBar from '../../components/layouts/Headers/SubHeader';
import MenuBar from '../../components/ui/MenuBar/MenuBar';
import Footer from '../../components/layouts/Footers/Footer';
import everLogo from '../../assets/image/everlogo.png';

function About() {
  return (
    <>
      <Header />
      <SearchBar />
      <MenuBar />
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-10 border border-gray-300">
          <h1 className="text-3xl font-extrabold text-center text-black mb-8 border-b pb-4">회사소개</h1>
          
          <div className="flex justify-center mb-8">
            <img
              src={everLogo}
              alt="에버그린 로고"
              className="w-48 h-auto"
            />
          </div>

          <div className="text-gray-700 text-lg leading-relaxed space-y-4 text-center">
            <p>에버그린 홈페이지를 찾아주신 고객 여러분께 감사의 인사를 올립니다.</p>
            <p>
              에버그린샵은<br />
              <strong>루어, 바다루어 전문 낚시 샵</strong>으로<br />
              낚시를 사랑하시는 고객 여러분들께 보다 가까이 다가가고자<br />
              인터넷 홈페이지를 오픈하게 되었습니다.
            </p>
            <p>
              항상 <strong>새로운 마음가짐과 감사의 마음</strong>으로<br />
              고객님과 조사님들의 성원에 보답해 드릴 것을 약속드리겠습니다.
            </p>
            <p className="font-semibold text-black">감사합니다.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default About;
