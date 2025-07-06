// features/admin/product/components/ProductAddForm.jsx
import React from 'react';

const ProductAddForm = ({ showAddForm, toggleAddForm, newProduct, handleInputChange, handleAddProduct, categories }) => {
    return (
        <div className="mb-6 p-6 bg-white rounded-lg border border-[#306f65]">
            <button 
                onClick={toggleAddForm} 
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    showAddForm 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                        : 'bg-[#306f65] text-white hover:bg-[#58bcb5] hover:shadow-lg'
                }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {showAddForm ? '상품 추가 폼 닫기' : '새 상품 추가'}
            </button>

            {showAddForm && (
                <form onSubmit={handleAddProduct} className="mt-6 space-y-4">
                    <h3 className="text-2xl font-bold font-aggro text-gray-800 mb-4">새 상품 추가</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                상품명 *
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                value={newProduct.name} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                placeholder="상품명을 입력하세요"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                가격 *
                            </label>
                            <input 
                                type="number" 
                                name="price" 
                                value={newProduct.price} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                placeholder="가격을 입력하세요"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                카테고리 *
                            </label>
                            <select 
                                name="category_id" 
                                value={newProduct.category_id} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                재고
                            </label>
                            <input 
                                type="number" 
                                name="stock" 
                                value={newProduct.stock} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                placeholder="재고 수량"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            메모
                        </label>
                        <textarea 
                            name="memo" 
                            value={newProduct.memo} 
                            onChange={handleInputChange} 
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                            placeholder="상품에 대한 메모를 입력하세요"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                작은 사진 URL
                            </label>
                            <input 
                                type="text" 
                                name="small_photo" 
                                value={newProduct.small_photo} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                placeholder="작은 사진 URL을 입력하세요"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                큰 사진 URL
                            </label>
                            <input 
                                type="text" 
                                name="large_photo" 
                                value={newProduct.large_photo} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65] focus:border-transparent"
                                placeholder="큰 사진 URL을 입력하세요"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
                        >
                            상품 추가
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProductAddForm;