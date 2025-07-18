// src/pages/AccountInfoPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyInfoApi, updateMyInfoApi } from '../api/userApi';

const AccountInfoPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);

    // 1. 페이지 로드 시 내 정보 불러오기
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                // getMyInfoApi는 response.data를 반환하므로, 바로 data로 받습니다.
                const data = await getMyInfoApi(); 
                
                // 백엔드 응답에 'user' 객체가 있는지 직접 확인합니다.
                if (data && data.user) { // response.data.success 가 아닌 data.success로 변경
                    setFormData(data.user); // 성공 시, 받아온 데이터로 상태 업데이트
                } else {
                    // 로그인되어 있지 않거나 사용자 정보가 없는 경우
                    alert(data.message || '로그인이 필요하거나 사용자 정보를 찾을 수 없습니다.');
                    // window.location.href = '/login';
                }
            } catch (error) {
                console.error("정보 조회 실패:", error);
                alert(error.response?.data?.message || '회원 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyInfo();
    }, []);

    // 2. 폼 입력값 변경 시 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. 폼 제출 (정보 수정) 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // updateMyInfoApi는 response.data를 반환하므로, 바로 data로 받습니다.
            const data = await updateMyInfoApi({ 
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });
            
            // 💡 문제의 핵심: data는 이미 서버 응답의 { success: true, message: '...' } 객체입니다.
            // 따라서 data.success를 직접 확인해야 합니다.
            if (data.success) { // response.data.success 대신 data.success로 수정
                alert('정보가 성공적으로 수정되었습니다.');
            } else {
                alert(`수정 실패: ${data.message}`); // response.data.message 대신 data.message로 수정
            }
        } catch (error) {
            console.error("정보 수정 실패:", error);
            // 에러 발생 시 백엔드 메시지를 활용
            alert(error.response?.data?.message || '정보 수정에 실패했습니다.');
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">계정 정보 관리</h1>
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700">이메일 (수정 불가)</label>
                    <input type="email" value={formData.email || ''} readOnly className="w-full mt-1 p-2 border rounded bg-gray-100" />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">이름</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700">연락처</label>
                    <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" />
                </div>
                <div className="mb-6">
                    <label htmlFor="address" className="block text-gray-700">주소</label>
                    <input type="text" id="address" name="address" value={formData.address || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    수정하기
                </button>
            </form>
        </div>
    );
};

export default AccountInfoPage;