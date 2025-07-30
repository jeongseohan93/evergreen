import React, { useState, useEffect } from 'react';
import useDeliveryManagement from '../../components/order/hooks/useDeliveryManagement';

const DeliveryModifyForm = ({ delivery, onCancel, onSuccess }) => {
  // 내부 상태로 form을 복사해서 관리
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(delivery);
  }, [delivery]);

  const { updateDeliveryInfo } = useDeliveryManagement();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'email' || name === 'phone') {
      setForm((prev) => ({
        ...prev,
        User: {
          ...prev.User,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 저장(제출) 시 유효성 검사
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.total_amount || form.total_amount === '' || isNaN(form.total_amount)) {
      setError('총 배송 금액을 입력해 주세요.');
      return;
    }
    if (!form.tracking_number || form.tracking_number.trim() === '') {
      setError('운송번호(운송장)를 입력해 주세요.');
      return;
    }
    if (!form.delivery_company || form.delivery_company.trim() === '') {
      setError('택배사를 입력해 주세요.');
      return;
    }
    if (!form.status || form.status.trim() === '') {
      setError('배송상태를 선택해 주세요.');
      return;
    }
    // 실제 저장 로직 (API 호출)
    const result = await updateDeliveryInfo(form.order_id, {
      total_amount: form.total_amount,
      tracking_number: form.tracking_number,
      delivery_company: form.delivery_company,
      status: form.status,
    });
    if (result.success) {
      alert('배송 정보가 수정되었습니다.');
      if (onSuccess) onSuccess();
      else if (onCancel) onCancel();
    } else {
      setError(result.error || '수정에 실패했습니다.');
    }
  };

  if (!form) return <div>주문 정보를 불러오는 중입니다...</div>;

  return (
    <form className="max-w-6xl mx-auto bg-white p-8 rounded-lg mt-10 border border-[#306f65]" onSubmit={handleSubmit}>
      <h2 className="text-4xl font-bold mb-6 font-aggro">배송 정보 수정</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 주문번호 (읽기전용) */}
        <div>
          <label className="font-semibold">주문번호</label>
          <input type="text" value={form.order_id || ''} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        {/* 고객명 (수정불가) */}
        <div>
          <label>고객명 *</label>
          <input type="text" name="name" value={form.User?.name || ''} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        {/* 고객전화번호 (수정불가) */}
        <div>
          <label>고객 전화번호 *</label>
          <input type="text" name="phone" value={form.User?.phone || ''} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        {/* 고객이메일 (수정가능) */}
        <div>
          <label>고객 이메일 *</label>
          <input type="email" name="email" value={form.User?.email || ''} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        {/* 총배송금액 (수정가능) */}
        <div>
          <label className="text-[#58bcb5]">총 배송 금액 *</label>
          <input type="number" name="total_amount" value={form.total_amount || ''} onChange={handleChange} className="w-full px-3 py-2 border-2 rounded focus:border-[#306f65] focus:outline-none" />
        </div>
        {/* 주문일 (읽기전용) */}
        <div>
          <label className="font-semibold">주문일</label>
          <input type="text" value={form.created_at ? new Date(form.created_at).toLocaleDateString() : ''} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
        {/* 운송번호 (읽기전용) */}
        <div>
          <label className="text-[#58bcb5]">운송번호(운송장) *</label>
          <input type="text" name="tracking_number" value={form.tracking_number || ''} onChange={handleChange} className="w-full px-3 py-2 border-2 rounded focus:border-[#306f65] focus:outline-none" />
        </div>
        {/* 택배사 (수정가능) */}
        <div>
          <label className="text-[#58bcb5]">택배사 *</label>
          <input type="text" name="delivery_company" value={form.delivery_company || ''} onChange={handleChange} className="w-full px-3 py-2 border-2 rounded focus:border-[#306f65] focus:outline-none" />
        </div>
        {/* 배송상태 (수정가능) */}
        <div>
          <label className="text-[#58bcb5]">배송상태 *</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full px-3 py-2 border-2 rounded focus:border-[#306f65] focus:outline-none">
            <option value="pending">대기</option>
            <option value="paid">결제완료</option>
            <option value="shipping">배송중</option>
            <option value="delivered">배송완료</option>
            <option value="cancelled">취소</option>
          </select>
        </div>
        {/* 지연일수 (읽기전용) */}
        <div>
          <label className="font-semibold">지연 일 수</label>
          <input type="text" value={form.delayDays === 0 ? '지연되지 않음' : form.delayDays} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-8">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500">취소</button>
        <button type="submit" className="px-4 py-2 rounded bg-[#306f65] text-white hover:bg-[#58bcb5]">저장</button>
      </div>
    </form>
  );
};

export default DeliveryModifyForm;
