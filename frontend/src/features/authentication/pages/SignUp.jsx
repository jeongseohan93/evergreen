import { useState } from 'react';
import { Header, SubHeader, Footer } from '@/app';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlinePhone, HiOutlineMapPin, HiOutlineEyeSlash} from 'react-icons/hi2'
import { signUp } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
const SignPage = () => {

    const [ showPassword, setShowPassword ] = useState(false);

    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        address: ''
    })

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevDate => ({
            ...prevDate,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signUp(formData);
            console.log('회원가입 성공:', response);
            alert('회원가입에 성공했습니다!');
            navigate('/');
        } catch (error) {
            // error.response에 서버가 보낸 응답 정보가 담겨있습니다.
            console.error('자세한 에러 내용:', error.response); 
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };
    
    return (
        <>
            <Header/>
            <SubHeader/>
            <div className="flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="p-8 w-full max-w-md space-y-4">
                    <div>
                        <p className='text-2xl font-bold'>회원가입</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
                            <HiOutlineUser className="h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="이메일" name="email" value={formData.email} onChange={handleChange} 
                            className="bg-transparent w-full ml-3 focus:outline-none" />
                        </div>

                        <div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
                            <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                            <input type={showPassword ? 'text' : 'password' } placeholder="비밀번호" name="password" 
                             value={formData.password} onChange={handleChange}
                            className="bg-transparent w-full ml-3 focus:outline-none" />
                            <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                                {showPassword ? (
                                    <HiOutlineEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                <HiOutlineEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-700" />

                    <div className="space-y-3">
                        <div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
                            <HiOutlineUser className="h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="이름" name="name"  value={formData.name} onChange={handleChange}
                            className="bg-transparent w-full ml-3 focus:outline-none" />
                        </div>

                        <div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
                            <HiOutlinePhone className="h-5 w-5 text-gray-400" />
                            <input type="tel" placeholder="휴대폰번호" name="phone"  value={formData.phone} onChange={handleChange}
                            className="bg-transparent w-full ml-3 focus:outline-none" />
                        </div>

                        <div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
                            <HiOutlineMapPin className="h-5 w-5 text-gray-400" />
                            <input type="tel" placeholder="주소" name="address"  value={formData.address} onChange={handleChange}
                            className="bg-transparent w-full ml-3 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="w-full bg-gray-400 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                            회원가입
                        </button>
                    </div>

                </form>
            </div>
            <Footer/>
        </>
    )
}

export default SignPage;