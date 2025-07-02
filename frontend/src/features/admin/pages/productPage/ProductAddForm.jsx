// features/admin/product/components/ProductAddForm.jsx
import React from 'react';

const ProductAddForm = ({ showAddForm, toggleAddForm, newProduct, handleInputChange, handleAddProduct, categories }) => {
    return (
        <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
            <button onClick={toggleAddForm} style={{ padding: '10px 20px', marginBottom: '15px' }}>
                {showAddForm ? '상품 추가 폼 닫기' : '새 상품 추가'}
            </button>

            {showAddForm && (
                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3>새 상품 추가</h3>
                    <label>
                        상품명:
                        <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <label>
                        가격:
                        <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <label>
                        카테고리:
                        <select name="category_id" value={newProduct.category_id} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
                            <option value="">카테고리 선택</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        재고:
                        <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <label>
                        메모:
                        <textarea name="memo" value={newProduct.memo} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <label>
                        작은 사진 URL:
                        <input type="text" name="small_photo" value={newProduct.small_photo} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <label>
                        큰 사진 URL:
                        <input type="text" name="large_photo" value={newProduct.large_photo} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                    </label>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>상품 추가</button>
                </form>
            )}
        </div>
    );
};

export default ProductAddForm;