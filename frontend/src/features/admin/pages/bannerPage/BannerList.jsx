// frontend/src/features/admin/components/banner/BannerList.jsx
import React from 'react';

function BannerList({ banners, onEdit, onDelete, onToggleActive, onChangeOrder }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">현재 배너 목록</h2>
            {banners.length === 0 ? (
                <p className="text-center text-gray-600">등록된 배너가 없습니다.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">링크</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활성화</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정일</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {banners.map(banner => (
                                <tr key={banner.banner_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{banner.banner_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {banner.image_url && (
                                            <img
                                                src={`http://localhost:3000${banner.image_url}`} // ⭐ 실제 백엔드 서버 주소와 uploads 경로를 조합
                                                alt={banner.title || '배너 이미지'}
                                                className="w-24 h-auto rounded-md object-cover shadow-sm"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e0e0e0/ffffff?text=No+Image'; }} // 이미지 로드 실패 시 대체 이미지
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{banner.title || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {banner.link_url ? (
                                            <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                                링크
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            value={banner.order}
                                            onChange={(e) => onChangeOrder(banner.banner_id, parseInt(e.target.value))} // onChangeOrder 콜백 호출
                                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        <input
                                            type="checkbox"
                                            checked={banner.is_active}
                                            onChange={() => onToggleActive(banner.banner_id, banner.is_active)} // onToggleActive 콜백 호출
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(banner.created_at).toLocaleDateString('ko-KR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(banner.updated_at).toLocaleDateString('ko-KR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(banner)} // onEdit 콜백 호출
                                            className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-50 transition duration-150 ease-in-out"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => onDelete(banner.banner_id)} // onDelete 콜백 호출
                                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition duration-150 ease-in-out"
                                        >
                                            삭제
                                        </button>
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
