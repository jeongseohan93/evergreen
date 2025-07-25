import React, { useState, useRef } from 'react'; // useRef 추가
import { Header, SubHeader, Footer } from '@/app';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlinePhone, HiOutlineMapPin, HiOutlineEyeSlash} from 'react-icons/hi2'
import { signUp } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
// ⭐⭐ AddressSearchModal 컴포넌트 임포트 경로 확인 및 추가 ⭐⭐
// 실제 프로젝트 구조에 맞게 경로를 수정해주세요.
import AddressSearchModal from '../../../shared/api/AddressSearchModal'; 

const SignPage = () => {

    const [ showPassword, setShowPassword ] = useState(false);
    const [ showAddressModal, setShowAddressModal ] = useState(false); // 주소 모달 상태 추가
    const detailAddressRef = useRef(null); // 상세 주소 필드 참조

    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        zipCode: '',      // ⬅️ 우편번호 필드 추가
        addressMain: '',  // ⬅️ 기본 주소 필드 추가
        addressDetail: '' // ⬅️ 상세 주소 필드 추가
    })

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ // prevDate -> prevData 오타 수정
            ...prevData,
            [name]: value,
        }));
    };

    // ⭐⭐ 주소 검색 모달에서 주소 선택 시 호출될 콜백 함수 ⭐⭐
    const handleAddressSelect = ({ zipCode, addressMain, addressDetail }) => {
        setFormData(prevData => ({
            ...prevData,
            zipCode,
            addressMain,
            addressDetail: addressDetail || '' // 상세 주소는 없을 수도 있으므로 빈 문자열로 초기화
        }));
        setShowAddressModal(false); // 모달 닫기
        detailAddressRef.current?.focus(); // 상세 주소 필드로 포커스 이동
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ⭐⭐ signUp API 호출 시 formData에 맞게 데이터 준비 ⭐⭐
            // 백엔드에서 address 필드를 통합하여 받는지, 아니면 zipCode, addressMain, addressDetail을 각각 받는지 확인 후 조정 필요
            // 여기서는 임시로 address 필드를 통합하여 전송하는 예시를 보여줍니다.
            const dataToSend = {
                ...formData,
                address: `${formData.addressMain} ${formData.addressDetail}`.trim() // 기본주소 + 상세주소 통합
            };
            // 만약 백엔드에서 zipCode, addressMain, addressDetail을 각각 받는다면,
            // const dataToSend = { ...formData }; 로 두면 됩니다.
            
            const response = await signUp(dataToSend); // 수정된 formData 객체 전달
            console.log('회원가입 성공:', response);
            alert('회원가입에 성공했습니다!');
            navigate('/');
        } catch (error) {
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

                        {/* ⭐⭐ 주소 입력 필드 수정: 우편번호, 주소, 상세 주소 및 검색 버튼 추가 ⭐⭐ */}
                        <div className="mb-3">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
                                주소
                            </label>
                            <div className="flex space-x-2 items-center">
                                <HiOutlineMapPin className="h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    readOnly // 직접 입력 방지
                                    placeholder="우편번호"
                                    className="w-1/3 px-3 py-2 border border-gray-600 bg-transparent rounded-md focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(true)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300 text-sm"
                                >
                                    주소 검색
                                </button>
                            </div>
                            <input
                                type="text"
                                id="addressMain"
                                name="addressMain"
                                value={formData.addressMain}
                                readOnly // 직접 입력 방지
                                placeholder="기본 주소 (도로명, 지번)"
                                className="w-full mt-2 px-4 py-3 border border-gray-600 bg-transparent rounded-md focus:outline-none"
                            />
                        </div>

                        {/* 상세 주소 */}
                        <div className="mb-3">
                            <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
                                상세주소
                            </label>
                            <input
                                type="text"
                                id="addressDetail"
                                name="addressDetail"
                                value={formData.addressDetail}
                                onChange={handleChange}
                                placeholder="상세 주소 (아파트, 동/호수 등)"
                                ref={detailAddressRef} // useRef 연결
                                className="w-full px-4 py-3 border border-gray-600 bg-transparent rounded-md focus:outline-none"
                            />
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

            {/* ⭐⭐ 주소 검색 모달 조건부 렌더링 ⭐⭐ */}
            {showAddressModal && (
                <AddressSearchModal
                    onSelect={handleAddressSelect}
                    onClose={() => setShowAddressModal(false)}
                />
            )}
        </>
    )
}

export default SignPage;