// src/pages/FindPasswordPage.js

import React, { useState } from 'react';
import { Header, Footer, SubHeader } from '@/app';
import { useNavigate } from 'react-router-dom';
// API 함수들이 정의된 파일이라고 가정합니다.
import { sendVerificationCode, resetPasswordWithCode } from '../api/authApi';

const FindPasswordPage = () => {
    const navigate = useNavigate();
    
    // UI 상태와 입력값을 관리하는 state
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호가 발송되었는지 여부
    const [isLoading, setIsLoading] = useState(false);

    // 입력값 state
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // 1. '인증번호 받기' 버튼 클릭 시 실행되는 함수
    const handleRequestCode = async (e) => {
        e.preventDefault();
        if (!email || !phone) {
            alert('이메일과 핸드폰 번호를 모두 입력해주세요.');
            return;
        }
        setIsLoading(true);
        try {
            await sendVerificationCode({ email, phone });
            alert('인증번호가 이메일로 발송되었습니다.');
            setIsCodeSent(true); // UI를 인증번호 입력 단계로 변경
        } catch (error) {
            const errorMessage = error.response?.data?.message || '사용자 정보를 확인해주세요.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. '비밀번호 변경' 버튼 클릭 시 실행되는 함수
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!code || !newPassword) {
            alert('인증번호와 새 비밀번호를 모두 입력해주세요.');
            return;
        }
        setIsLoading(true);
        try {
            await resetPasswordWithCode({ email, code, newPassword });
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/login'); // 로그인 페이지로 이동
        } catch (error) {
            const errorMessage = error.response?.data?.message || '인증번호가 올바르지 않습니다.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <SubHeader />
            <main className="flex flex-col items-center justify-center w-full px-4 py-16 bg-white">
                <div className="w-full max-w-2xl">
                    <div className="flex border-b border-gray-300">
                        <button className="py-3 px-6 text-lg font-semibold text-gray-500 hover:text-blue-600" onClick={() => navigate('/findid')}>
                            아이디 찾기 
                        </button>
                        <button className="py-3 px-6 text-lg font-semibold text-blue-600 border-b-2 border-blue-600">
                            비밀번호 찾기
                        </button>
                    </div>

                    {/* 인증번호 발송 전 UI */}
                    {!isCodeSent && (
                        <form onSubmit={handleRequestCode} className="flex flex-col items-center w-full mt-10">
                            <p className="text-gray-600 mb-8 text-center">비밀번호를 찾고자 하는 아이디(이메일)와 핸드폰 번호를 입력해주세요.</p>
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-10">
                                <div className="flex flex-col w-full gap-6">
                                    <div className="flex items-center">
                                        <label htmlFor="email" className="w-28 text-lg font-semibold text-gray-800 shrink-0">이메일</label>
                                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="가입 시 등록한 이메일" required className="flex-1 p-3 text-lg ..." />
                                    </div>
                                    <div className="flex items-center">
                                        <label htmlFor="phone" className="w-28 text-lg font-semibold text-gray-800 shrink-0">핸드폰 번호</label>
                                        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="'-' 없이 숫자만 입력" required className="flex-1 p-3 text-lg ..." />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="mt-8 py-3 px-16 bg-indigo-500 ...">
                                {isLoading ? '요청 중...' : '인증번호 받기'}
                            </button>
                        </form>
                    )}

                    {/* 인증번호 발송 후 UI */}
                    {isCodeSent && (
                        <form onSubmit={handleResetPassword} className="flex flex-col items-center w-full mt-10">
                            <p className="text-gray-600 mb-8 text-center">이메일로 발송된 인증번호와 사용할 새 비밀번호를 입력해주세요.</p>
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-10">
                                <div className="flex flex-col w-full gap-6">
                                    <div className="flex items-center">
                                        <label htmlFor="code" className="w-28 text-lg font-semibold text-gray-800 shrink-0">인증번호</label>
                                        <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="인증번호 6자리" required className="flex-1 p-3 text-lg ..." />
                                    </div>
                                    <div className="flex items-center">
                                        <label htmlFor="newPassword" className="w-28 text-lg font-semibold text-gray-800 shrink-0">새 비밀번호</label>
                                        <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새로운 비밀번호 입력" required className="flex-1 p-3 text-lg ..." />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="mt-8 py-3 px-16 bg-indigo-500 ...">
                                {isLoading ? '변경 중...' : '비밀번호 변경'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default FindPasswordPage;