// features/admin/product/components/ProductList.jsx
import React from 'react';

const ProductList = ({ products, editingStock, toggleStockEdit, handleStockUpdate, categories }) => {
    // 카테고리 ID를 이름으로 변환하는 헬퍼 함수
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : '알 수 없음';
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>상품명</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>가격</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>카테고리</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>재고</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>메모</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>액션</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>상품이 없습니다.</td>
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.product_id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.price.toLocaleString()}원</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{getCategoryName(product.category_id)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {editingStock[product.product_id] ? (
                                    <>
                                        <input
                                            type="number"
                                            defaultValue={product.stock}
                                            onBlur={(e) => handleStockUpdate(product.product_id, parseInt(e.target.value))}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleStockUpdate(product.product_id, parseInt(e.target.value));
                                                }
                                            }}
                                            style={{ width: '60px', padding: '5px' }}
                                        />
                                        <button onClick={() => toggleStockEdit(product.product_id)} style={{ marginLeft: '5px', padding: '5px 10px' }}>취소</button>
                                    </>
                                ) : (
                                    <>
                                        {product.stock}
                                        <button onClick={() => toggleStockEdit(product.product_id)} style={{ marginLeft: '10px', padding: '5px 10px' }}>수정</button>
                                    </>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.memo}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
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