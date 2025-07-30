// features/admin/product/components/ProductAddForm.jsx
import React from 'react';

const ProductAddForm = ({
    showAddForm,
    toggleAddForm,
    newProduct,
    handleInputChange,
    handleAddProduct,
    categories,
    lineup,
    // 새롭게 추가되는 props (작은 사진, 큰 사진 각각 관리)
    // ⭐⭐ 여기 이름들을 useProductManagement의 함수 이름과 일치시킴 ⭐⭐
    handleNewProductSmallFileChange, // 이름 변경: handleSmallFileChange -> handleNewProductSmallFileChange
    handleNewProductLargeFileChange, // 이름 변경: handleLargeFileChange -> handleNewProductLargeFileChange
    uploadingSmallImage,
    uploadingLargeImage,
    smallImageUploadMessage,
    largeImageUploadMessage,
}) => {
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
                        {/* 상품명 필드 */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                                placeholder="상품명을 입력하세요"
                            />
                        </div>

                        {/* 브랜드명 필드 - 이제 필수 입력입니다. */}
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                브랜드명 *
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={newProduct.brand}
                                onChange={handleInputChange}
                                required // required 속성 추가
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                                placeholder="브랜드명을 입력하세요"
                            />
                        </div>

                        {/* 원산지 필드 - 이제 필수 입력입니다. */}
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                원산지 *
                            </label>
                            <input
                                type="text"
                                name="origin" // 'origin'으로 name 설정
                                value={newProduct.origin}
                                onChange={handleInputChange}
                                required // required 속성 추가
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                                placeholder="원산지를 입력하세요"
                            />
                        </div>

                        {/* 모델명 필드 (null 허용) */}
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                모델명
                            </label>
                            <input
                                type="text"
                                name="model_name" // 'model_name'으로 name 설정
                                value={newProduct.model_name}
                                onChange={handleInputChange}
                                // required 속성 제거하여 null 허용 (이전과 동일)
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거 및 색상 오타 수정
                                placeholder="모델명을 입력하세요 (선택 사항)"
                            />
                        </div>

                        {/* 가격 필드 */}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                                placeholder="가격을 입력하세요"
                            />
                        </div>

                         {/* 재고 필드 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                재고
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                                placeholder="재고 수량"
                            />
                        </div>

                        {/* 카테고리 필드 */}
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                카테고리 *
                            </label>
                            <select
                                name="category_id"
                                value={newProduct.category_id}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* 카테고리 필드 */}
                        <div>
                            <label className="block text-sm font-medium text-[#58bcb5] mb-2">
                                라인업 *
                            </label>
                            <select
                                name="lineup_id"
                                value={newProduct.lineup_id}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                            >
                                <option value="">라인업 선택</option>
                                {lineup.map(cat => (
                                    <option key={cat.lineup_id} value={cat.lineup_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>


                        {/* ⭐⭐ 3단계 카테고리 이름 필드 추가 ⭐⭐ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                세부 카테고리 이름
                            </label>
                            <input
                                type="text"
                                name="sub2_category_name"
                                value={newProduct.sub2_category_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
                                placeholder="세부 카테고리 이름을 입력하세요 (선택 사항)"
                            />
                        </div>

                        {/* ⭐⭐ 유튜브 URL 필드 추가 ⭐⭐ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                유튜브 URL
                            </label>
                            <input
                                name="youtube_url"
                                value={newProduct.youtube_url}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]"
                                placeholder="유튜브 임베드 URL을 입력하세요 (선택 사항)"
                            />
                        </div>
                    </div>

                    {/* 메모 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            메모
                        </label>
                        <textarea
                            name="memo"
                            value={newProduct.memo}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#306f65]" // focus:border-transparent 제거
                            placeholder="상품에 대한 메모를 입력하세요"
                        />
                    </div>

                    {/* 작은 사진 업로드 필드 */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            작은 사진 업로드
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewProductSmallFileChange} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e6f4f2] file:text-[#306f65] hover:file:bg-[#d8edea]"
                        />
                        {uploadingSmallImage && <p className="mt-2 text-sm text-blue-600">작은 사진 업로드 중...</p>}
                        {smallImageUploadMessage && !uploadingSmallImage && <p className="mt-2 text-sm text-gray-600">{smallImageUploadMessage}</p>}
                        {newProduct.small_photo && (
                            <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">현재 작은 사진:</p>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${newProduct.small_photo}`}
                                    alt="작은 사진 미리보기"
                                    className="mt-1 max-w-[150px] h-auto rounded-md border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* 큰 사진 업로드 필드 */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            큰 사진 업로드
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewProductLargeFileChange} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e6f4f2] file:text-[#306f65] hover:file:bg-[#d8edea]"
                        />
                        {uploadingLargeImage && <p className="mt-2 text-sm text-blue-600">큰 사진 업로드 중...</p>}
                        {largeImageUploadMessage && !uploadingLargeImage && <p className="mt-2 text-sm text-gray-600">{largeImageUploadMessage}</p>}
                        {newProduct.large_photo && (
                            <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">현재 큰 사진:</p>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${newProduct.large_photo}`}
                                    alt="큰 사진 미리보기"
                                    className="mt-1 max-w-[150px] h-auto rounded-md border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            // 작은 사진 또는 큰 사진 업로드 중이면 버튼 비활성화
                            disabled={uploadingSmallImage || uploadingLargeImage}
                            className="px-6 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(uploadingSmallImage || uploadingLargeImage) ? '이미지 업로드 중...' : '상품 추가'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProductAddForm;
