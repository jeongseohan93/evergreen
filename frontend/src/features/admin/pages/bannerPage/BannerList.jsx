// frontend/src/features/admin/components/banner/BannerList.jsx
import React, { useState } from 'react';

function BannerList({ banners, onDelete, onToggleActive, onChangeOrder, editingId, editData, onEditClick, onCancel, onInputChange, onSave, previewUrl }) {
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
                                        {editingId === banner.banner_id ? (
                                            <div className="flex flex-col items-center gap-2">
                                                {(previewUrl && previewUrl[banner.banner_id]) ? (
                                                    <img
                                                        src={previewUrl[banner.banner_id]}
                                                        alt="미리보기"
                                                        className="w-full max-w-xs h-28 object-contain rounded mb-1"
                                                    />
                                                ) : banner.image_url && (
                                                    <img
                                                        src={`http://localhost:3000${banner.image_url}`}
                                                        alt={banner.title || '배너 이미지'}
                                                        className="w-full max-w-xs h-28 object-contain rounded mb-1"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e0e0e0/ffffff?text=No+Image'; }}
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    name="bannerImage"
                                                    onChange={onInputChange}
                                                    className="w-full text-sm text-gray-500 rounded focus:outline-none focus:border-[#306f65]"
                                                />
                                            </div>
                                        ) : (
                                            banner.image_url && (
                                                <img
                                                    src={`http://localhost:3000${banner.image_url}`}
                                                    alt={banner.title || '배너 이미지'}
                                                    className="w-full max-w-xs h-28 object-contain rounded-md"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e0e0e0/ffffff?text=No+Image'; }}
                                                />
                                            )
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                        {editingId === banner.banner_id ? (
                                            <input
                                                type="text"
                                                name="title"
                                                value={editData.title}
                                                onChange={onInputChange}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                                            />
                                        ) : (
                                            banner.title || '-'
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                        {editingId === banner.banner_id ? (
                                            <input
                                                type="text"
                                                name="link_url"
                                                value={editData.link_url}
                                                onChange={onInputChange}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#306f65]"
                                            />
                                        ) : (
                                            banner.link_url ? (
                                                <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                                    링크
                                                </a>
                                            ) : '-'
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center">
                                        {editingId === banner.banner_id ? (
                                            <input
                                                type="number"
                                                name="order"
                                                value={editData.order}
                                                onChange={onInputChange}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-[#306f65]"
                                            />
                                        ) : (
                                            banner.order
                                        )}
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
                                            {editingId === banner.banner_id ? (
                                                <>
                                                    <button
                                                        onClick={() => onSave(banner)}
                                                        className="px-7 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5] transition-colors duration-200 mb-1"
                                                    >
                                                        저장
                                                    </button>
                                                    <button
                                                        onClick={onCancel}
                                                        className="px-7 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                                                    >
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEditClick(banner)}
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
                                                </>
                                            )}
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
