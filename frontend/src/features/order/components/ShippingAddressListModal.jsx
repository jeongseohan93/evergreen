import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * 배송지 목록을 표시하고 선택할 수 있는 모달 컴포넌트.
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onSelectAddress - 주소 선택 시 호출될 콜백 (선택된 주소 객체를 인자로 받음)
 * @param {string} userUuid - 현재 로그인된 사용자의 UUID
 */
const ShippingAddressListModal = ({ isOpen, onClose, onSelectAddress, userUuid }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 모달이 열릴 때마다 배송지 목록을 불러옴
    useEffect(() => {
        if (!isOpen || !userUuid) {
            // 모달이 닫혀있거나 userUuid가 없으면 아무것도 하지 않음
            setLoading(false); 
            return;
        }

        const fetchAddresses = async () => {
            setLoading(true);
            setError(null);
            try {
                // 백엔드 API 경로 확인 필요 (예: /api/shipping_addresses)
                const response = await axios.get('/order/shipping_addresses', {
                    headers: { // 인증 토큰이 필요한 경우 (백엔드 verifyToken 미들웨어 사용 시)
                        Authorization: `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에 토큰이 저장되어 있다고 가정
                    }
                });
                
                if (response.data.success) {
                    setAddresses(response.data.data);
                } else {
                    setError(response.data.message || '배송지 목록을 불러오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('배송지 목록 로드 중 오류 발생:', err);
                setError('배송지 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [isOpen, userUuid]); // isOpen 또는 userUuid가 변경될 때마다 실행

    if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">배송지 선택</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
                    >
                        &times;
                    </button>
                </div>

                {loading && <p className="text-center text-gray-600">배송지 목록을 불러오는 중...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                {!loading && !error && addresses.length === 0 && (
                    <p className="text-center text-gray-600">등록된 배송지가 없습니다. 새로운 주소를 입력해주세요.</p>
                )}

                {!loading && !error && addresses.length > 0 && (
                    <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {addresses.map((address) => (
                            <li
                                key={address.address_id}
                                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => {
                                    onSelectAddress(address); // 선택된 주소 정보를 부모로 전달
                                    onClose(); // 모달 닫기
                                }}
                            >
                                <p className="font-semibold text-gray-900">{address.address_name} {address.is_default && <span className="text-sm text-indigo-600">(기본)</span>}</p>
                                <p className="text-sm text-gray-700">수령인: {address.recipient_name} ({address.recipient_phone})</p>
                                <p className="text-sm text-gray-600">
                                    {address.zip_code} {address.address_main} {address.address_detail}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ShippingAddressListModal;