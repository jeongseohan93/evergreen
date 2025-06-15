import React, { useState, useEffect } from 'react';
import { productApi } from '../../services/admin/adminProductApi';
import './dashBoard.css';

const DashBoard = () => {
    // 상태 관리
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingStock, setEditingStock] = useState({});
    
    // 상품 추가 관련 상태
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category_id: '',
        memo: '',
        stock: '',
        small_photo: '',
        large_photo: ''
    });
    
    // 카테고리 관련 상태
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showDeleteCategoryForm, setShowDeleteCategoryForm] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState('');

    // 컴포넌트 마운트 시 모든 상품 조회
    useEffect(() => {
        fetchAllProducts();
        fetchCategories();
    }, []);

    // 모든 상품 조회
    const fetchAllProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await productApi.getAllProducts();
            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message || '상품을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 조회 오류:', error);
            setError('상품을 불러오는 도중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 조회
    const fetchCategories = async () => {
        try {
            const response = await productApi.getCategories();
            if (response.success) {
                setCategories(response.data);
            } else {
                console.error('카테고리 조회 실패:', response.message);
            }
        } catch (error) {
            console.error('카테고리 조회 오류:', error);
        }
    };

    // 검색 초기화
    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults([]);
        setIsSearching(false);
        setError('');
    };

    // 상품 검색
    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setError('검색 키워드를 입력하세요');
            return;
        }

        setLoading(true);
        setError('');
        setIsSearching(true);
        try {
            const response = await productApi.searchProducts(searchKeyword);
            if (response.success) {
                setSearchResults(response.data);
            } else {
                setError(response.message || '검색에 실패했습니다.');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('검색 오류:', error);
            setError('검색 중 오류가 발생했습니다.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // 재고 수정
    const handleStockUpdate = async (productId, newStock) => {
        if (newStock < 0) {
            setError('재고는 0 이상이어야 합니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await productApi.updateStock(productId, newStock);
            if (response.success) {
                // 성공 시 상품 목록 업데이트
                setProducts(prevProducts => 
                    prevProducts.map(product => 
                        product.product_id === productId 
                            ? { ...product, stock: newStock }
                            : product
                    )
                );
                setSearchResults(prevResults => 
                    prevResults.map(product => 
                        product.product_id === productId 
                            ? { ...product, stock: newStock }
                            : product
                    )
                );
                setEditingStock(prev => ({ ...prev, [productId]: false }));
            } else {
                setError(response.message || '재고 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('재고 수정 오류:', error);
            setError('재고 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 재고 편집 모드 토글
    const toggleStockEdit = (productId) => {
        setEditingStock(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    // 상품 추가 폼 토글
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) {
            // 폼을 열 때 초기화
            setNewProduct({
                name: '',
                price: '',
                category_id: '',
                memo: '',
                stock: '',
                small_photo: '',
                large_photo: ''
            });
        }
    };

    // 새 상품 입력 필드 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 상품 추가
    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        if (!newProduct.name || !newProduct.price || !newProduct.category_id) {
            setError('상품명, 가격, 카테고리는 필수 입력 항목입니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await productApi.addProduct(newProduct);
            if (response.success) {
                // 성공 시 상품 목록 새로고침
                await fetchAllProducts();
                setShowAddForm(false);
                setNewProduct({
                    name: '',
                    price: '',
                    category_id: '',
                    memo: '',
                    stock: '',
                    small_photo: '',
                    large_photo: ''
                });
            } else {
                setError(response.message || '상품 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('상품 추가 오류:', error);
            setError('상품 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 추가
    const handleAddCategory = async (e) => {
        e.preventDefault();
        
        if (!newCategoryName.trim()) {
            setError('카테고리명을 입력하세요');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await productApi.addCategory(newCategoryName);
            if (response.success) {
                // 성공 시 카테고리 목록 새로고침
                await fetchCategories();
                setShowCategoryForm(false);
                setNewCategoryName('');
            } else {
                setError(response.message || '카테고리 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('카테고리 추가 오류:', error);
            setError('카테고리 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 삭제
    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        
        if (!selectedCategoryToDelete) {
            setError('삭제할 카테고리를 선택하세요');
            return;
        }

        const selectedCategory = categories.find(cat => cat.category_id.toString() === selectedCategoryToDelete);
        if (!selectedCategory) {
            setError('선택된 카테고리를 찾을 수 없습니다.');
            return;
        }

        if (!window.confirm(`"${selectedCategory.name}" 카테고리를 삭제하시겠습니까?`)) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await productApi.deleteCategory(selectedCategory.category_id);
            if (response.success) {
                // 성공 시 카테고리 목록 새로고침
                await fetchCategories();
                setShowDeleteCategoryForm(false);
                setSelectedCategoryToDelete('');
            } else {
                setError(response.message || '카테고리 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('카테고리 삭제 오류:', error);
            setError('카테고리 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 폼 토글
    const toggleCategoryForm = () => {
        setShowCategoryForm(!showCategoryForm);
        if (!showCategoryForm) {
            setNewCategoryName('');
        }
    };

    // 카테고리 삭제 폼 토글
    const toggleDeleteCategoryForm = () => {
        setShowDeleteCategoryForm(!showDeleteCategoryForm);
        if (!showDeleteCategoryForm) {
            setSelectedCategoryToDelete('');
        }
    };

    // 상품 목록 렌더링
    const renderProductList = (productList, title) => (
        <div className="product-section">
            <h2>{title}</h2>
            {productList.length === 0 ? (
                <p>상품이 없습니다.</p>
            ) : (
                <div className="product-grid">
                    {productList.map(product => (
                        <div key={product.product_id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>가격: {product.price?.toLocaleString()}원</p>
                            <div className="stock-section">
                                <span>재고: </span>
                                {editingStock[product.product_id] ? (
                                    <div className="stock-edit">
                                        <input
                                            type="number"
                                            min="0"
                                            defaultValue={product.stock}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleStockUpdate(product.product_id, parseInt(e.target.value));
                                                }
                                            }}
                                            onBlur={(e) => {
                                                handleStockUpdate(product.product_id, parseInt(e.target.value));
                                            }}
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="stock-display">
                                        <span>{product.stock}</span>
                                        <button 
                                            onClick={() => toggleStockEdit(product.product_id)}
                                            className="edit-btn"
                                        >
                                            수정
                                        </button>
                                    </div>
                                )}
                            </div>
                            {product.description && (
                                <p className="description">{product.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // 상품 추가 폼 렌더링
    const renderAddProductForm = () => (
        <div className="add-product-section">
            <h2>새 상품 추가</h2>
            <form onSubmit={handleAddProduct} className="add-product-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">상품명 *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            required
                            placeholder="상품명을 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">가격 *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            required
                            min="1"
                            placeholder="가격을 입력하세요"
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category_id">카테고리 *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={newProduct.category_id}
                            onChange={handleInputChange}
                            required
                            className="category-select"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">재고</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="재고를 입력하세요 (기본값: 0)"
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="memo">상품 설명</label>
                    <textarea
                        id="memo"
                        name="memo"
                        value={newProduct.memo}
                        onChange={handleInputChange}
                        placeholder="상품에 대한 설명을 입력하세요"
                        rows="3"
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="small_photo">썸네일 이미지 URL</label>
                        <input
                            type="url"
                            id="small_photo"
                            name="small_photo"
                            value={newProduct.small_photo}
                            onChange={handleInputChange}
                            placeholder="썸네일 이미지 URL을 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="large_photo">상세 이미지 URL</label>
                        <input
                            type="url"
                            id="large_photo"
                            name="large_photo"
                            value={newProduct.large_photo}
                            onChange={handleInputChange}
                            placeholder="상세 이미지 URL을 입력하세요"
                        />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? '추가 중...' : '상품 추가'}
                    </button>
                    <button type="button" onClick={toggleAddForm} className="cancel-btn">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );

    // 카테고리 추가 폼 렌더링
    const renderAddCategoryForm = () => (
        <div className="add-category-section">
            <h2>새 카테고리 추가</h2>
            <form onSubmit={handleAddCategory} className="add-category-form">
                <div className="form-group">
                    <label htmlFor="categoryName">카테고리명 *</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                        placeholder="카테고리명을 입력하세요"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? '추가 중...' : '카테고리 추가'}
                    </button>
                    <button type="button" onClick={toggleCategoryForm} className="cancel-btn">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );

    // 카테고리 삭제 폼 렌더링
    const renderDeleteCategoryForm = () => (
        <div className="delete-category-section">
            <h2>카테고리 삭제</h2>
            <form onSubmit={handleDeleteCategory} className="delete-category-form">
                <div className="form-group">
                    <label htmlFor="categoryToDelete">삭제할 카테고리 선택 *</label>
                    <select
                        id="categoryToDelete"
                        value={selectedCategoryToDelete}
                        onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
                        required
                        className="category-select"
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name} (ID: {category.category_id})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loading} className="delete-submit-btn">
                        {loading ? '삭제 중...' : '카테고리 삭제'}
                    </button>
                    <button type="button" onClick={toggleDeleteCategoryForm} className="cancel-btn">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="dashboard">
            <h1>관리자 대시보드</h1>
            
            {/* 액션 버튼들 */}
            <div className="action-buttons">
                <button 
                    onClick={toggleAddForm} 
                    className={`add-product-btn ${showAddForm ? 'active' : ''}`}
                >
                    {showAddForm ? '상품 추가 취소' : '새 상품 추가'}
                </button>
                <button 
                    onClick={toggleCategoryForm} 
                    className={`add-category-btn ${showCategoryForm ? 'active' : ''}`}
                >
                    {showCategoryForm ? '카테고리 추가 취소' : '새 카테고리 추가'}
                </button>
                <button 
                    onClick={toggleDeleteCategoryForm} 
                    className={`delete-category-btn ${showDeleteCategoryForm ? 'active' : ''}`}
                >
                    {showDeleteCategoryForm ? '카테고리 삭제 취소' : '카테고리 삭제'}
                </button>
            </div>
            
            {/* 카테고리 추가 폼 */}
            {showCategoryForm && renderAddCategoryForm()}
            
            {/* 카테고리 삭제 폼 */}
            {showDeleteCategoryForm && renderDeleteCategoryForm()}
            
            {/* 상품 추가 폼 */}
            {showAddForm && renderAddProductForm()}
            
            {/* 검색 섹션 */}
            <div className="search-section">
                <h2>상품 검색</h2>
                {isSearching && (
                    <div className="search-results-header">
                        <p className="search-info">"{searchKeyword}" 검색 결과</p>
                        <button onClick={clearSearch} className="clear-search-btn">
                            전체 목록으로 돌아가기
                        </button>
                    </div>
                )}
                <div className={`search-input ${isSearching ? 'search-input-compact' : ''}`}>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder={isSearching ? "새로운 검색어를 입력하세요" : "상품명을 입력하세요"}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    {isSearching ? (
                        <button onClick={handleSearch} disabled={loading} className="new-search-btn">
                            {loading ? '검색 중...' : '새 검색'}
                        </button>
                    ) : (
                        <button onClick={handleSearch} disabled={loading}>
                            {loading ? '검색 중...' : '검색'}
                        </button>
                    )}
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* 로딩 상태 */}
            {loading && (
                <div className="loading">
                    처리 중...
                </div>
            )}

            {/* 검색 결과 또는 전체 상품 목록 */}
            {isSearching ? (
                renderProductList(searchResults, '검색 결과')
            ) : (
                renderProductList(products, '전체 상품 목록')
            )}
        </div>
    );
};

export default DashBoard;