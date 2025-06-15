import {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '../../components/layouts/Headers/Header';
import SubHeader from '../../components/layouts/Headers/SubHeader';
import MenuBar from '../../components/ui/MenuBar/MenuBar';
import Footer from '../../components/layouts/Footers/Footer';


function Privacy() {
  const [text, setText] = useState('');

  
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${process.env.PUBLIC_URL}/aggreement/member-privacy.txt`)
        setText(res.data);
      } catch (err) {
        console.error('약관 불러오기 실패:', err);
      }
    };

    fetchTerms();
  }, []);
  
  return (
    <>
    <Header />
    <SubHeader />
    <MenuBar />
    <div className="flex flex-col items-center mt-10 px-6 pb-20">
  <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>

  {/* 바깥 회색 박스 */}
  <div className="w-full max-w-[1200px] bg-gray-100 rounded-lg p-6 shadow-inner">

    {/* 안쪽 테두리 + 흰색 박스 */}
    <div className="w-full h-[680px] bg-white border border-gray-300 rounded-md overflow-y-scroll p-6 shadow-sm text-sm leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  </div>
</div>


    <Footer />
    </>
  )
}

export default Privacy;