import React, { useState } from 'react';
import { Header, SubHeader, Footer } from '@/app';

function Signup() {
    const [formData, setFormData] = useState({
        email: '', // User 모델의 email 필드에 해당 (UI상 '아이디')
        password: '',
        confirmPassword: '',
        name: '',
        phonePart1: '010', // 전화번호 앞자리
        phonePart2: '',    // 전화번호 중간자리
        phonePart3: '',    // 전화번호 뒷자리
        // address: '', // User 모델에는 있지만 UI 스크린샷에 없었으므로 일단 제외
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' 또는 'error'

    // 각 필드별 유효성 검사 힌트 (UI에 표시될 텍스트)
    const [validationHints] = useState({
        email: '영문소문자/숫자, 4~16자',
        password: '영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자',
        // name, phone 등 다른 필드에 대한 힌트도 필요하면 추가하세요.
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setMessageType('');

        const { email, password, confirmPassword, name, phonePart1, phonePart2, phonePart3 } = formData;
        const fullPhoneNumber = `${phonePart1}${phonePart2}${phonePart3}`;

        // 클라이언트 측 유효성 검사 (스크린샷 힌트 기반)
        const emailRegex = /^[a-z0-9]{4,16}$/;
        if (!emailRegex.test(email)) {
            setMessage('아이디는 영문소문자/숫자 4~16자로 입력해주세요.');
            setMessageType('error');
            return;
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const combinations = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

        if (password !== confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            setMessageType('error');
            return;
        }
        if (password.length < 10 || password.length > 16 || combinations < 2) {
            setMessage('비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상 조합하여 10~16자로 입력해주세요.');
            setMessageType('error');
            return;
        }

        // 이름, 전화번호 필수 확인 (User 모델의 allowNull: true/false에 따라 조절)
        if (!name || !fullPhoneNumber) {
             setMessage('이름과 전화번호는 필수 입력 항목입니다.');
             setMessageType('error');
             return;
        }


        // 서버로 전송할 데이터 객체 (기존 User 모델에 맞춤)
        const userData = {
            email,
            password,
            name: name || null,
            phone: fullPhoneNumber || null,
            address: null, // UI에 없으므로 null 또는 필요한 경우 추가
            role: 'user', // 기본 역할
        };

        try {
            // 이 URL은 실제 서버의 API 경로로 변경해야 합니다.
            // 예: 'http://localhost:3000/api/signup' 또는 환경 변수 사용
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message || '회원가입이 성공적으로 완료되었습니다.');
                setMessageType('success');
                // 폼 초기화
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: '',
                    phonePart1: '010',
                    phonePart2: '',
                    phonePart3: '',
                    // address: '',
                });
            } else {
                setMessage(result.message || '회원가입 실패: 알 수 없는 오류가 발생했습니다.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('서버와 통신 중 오류가 발생했습니다.');
            setMessageType('error');
        }
    };

    return (
        <>
        <Header />
        <SubHeader />
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                {/* 아이디 필드 */}
                <div>
                    <label htmlFor="email">
                        아이디 <span>*</span>
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <span>
                        ({validationHints.email})
                    </span>
                </div>

                {/* 비밀번호 필드 */}
                <div>
                    <label htmlFor="password">
                        비밀번호 <span>*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span>
                        ({validationHints.password})
                    </span>
                </div>

                {/* 비밀번호 확인 필드 */}
                <div>
                    <label htmlFor="confirmPassword">
                        비밀번호 확인 <span>*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <span></span> {/* UI 정렬을 위한 빈 공간 */}
                </div>

                {/* 이름 필드 */}
                <div>
                    <label htmlFor="name">
                        이름 <span>*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <span></span>
                </div>

                {/* 휴대폰 필드 */}
                <div>
                    <label htmlFor="phonePart1">
                        휴대전화 <span>*</span>
                    </label>
                    <div>
                        <select
                            id="phonePart1"
                            name="phonePart1"
                            value={formData.phonePart1}
                            onChange={handleChange}
                        >
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                        </select>
                        <span>-</span>
                        <input
                            type="text"
                            id="phonePart2"
                            name="phonePart2"
                            value={formData.phonePart2}
                            onChange={handleChange}
                            maxLength="4"
                            required
                        />
                        <span>-</span>
                        <input
                            type="text"
                            id="phonePart3"
                            name="phonePart3"
                            value={formData.phonePart3}
                            onChange={handleChange}
                            maxLength="4"
                            required
                        />
                    </div>
                    <span></span>
                </div>

                {/* 주소 필드 (User 모델에는 있지만 UI 스크린샷에는 없었음)
                <div>
                    <label htmlFor="address">
                        주소
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <span></span>
                </div>
                */}

                {/* 메시지 표시 */}
                {message && (
                    <p>
                        {message}
                    </p>
                )}

                {/* 회원가입 버튼 */}
                <div>
                    <button type="submit">
                        회원가입
                    </button>
                </div>
            </form>
        </div>
        <Footer />
        </>
    );
}

export default Signup;