// src/components/AddressBookForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { shipingform, updateShippingAddressApi } from '../api/ship';
// ⭐⭐ 변경된 컴포넌트 이름과 파일 경로에 맞춰 임포트 (이전과 동일) ⭐⭐
import AddressSearchModal from '../../../shared/api/AddressSearchModal';

// 📦 form 초기값 매핑 함수 (컴포넌트 외부로 이동)
const mapBackendDataToForm = (data = {}) => ({
  addressName: data.address_name || '',
  recipientName: data.recipient_name || '',
  recipientPhone: data.recipient_phone || '',
  zipCode: data.zip_code || '',
  addressMain: data.address_main || '',
  addressDetail: data.address_detail || '',
  isDefault: data.is_default || false,
  address_id: data.address_id || null
});

const AddressBookForm = ({ initialData = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState(() => mapBackendDataToForm(initialData));
  const [showModal, setShowModal] = useState(false);
  const detailAddressRef = useRef(null);

  useEffect(() => {
    setFormData(mapBackendDataToForm(initialData));
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 주소 팝업에서 선택된 주소 데이터를 받는 콜백 함수 (변화 없음)
  const handleAddressSelect = ({ zipCode, addressMain, addressDetail }) => {
    console.log('✅ handleAddressSelect 호출됨. 받은 데이터:', { zipCode, addressMain, addressDetail }); // 디버깅 로그 추가
    setFormData(prev => ({
      ...prev,
      zipCode,
      addressMain,
      addressDetail: addressDetail || '' // 상세주소는 없을 수도 있으니 빈 문자열로 초기화
    }));
    setShowModal(false); // 모달 닫기
    detailAddressRef.current?.focus(); // 상세주소 입력 필드로 포커스 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = formData.address_id
        ? await updateShippingAddressApi(formData.address_id, formData)
        : await shipingform(formData);

      if (response.success) {
        alert(`배송지 ${formData.address_id ? '수정' : '추가'} 성공!`);
        onSave?.(formData);
      } else {
        alert(`배송지 저장 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('배송지 저장 실패:', error);
      alert('배송지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {formData.address_id ? '배송지 수정' : '새 배송지 추가'}
      </h3>
      <form onSubmit={handleSubmit}>
        {/* 배송지명 */}
        <div className="mb-3">
          <label htmlFor="addressName" className="block text-sm font-medium text-gray-700 mb-1">
            배송지명 (선택)
          </label>
          <input
            type="text"
            name="addressName"
            id="addressName"
            value={formData.addressName}
            onChange={handleInputChange}
            placeholder="예: 우리집, 회사"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 수령인 */}
        <div className="mb-3">
          <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
            수령인
          </label>
          <input
            type="text"
            name="recipientName"
            id="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            placeholder="수령인 이름"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 연락처 */}
        <div className="mb-3">
          <label htmlFor="recipientPhone" className="block text-sm font-medium text-gray-700 mb-1">
            연락처
          </label>
          <input
            type="text"
            name="recipientPhone"
            id="recipientPhone"
            value={formData.recipientPhone}
            onChange={handleInputChange}
            placeholder="'-' 없이 숫자만 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 주소 검색 */}
        <div className="mb-3">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            주소
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              readOnly
              placeholder="우편번호"
              className="w-1/3 px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            id="addressMain"
            name="addressMain"
            value={formData.addressMain}
            readOnly
            placeholder="도로명 주소"
            className="w-full mt-2 px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
          />
        </div>

        {/* 상세주소 */}
        <div className="mb-3">
          <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700 mb-1">
            상세주소
          </label>
          <input
            type="text"
            id="addressDetail"
            name="addressDetail"
            value={formData.addressDetail}
            onChange={handleInputChange}
            placeholder="아파트, 동/호수 입력"
            ref={detailAddressRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* 기본 배송지 체크 */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="isDefault" className="ml-2 text-gray-800">
            기본 배송지로 설정
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            className="w-1/2 sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            저장하기
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 sm:w-auto px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </form>

      {/* 주소 모달을 띄울 때 AddressSearchModal 컴포넌트 렌더링 */}
      {showModal ? (
        <AddressSearchModal onSelect={handleAddressSelect} onClose={() => setShowModal(false)} />
      ) : null}
    </div>
  );
};

export default AddressBookForm;