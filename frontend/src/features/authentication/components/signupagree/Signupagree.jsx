import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. react-router-dom에서 useNavigate를 import 합니다.
import { HiCheckCircle, HiOutlineCheckCircle } from 'react-icons/hi2';

// 2. 약관 데이터를 배열로 관리하여 유지보수를 용이하게 합니다.
const agreementData = [
    { id: 'terms', text: '[필수] 이용약관 동의', isRequired: true },
    { id: 'privacy', text: '[필수] 개인정보 수집 및 이용 동의', isRequired: true },
    { id: 'age', text: '[필수] 만 14세 이상 확인', isRequired: true },
    { id: 'marketing', text: '[선택] 마케팅 정보 수신 동의', isRequired: false },
];

const AgreementForm = () => {
    // 3. 각 약관의 동의 여부를 객체로 관리합니다. { terms: false, privacy: false, ... }
    const [agreements, setAgreements] = useState(
        agreementData.reduce((acc, agreement) => {
            acc[agreement.id] = false;
            return acc;
        }, {})
    );

    const [isAllChecked, setIsAllChecked] = useState(false);
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    // 4. 개별 약관 체크 핸들러
    const handleCheck = (id) => {
        setAgreements(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // 5. 전체 동의 체크 핸들러
    const handleCheckAll = () => {
        const newCheckedState = !isAllChecked;
        setAgreements(prev => {
            const newAgreements = {};
            for (const key in prev) {
                newAgreements[key] = newCheckedState;
            }
            return newAgreements;
        });
    };
    
    // agreements 상태가 변경될 때마다 전체 동의 체크박스 상태를 업데이트합니다.
    useEffect(() => {
        const allChecked = Object.values(agreements).every(Boolean);
        setIsAllChecked(allChecked);
    }, [agreements]);


    // 6. 필수 약관이 모두 동의되었는지 확인하는 변수
    const allRequiredChecked = agreementData
        .filter(item => item.isRequired)
        .every(item => agreements[item.id]);

    // 7. 다음 버튼 클릭 핸들러
    const handleNext = () => {
        if (allRequiredChecked) {
            navigate('/signup'); // 회원가입 페이지 경로로 이동
        } else {
            alert('모든 필수 약관에 동의해주세요.');
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="p-6 w-full max-w-4xl text-black space-y-6">

                {/* 전체 동의하기 */}
                <div className="flex items-start">
                    <button onClick={handleCheckAll}>
                        {isAllChecked ? (
                            <HiCheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                        ) : (
                            <HiOutlineCheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                        )}
                    </button>
                    <div className="ml-4 flex-grow">
                        <p className='text-black text-xl'>전체 동의하기</p>
                    </div>
                </div>

                <hr className="border-gray-300" />

                {/* 약관 목록 (데이터 기반으로 렌더링) */}
                {agreementData.map((agreement) => (
                    <div key={agreement.id} className="space-y-3">
                        <div className="flex items-center text-black gap-2 text-lg">
                            <button onClick={() => handleCheck(agreement.id)}>
                                {agreements[agreement.id] ? (
                                    <HiCheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                                ) : (
                                    <HiOutlineCheckCircle className="h-7 w-7 text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            {agreement.text}
                        </div>
                        <div className="pl-9">
                            <div className="bg-gray-200 border border-gray-300 rounded-md p-4 h-24 overflow-y-scroll text-sm text-gray-600">
                                {agreement.text}에 대한 상세 내용입니다. 여기에 각 약관의 전체 내용을 넣어주세요.
                            </div>
                        </div>
                    </div>
                ))}

                {/* 다음 버튼 */}
                <div className="pt-6">
                    <button
                        onClick={handleNext}
                        disabled={!allRequiredChecked} // 8. 필수 약관이 모두 체크되지 않으면 비활성화
                        className={`w-full py-3 text-lg font-bold text-white rounded-lg transition-colors 
                        ${allRequiredChecked ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        다음
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AgreementForm;