import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, idcheck } from '../../services/userApi'
import Header from '../../components/layouts/Headers/Header';
import SearchBar from '../../components/layouts/Headers/SubHeader';
import MenuBar from '../../components/ui/MenuBar/MenuBar';
import Footer from '../../components/layouts/Footers/Footer';


function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
  });
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const navigate = useNavigate();

  // 입력값 변화 처리
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkPasswordMatch = () => {
  if (!form.password || !form.confirmPassword) {
    alert('비밀번호와 확인용 비밀번호를 모두 입력해주세요.');
    return;
  }

  if (form.password === form.confirmPassword) {
    alert('비밀번호가 일치합니다.');
  } else {
    alert('비밀번호가 일치하지 않습니다.');
  }
};

  // 아이디 중복확인
  const checkUsername = async () => {
    if (!form.email) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
        const res = await idcheck({ email: form.email });
        alert(res.message); 

        setIsIdAvailable(true);

    } catch (err) {

        if (err.response && err.response.status === 409) {
        alert(err.response.data.message); 
        setIsIdAvailable(false);

    } else {
        alert('서버 오류로 중복확인 실패');
        setIsIdAvailable(false);
    }
  }
}

  // 회원가입 처리
  const handleRegister = async () => {
    // 기본 입력 검증
    if (!form.password || !form.confirmPassword || !form.name || !form.email) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (!isIdAvailable) {
      alert('아이디 중복확인을 해주세요.');
      return;
    }

    try {
      const response = await register(form);
      alert(response.data.message);
      navigate('/'); // 회원가입 성공 후 로그인 페이지 이동
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data?.message || '오류 발생'));
    }
  };

  return (
    <>
    <Header />
    <SearchBar />
    <MenuBar />
    <div style={{ padding: '20px' }}>
      <h2>회원가입</h2>

      <div>
        <input
          type="text"
          name="email"
          placeholder="이메일 아이디"
          value={form.email}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <button onClick={checkUsername}>중복확인</button>
      </div>

      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        style={{ marginTop: '10px', marginRight: '10px' }}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={handleChange}
        style={{ marginTop: '10px' }}
      />
      <button 
        type='button'
        onClick={checkPasswordMatch}
      >비밀번호 확인</button>

      <input
        type="text"
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        style={{ marginTop: '10px', width: '300px' }}
      />
      <input
        type="tel"
        name="phone"
        placeholder="연락처"
        value={form.phone}
        onChange={handleChange}
        style={{ marginTop: '10px', width: '300px' }}
      />
      <input
        type="text"
        name="address"
        placeholder="주소"
        value={form.address}
        onChange={handleChange}
        style={{ marginTop: '10px', width: '300px' }}
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleRegister}>회원가입</button>
        <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
          취소
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Register;