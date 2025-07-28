import { useState } from 'react';
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';
import { findId } from '../api/authApi'

const FindIdPage = () => {
    const navigate = useNavigate();
    const [ phone, setPhone ] = useState('');

    const handleFindIdSubmit = async (e) => {
        e.preventDefault(); 

        if (!phone.trim()) {
            alert('핸드폰 번호를 입력해주세요.');
            return;
        }

        try {
            const result = await findId(phone);
            navigate('/findid/result', { state: { userId: result.userId } });

        } catch (error) {
            console.error("아이디 찾기 실패:", error);
            const errorMessage = error.response?.data?.message || '아이디를 찾을 수 없습니다.';
            alert(errorMessage);
        }

    }
    
    return (
        <>
            {/* Header와 Footer는 기존 코드를 유지합니다. */}
            <Header />
            <SubHeader />
            <MenuBar />
            {/* 메인 컨텐츠 영역 */}
            <main className="flex flex-col items-center justify-center w-full px-4 py-16 bg-white">
                <div className="w-full max-w-2xl">
                    {/* 탭 메뉴 */}
                    <div className="flex border-b border-gray-300">
                        <button className="py-3 px-6 text-lg font-semibold text-blue-600 border-b-2 border-blue-600">
                            아이디 찾기
                        </button>
                        <button 
                            className="py-3 px-6 text-lg font-semibold text-gray-500 hover:text-blue-600"
                            onClick={() => navigate('/findpassword')} 
                        >
                            비밀번호 찾기
                        </button>
                    </div>

                    <form onSubmit={handleFindIdSubmit} className="flex flex-col items-center w-full mt-10">
                        {/* 안내 문구 */}
                        <p className="text-gray-600 mb-8 text-center">
                            아이디 찾기를 위한 이메일을 입력해주세요.
                        </p>

                        {/* 입력 폼 컨테이너 */}
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-10">
                            <div className="flex items-center">
                                {/* 레이블 */}
                                <label htmlFor="email" className="w-24 text-lg font-semibold text-gray-800">
                                    핸드폰 번호
                                </label>
                                {/* 입력 필드 */}
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="'-' 없이 숫자만 입력"
                                    className="flex-1 p-3 text-lg bg-blue-50/50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={phone} // 3. state와 input을 연결합니다.
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            className="mt-8 py-3 px-16 bg-indigo-500 text-white text-lg font-bold rounded-md hover:bg-indigo-600 transition-colors"
                        >
                            다음
                        </button>
                    </form>
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default FindIdPage;