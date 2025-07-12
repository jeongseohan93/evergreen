// src/features/admin/product/components/ProductList.jsx
import React from 'react';

// 기본 이미지 또는 깨진 이미지 표시를 위한 대체 이미지 URL (필요에 따라 변경)
const DEFAULT_IMAGE_URL = '/images/default_product.png'; // 실제 경로에 맞게 수정

const ProductList = ({
    products,
    categories,
    editingProduct,
    toggleEditMode,
    handleEditInputChange,
    handleUpdateProduct,
    handleDeleteProduct,
    // useProductManagement 훅에서 넘어온 파일 변경 핸들러
    handleSmallFileChange,
    handleLargeFileChange
}) => {
    // 카테고리 ID를 이름으로 변환하는 헬퍼 함수
   const getCategoryName = (categoryId) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        console.warn("ProductList: categories prop이 유효한 배열이 아니거나 비어있습니다. categoryId:", categoryId, "현재 categories:", categories);
        return '알 수 없음 (목록 없음)';
    }
    const category = categories.find(cat => cat.category_id === Number(categoryId));
    return category ? category.name : '알 수 없음';
};

    // 현재 행이 수정 모드인지 확인
    const isEditingRow = (productId) => editingProduct && editingProduct.product_id === productId;

    // 선택된 파일이 있을 경우 미리보기 URL을 생성하거나, 기존 URL을 사용하는 함수
    const getPreviewImageUrl = (imageFieldPrefix) => {
        const fileField = `_${imageFieldPrefix}_file`; // 파일 객체가 저장될 필드명
        const urlField = imageFieldPrefix; // 기존 이미지 URL이 저장될 필드명

        if (!editingProduct) return DEFAULT_IMAGE_URL;

        // 1. editingProduct에 새로 선택된 File 객체가 존재하면 그것으로 미리보기 URL 생성
        if (editingProduct[fileField] instanceof File) {
            return URL.createObjectURL(editingProduct[fileField]);
        }
        // 2. 새로 선택된 파일은 없지만 기존 이미지 URL이 있다면 그것을 사용
        else if (editingProduct[urlField]) {
            return editingProduct[urlField];
        }
        // 3. 둘 다 없으면 기본 이미지
        return DEFAULT_IMAGE_URL;
    };

    return (
        <table className="w-full border-collapse mt-5">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">상품명</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-28">추천/베스트</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">브랜드</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">가격</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">카테고리</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">재고</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">메모</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">작은 사진</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">큰 사진</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">액션</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="9" className="text-center py-3 text-gray-500">상품이 없습니다.</td>
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.product_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-sm font-medium min-w-[180px]">
                                {isEditingRow(product.product_id) ? (
                                    <textarea
                                        name="name"
                                        value={editingProduct.name || ''}
                                        onChange={handleEditInputChange}
                                        rows="2"
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        style={{width: '100%', minWidth: 0, height: 'auto', overflow: 'auto', resize: 'vertical'}}
                                    />
                                ) : (
                                    product.name
                                )}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <select
                                        name="pick"
                                        value={editingProduct.pick || 'nothing'}
                                        onChange={handleEditInputChange}
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65] overflow-auto"
                                        style={{overflow: 'auto'}}
                                    >
                                        <option value="nothing">선택 안 함</option>
                                        <option value="best">베스트</option>
                                        <option value="recommend">추천</option>
                                    </select>
                                ) : (
                                    (product.pick === 'best' && '베스트') ||
                                    (product.pick === 'recommend' && '추천') ||
                                    '선택 안 함'
                                )}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="text"
                                        name="brand"
                                        value={editingProduct.brand || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        style={{width: '100%', minWidth: 0, overflow: 'auto'}}
                                    />
                                ) : (
                                    product.brand || '-'
                                )}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-sm w-24">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={editingProduct.price || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        style={{width: '100%', minWidth: 0, overflow: 'auto'}}
                                    />
                                ) : (
                                    `${product.price.toLocaleString()}원`
                                )}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <select
                                        name="category_id"
                                        value={editingProduct.category_id || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65] overflow-auto"
                                        style={{overflow: 'auto'}}
                                    >
                                        <option value="">선택</option>
                                        {categories.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    getCategoryName(product.category_id)
                                )}
                            </td>

                            <td className="border border-gray-300 px-2 py-2 text-sm w-32">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editingProduct.stock || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                        style={{width: '100%', minWidth: 0, overflow: 'auto'}}
                                    />
                                ) : (
                                    product.stock
                                )}
                            </td>

                            <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 min-w-[150px]">
                                {isEditingRow(product.product_id) ? (
                                    <textarea
                                        name="memo"
                                        value={editingProduct.memo || ''}
                                        onChange={handleEditInputChange}
                                        rows="4"
                                        className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        style={{width: '100%', minWidth: 0, height: 'auto', overflow: 'auto', resize: 'vertical'}}
                                    />
                                ) : (
                                    product.memo
                                )}
                            </td>

                            {/* 작은 사진 (파일 선택 및 미리보기) */}
                            <td className="border border-gray-300 px-2 py-0.5 text-sm text-center min-w-[100px] w-[120px]">
                                {isEditingRow(product.product_id) ? (
                                    <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                                        <img
                                            src={getPreviewImageUrl('small_photo')}
                                            alt="Small Preview"
                                            className="w-12 h-12 object-cover flex-shrink-0"
                                            onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_IMAGE_URL }}
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    handleSmallFileChange(product.product_id, e.target.files[0]);
                                                } else {
                                                    handleSmallFileChange(product.product_id, null);
                                                }
                                            }}
                                            className="w-full text-[8px] cursor-pointer block h-6 overflow-hidden"
                                        />
                                        {/* ⭐ 수정된 부분: 선택된 새 파일명이 있을 때만 표시 ⭐ */}
                                        {editingProduct._small_photo_file ? (
                                            <span className="block text-[8px] text-blue-600 truncate w-full">
                                                {editingProduct._small_photo_file.name}
                                            </span>
                                        ) : null}
                                    </div>
                                ) : (
                                    <img
                                        src={product.small_photo || DEFAULT_IMAGE_URL}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover mx-auto"
                                        onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_IMAGE_URL }}
                                    />
                                )}
                            </td>

                            {/* 큰 사진 (파일 선택 및 미리보기) */}
                            <td className="border border-gray-300 px-2 py-0.5 text-sm text-center min-w-[100px] w-[120px]">
                                {isEditingRow(product.product_id) ? (
                                    <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                                        <img
                                            src={getPreviewImageUrl('large_photo')}
                                            alt="Large Preview"
                                            className="w-12 h-12 object-cover flex-shrink-0"
                                            onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_IMAGE_URL }}
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    handleLargeFileChange(product.product_id, e.target.files[0]);
                                                } else {
                                                    handleLargeFileChange(product.product_id, null);
                                                }
                                            }}
                                            className="w-full text-[8px] cursor-pointer block h-6 overflow-hidden"
                                        />
                                        {/* ⭐ 수정된 부분: 선택된 새 파일명이 있을 때만 표시 ⭐ */}
                                        {editingProduct._large_photo_file ? (
                                            <span className="block text-[8px] text-blue-600 truncate w-full">
                                                {editingProduct._large_photo_file.name}
                                            </span>
                                        ) : null}
                                    </div>
                                ) : (
                                    <img
                                        src={product.large_photo || DEFAULT_IMAGE_URL}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover mx-auto"
                                        onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_IMAGE_URL }}
                                    />
                                )}
                            </td>

                            {/* 액션 버튼 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm w-28 text-center">
                                {isEditingRow(product.product_id) ? (
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => handleUpdateProduct(product.product_id, editingProduct)}
                                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={() => toggleEditMode(null)}
                                            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => toggleEditMode(product)}
                                            className="px-3 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5] transition-colors duration-200"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.product_id)}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 mt-1"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default ProductList;