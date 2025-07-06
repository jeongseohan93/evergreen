// features/admin/product/components/ProductList.jsx
import React from 'react';

const ProductList = ({ products, editingStock, toggleStockEdit, handleStockUpdate, categories }) => {
    // 카테고리 ID를 이름으로 변환하는 헬퍼 함수
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : '알 수 없음';
    };

    return (
        <table className="w-full border-collapse mt-5">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">상품명</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">가격</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">카테고리</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">재고</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">메모</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">액션</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="text-center py-3 text-gray-500">상품이 없습니다.</td>
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.product_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-2 text-sm w-16">{product.product_id}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm font-medium min-w-[200px]">{product.name}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm w-24">{product.price.toLocaleString()}원</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm w-28">{getCategoryName(product.category_id)}</td>
                            <td className="border border-gray-300 px-2 py-2 text-sm w-32">
                                {editingStock[product.product_id] ? (
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="number"
                                            defaultValue={product.stock}
                                            onBlur={(e) => handleStockUpdate(product.product_id, parseInt(e.target.value))}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleStockUpdate(product.product_id, parseInt(e.target.value));
                                                }
                                            }}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                        />
                                        <button 
                                            onClick={() => toggleStockEdit(product.product_id)} 
                                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap"
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span>{product.stock}</span>
                                        <button 
                                            onClick={() => toggleStockEdit(product.product_id)} 
                                            className="px-2 py-1 text-xs bg-[#306f65] text-white rounded hover:bg-[#58bcb5] transition-colors duration-200 whitespace-nowrap"
                                        >
                                            수정
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600 min-w-[150px]">{product.memo}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm w-20">
                                {/* 다른 액션 버튼 (삭제 등) */}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default ProductList;