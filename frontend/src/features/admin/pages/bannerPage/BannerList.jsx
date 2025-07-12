// frontend/src/features/admin/components/banner/BannerList.jsx
import React from 'react';

function BannerList({ banners, onEdit, onDelete, onToggleActive, onChangeOrder }) {
    return (
        <div className="mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
            <h2 className="text-2xl font-bold font-aggro text-[#306f65] mb-6 text-center">현재 배너 목록</h2>
            {banners.length === 0 ? (
                <p className="text-center text-gray-600">등록된 배너가 없습니다.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse mt-5">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">이미지</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">제목</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">링크</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">순서</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">활성화</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">생성일</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">수정일</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.banner_id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">{banner.banner_id}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                                        {banner.image_url && (
                                            <img
                                                src={`http://localhost:3000${banner.image_url}`} // ⭐ 실제 백엔드 서버 주소와 uploads 경로를 조합
                                                alt={banner.title || '배너 이미지'}
                                                className="w-24 h-auto rounded-md object-cover shadow-sm"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e0e0e0/ffffff?text=No+Image'; }} // 이미지 로드 실패 시 대체 이미지
                                            />
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">{banner.title || '-'}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                        {banner.link_url ? (
                                            <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                                링크
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                                        {banner.order}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onToggleActive(banner.banner_id, banner.is_active)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${banner.is_active ? 'bg-[#306f65]' : 'bg-gray-300'}`}
                                        >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${banner.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                                            style={{ willChange: 'transform' }}
                                        />
                                    </button>
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">{new Date(banner.created_at).toLocaleDateString('ko-KR')}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">{new Date(banner.updated_at).toLocaleDateString('ko-KR')}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm w-32 text-center font-medium">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <button
                                                onClick={() => onEdit(banner)}
                                                className="px-7 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5] transition-colors duration-200"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => onDelete(banner.banner_id)}
                                                className="px-7 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 mt-1"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BannerList;
