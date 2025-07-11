// frontend/src/features/admin/components/banner/BannerForm.jsx
import React, { useState, useEffect } from 'react';

function BannerForm({ editingBanner, onAdd, onUpdate, onCancelEdit }) {
    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        title: '',
        link_url: '',
        order: 0,
        is_active: true,
        bannerImage: null // 파일 객체 저장
    });
    // 에러 메시지 상태 추가
    const [formError, setFormError] = useState(null); 
    // 성공 메시지 상태 추가
    const [formSuccess, setFormSuccess] = useState(null);

    // editingBanner prop이 변경될 때마다 폼 데이터를 업데이트합니다.
    useEffect(() => {
        if (editingBanner) {
            // 수정 모드일 경우 기존 배너 정보로 폼 채우기
            setFormData({
                title: editingBanner.title || '',
                link_url: editingBanner.link_url || '',
                order: editingBanner.order,
                is_active: editingBanner.is_active,
                bannerImage: null // 이미지 파일은 다시 선택해야 하므로 null로 초기화
            });
        } else {
            // 추가 모드이거나 수정 모드 종료 시 폼 초기화
            // 이 useEffect는 editingBanner가 null -> null로 변경될 때는 실행되지 않으므로,
            // 추가 성공 시에는 handleSubmit 내에서 직접 초기화해야 함.
            setFormData({
                title: '',
                link_url: '',
                order: 0,
                is_active: true,
                bannerImage: null
            });
        }
        setFormError(null); // editingBanner 변경 시 에러 메시지 초기화
        setFormSuccess(null); // editingBanner 변경 시 성공 메시지 초기화
    }, [editingBanner]); // editingBanner prop이 변경될 때마다 실행

    // 폼 입력 필드 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'bannerImage' ? files[0] : value)
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        setFormError(null); // 제출 시 에러 메시지 초기화
        setFormSuccess(null); // 제출 시 성공 메시지 초기화

        let result;
        if (editingBanner) {
            // 수정 모드일 경우 onUpdate 콜백 호출
            result = await onUpdate(editingBanner.banner_id, formData);
        } else {
            // 추가 모드일 경우 onAdd 콜백 호출
            result = await onAdd(formData);
        }

        if (result.success) {
            setFormSuccess(result.message); // 성공 메시지 상태 업데이트
            if (!editingBanner) { // 추가 모드일 때만 폼 초기화
                setFormData({
                    title: '',
                    link_url: '',
                    order: 0,
                    is_active: true,
                    bannerImage: null
                });
            }
            // 성공 시 폼을 닫거나 목록으로 돌아가기 위해 onCancelEdit 호출 (이것이 editingBanner를 null로 만듦)
            // 성공 메시지가 잠시 보인 후 폼이 닫히도록 약간의 지연을 줄 수 있음
            setTimeout(() => {
                onCancelEdit();
            }, 1500); // 1.5초 후 폼 닫기
        } else {
            // 실패 메시지 표시 대신 폼 내부에 에러 표시
            setFormError(result.message); // 에러 메시지 상태 업데이트
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                {editingBanner ? '배너 수정' : '새 배너 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 에러 메시지 표시 영역 */}
                {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">오류: </strong>
                        <span className="block sm:inline">{formError}</span>
                    </div>
                )}
                {/* 성공 메시지 표시 영역 */}
                {formSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">성공: </strong>
                        <span className="block sm:inline">{formSuccess}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">배너 제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="배너 제목 (선택 사항)"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">링크 URL</label>
                    <input
                        type="text"
                        id="link_url"
                        name="link_url"
                        placeholder="클릭 시 이동할 URL (선택 사항)"
                        value={formData.link_url}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">노출 순서</label>
                    <input
                        type="number"
                        id="order"
                        name="order"
                        placeholder="배너 노출 순서"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">활성화</label>
                </div>
                <div>
                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">배너 이미지</label>
                    <input
                        type="file"
                        id="bannerImage"
                        name="bannerImage"
                        onChange={handleInputChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {editingBanner && !formData.bannerImage && (
                        <p className="mt-2 text-sm text-gray-500">
                            현재 이미지: <a href={`http://localhost:3000${editingBanner.image_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">보기</a>
                            (새 이미지 선택 시 교체됩니다)
                        </p>
                    )}
                </div>
                <div className="flex justify-center space-x-4 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        {editingBanner ? '배너 수정하기' : '새 배너 추가하기'}
                    </button>
                    {/* 취소 버튼을 항상 표시하도록 변경 */}
                    <button
                        type="button"
                        onClick={onCancelEdit} // 부모 컴포넌트에서 전달받은 취소 핸들러
                        className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BannerForm;
