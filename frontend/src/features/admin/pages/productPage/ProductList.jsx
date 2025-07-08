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
    // --- 여기에 handleDeleteProduct prop 추가 ---
    handleDeleteProduct 
    // --- 추가 끝 ---
}) => {
    // 카테고리 ID를 이름으로 변환하는 헬퍼 함수
   const getCategoryName = (categoryId) => {
    // categories가 배열이 아니거나 비어있을 경우 방어
    if (!Array.isArray(categories) || categories.length === 0) {
        console.warn("ProductList: categories prop이 유효한 배열이 아니거나 비어있습니다. categoryId:", categoryId, "현재 categories:", categories);
        return '알 수 없음 (목록 없음)'; // 명확한 메시지로 변경
    }
    // categoryId를 숫자로 명시적으로 변환하여 비교 (백엔드에서 문자열로 올 수 있기 때문)
    const category = categories.find(cat => cat.category_id === Number(categoryId));
    return category ? category.name : '알 수 없음';
};

    // 현재 행이 수정 모드인지 확인
    const isEditingRow = (productId) => editingProduct && editingProduct.product_id === productId;

    return (
        <table className="w-full border-collapse mt-5">
            <thead>
                <tr className="bg-gray-100">
                    {/* ID 컬럼 제거 */}
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">상품명</th>
                    {/* 새로운 '추천/베스트' 컬럼 추가 */}
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
                        {/* ID 컬럼 제거로 인한 colSpan 조정 (기존 10 -> 9) */}
                        <td colSpan="9" className="text-center py-3 text-gray-500">상품이 없습니다.</td> 
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.product_id} className="hover:bg-gray-50">
                            {/* ID 컬럼 제거 */}
                            
                            {/* 상품명 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm font-medium min-w-[180px]">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingProduct.name || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                    />
                                ) : (
                                    product.name
                                )}
                            </td>

                            {/* 추천/베스트 SELECT 박스 추가 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <select
                                        name="pick" // DB 컬럼 이름과 동일하게 설정
                                        value={editingProduct.pick || 'nothing'} // 'nothing'이 기본값이 되도록 설정
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                    >
                                        <option value="nothing">선택 안 함</option> {/* nothing 표현 */}
                                        <option value="best">베스트</option>
                                        <option value="recommend">추천</option>
                                    </select>
                                ) : (
                                    // 수정 모드가 아닐 때 pick 값 표시
                                    // product.pick이 없으면 '선택 안 함'으로 표시
                                    (product.pick === 'best' && '베스트') ||
                                    (product.pick === 'recommend' && '추천') ||
                                    '선택 안 함' 
                                )}
                            </td>

                            {/* 브랜드 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="text"
                                        name="brand"
                                        value={editingProduct.brand || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                    />
                                ) : (
                                    product.brand || '-'
                                )}
                            </td>

                            {/* 가격 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm w-24">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={editingProduct.price || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                    />
                                ) : (
                                    `${product.price.toLocaleString()}원`
                                )}
                            </td>

                            {/* 카테고리 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">
                                {isEditingRow(product.product_id) ? (
                                    <select
                                        name="category_id"
                                        value={editingProduct.category_id || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
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

                            {/* 재고 */}
                            <td className="border border-gray-300 px-2 py-2 text-sm w-32">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editingProduct.stock || ''}
                                        onChange={handleEditInputChange}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                    />
                                ) : (
                                    product.stock
                                )}
                            </td>

                            {/* 메모 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 min-w-[150px]">
                                {isEditingRow(product.product_id) ? (
                                    <textarea
                                        name="memo"
                                        value={editingProduct.memo || ''}
                                        onChange={handleEditInputChange}
                                        rows="2"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                    />
                                ) : (
                                    product.memo
                                )}
                            </td>

                            {/* 작은 사진 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center min-w-[100px] w-[120px]">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="text" 
                                        name="small_photo"
                                        value={editingProduct.small_photo || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        placeholder="URL 입력"
                                    />
                                ) : (
                                    <img 
                                        src={product.small_photo || DEFAULT_IMAGE_URL} 
                                        alt={product.name} 
                                        className="w-16 h-16 object-cover mx-auto" 
                                        onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_IMAGE_URL }} 
                                    />
                                )}
                            </td>

                            {/* 큰 사진 */}
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center min-w-[100px] w-[120px]">
                                {isEditingRow(product.product_id) ? (
                                    <input
                                        type="text" 
                                        name="large_photo"
                                        value={editingProduct.large_photo || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#306f65]"
                                        placeholder="URL 입력"
                                    />
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
                                    <div className="flex flex-col gap-1"> {/* 버튼 두 개를 감싸기 위해 div 추가 */}
                                        <button 
                                            onClick={() => toggleEditMode(product)} 
                                            className="px-3 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5] transition-colors duration-200"
                                        >
                                            수정
                                        </button>
                                        {/* --- 삭제 버튼 추가 --- */}
                                        <button
                                            onClick={() => handleDeleteProduct(product.product_id)} // product_id를 인자로 전달
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 mt-1" // 간격 추가
                                        >
                                            삭제
                                        </button>
                                        {/* --- 추가 끝 --- */}
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