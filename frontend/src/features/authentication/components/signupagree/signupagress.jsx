import React, { useState } from 'react';
import { HiCheckCircle, HiOutlineCheckCircle } from 'react-icons/hi2';

const AgreementForm = () => {
    const [ check, setCheck ] = useState(false);

    const handleCheck = () => {
        setCheck(!check);
    }
  return (
    <div className="flex items-center justify-center p-4">
      <div className="p-6 w-full max-w-lg text-white space-y-6">
        
        {/* 전체 동의하기 */}
        <div className="flex items-start">
            <button onClick={handleCheck}>
                {check ? (<HiCheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />) : 
                (<HiOutlineCheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />)
                }
            </button>
          <div className="ml-4 flex-grow">
            <p className='text-black text-xl'>전체 동의하기</p>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* [필수] 네이버 이용약관 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <HiCheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div className="ml-3 flex items-center gap-2">
            </div>
          </div>
          <div className="pl-9">
            <div className="bg-gray-700 border border-gray-600 rounded-md p-4 h-24 overflow-y-scroll space-y-2">
                
            </div>
          </div>
        </div>
        
        {/* [필수] 개인정보 수집 및 이용 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <HiCheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div className="ml-3 flex items-center gap-2">
            </div>
            <div className="ml-auto">
            </div>
          </div>
          <div className="pl-9">
            <div className="bg-gray-700 border border-gray-600 rounded-md p-4 h-24 overflow-y-scroll space-y-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementForm;