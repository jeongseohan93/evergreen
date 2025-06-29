import React, { useState, useEffect } from 'react';
import { productApi } from '../../services/admin/adminProductApi';
import { parcelApi } from '../../services/admin/adminParcelApi';
import { saleApi } from '../../services/admin/adminSaleApi';
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

    // 택배 관리 관련 상태
    const [deliveries, setDeliveries] = useState([]);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState({});
    const [showDelayedOnly, setShowDelayedOnly] = useState(false); // 지연 배송만 보기
    const [selectedDate, setSelectedDate] = useState(''); // 선택된 날짜
    const [showDateFilter, setShowDateFilter] = useState(false); // 날짜 필터 표시 여부

    // 매출 관리 관련 상태
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [newSale, setNewSale] = useState({
        sale_date: '',
        offline_amount: '',
        memo: ''
    });
    const [salesData, setSalesData] = useState({
        daily: [],
        monthly: [],
        yearly: []
    });
    const [selectedSalePeriod, setSelectedSalePeriod] = useState('daily'); // daily, monthly, yearly
    const [selectedSaleYear, setSelectedSaleYear] = useState(new Date().getFullYear());
    const [selectedSaleMonth, setSelectedSaleMonth] = useState(new Date().getMonth() + 1);

    // 메모 Modal 관련 상태
    const [showMemoModal, setShowMemoModal] = useState(false);
    const [selectedMemoData, setSelectedMemoData] = useState(null);

    // 버튼 방식 날짜 선택 함수들
    const handleYearChange = (direction) => {
        if (direction === 'prev') {
            setSelectedSaleYear(prev => prev - 1);
        } else {
            setSelectedSaleYear(prev => prev + 1);
        }
    };

    const handleMonthSelect = (month) => {
        setSelectedSaleMonth(month);
    };

    const selectToday = () => {
        const today = new Date();
        setSelectedSaleYear(today.getFullYear());
        setSelectedSaleMonth(today.getMonth() + 1);
    };

    const selectThisMonth = () => {
        const today = new Date();
        setSelectedSaleYear(today.getFullYear());
        setSelectedSaleMonth(today.getMonth() + 1);
    };

    // 매출 입력 관련 함수들
    const selectSaleDate = (dateString) => {
        setNewSale(prev => ({ ...prev, sale_date: dateString }));
    };

    const selectSaleDateToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        selectSaleDate(`${year}-${month}-${day}`);
    };

    // 메모 Modal 관련 함수들
    const openMemoModal = (saleData) => {
        setSelectedMemoData(saleData);
        setShowMemoModal(true);
    };

    const closeMemoModal = () => {
        setShowMemoModal(false);
        setSelectedMemoData(null);
    };

    // 컴포넌트 마운트 시 모든 상품 조회
    useEffect(() => {
        fetchAllProducts();
        fetchCategories();
        fetchAllDeliveries();
        fetchSalesData();
    }, []);

    // 날짜 선택 변경 시 매출 데이터 다시 불러오기
    useEffect(() => {
        fetchSalesData();
    }, [selectedSalePeriod, selectedSaleYear, selectedSaleMonth]);

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

    // ==================== 택배 관리 함수들 ====================
    
    // 모든 배송 현황 조회
    const fetchAllDeliveries = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await parcelApi.getAllDeliveries();
            if (response.success) {
                setDeliveries(response.data);
            } else {
                // 데이터가 없거나 실패한 경우 빈 배열로 설정 (에러 메시지 표시 안함)
                setDeliveries([]);
                console.log('배송 데이터 없음:', response.message);
            }
        } catch (error) {
            console.error('배송 현황 조회 오류:', error);
            // 네트워크 오류 등 실제 오류가 아닌 경우에도 빈 배열로 설정
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    };

    // 배송 상태 업데이트
    const handleDeliveryStatusUpdate = async (orderId, status, trackingNumber, deliveryCompany) => {
        setLoading(true);
        setError('');
        try {
            const response = await parcelApi.updateDeliveryStatus(orderId, status, trackingNumber, deliveryCompany);
            if (response.success) {
                // 성공 시 배송 목록 업데이트
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: status,
                                tracking_number: trackingNumber,
                                delivery_company: deliveryCompany
                              }
                            : delivery
                    )
                );
                setEditingDelivery(prev => ({ ...prev, [orderId]: false }));
            } else {
                setError(response.message || '배송 상태 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('배송 상태 업데이트 오류:', error);
            setError('배송 상태 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 택배 추적
    const handleTrackParcel = async (trackingNumber, carrier = 'korea-post') => {
        if (!trackingNumber) {
            setError('운송장 번호를 입력하세요');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await parcelApi.trackParcel(trackingNumber, carrier);
            if (response.success) {
                setTrackingInfo(response.data);
                setShowTrackingModal(true);
            } else {
                setError(response.message || '택배 추적에 실패했습니다.');
            }
        } catch (error) {
            console.error('택배 추적 오류:', error);
            setError('택배 추적 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 배송 완료 처리
    const handleCompleteDelivery = async (orderId) => {
        if (!window.confirm('배송을 완료 처리하시겠습니까?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await parcelApi.completeDelivery(orderId);
            if (response.success) {
                // 성공 시 배송 목록 업데이트
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: 'delivered',
                                delivered_at: new Date()
                              }
                            : delivery
                    )
                );
            } else {
                setError(response.message || '배송 완료 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('배송 완료 처리 오류:', error);
            setError('배송 완료 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 배송 취소 처리
    const handleCancelDelivery = async (orderId) => {
        const reason = window.prompt('취소 사유를 입력하세요:');
        if (!reason) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await parcelApi.cancelDelivery(orderId, reason);
            if (response.success) {
                // 성공 시 배송 목록 업데이트
                setDeliveries(prevDeliveries => 
                    prevDeliveries.map(delivery => 
                        delivery.order_id === orderId 
                            ? { 
                                ...delivery, 
                                status: 'cancelled',
                                cancelled_at: new Date(),
                                cancel_reason: reason
                              }
                            : delivery
                    )
                );
            } else {
                setError(response.message || '배송 취소 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('배송 취소 처리 오류:', error);
            setError('배송 취소 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 배송 편집 모드 토글
    const toggleDeliveryEdit = (orderId) => {
        setEditingDelivery(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    // 배송 상태 텍스트 변환
    const getStatusText = (status) => {
        const statusMap = {
            'pending': '대기',
            'paid': '결제완료',
            'shipping': '배송중',
            'delivered': '배송완료',
            'cancelled': '취소'
        };
        return statusMap[status] || status;
    };

    // 배송 상태 색상 클래스
    const getStatusClass = (status) => {
        const statusClassMap = {
            'pending': 'status-pending',
            'paid': 'status-paid',
            'shipping': 'status-shipping',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusClassMap[status] || 'status-default';
    };

    // 지연 배송 통계 계산
    const getDelayStats = () => {
        const delayedOrders = deliveries.filter(delivery => delivery.isDelayed);
        return {
            total: deliveries.length,
            delayed: delayedOrders.length,
            delayedPercentage: deliveries.length > 0 ? Math.round((delayedOrders.length / deliveries.length) * 100) : 0
        };
    };

    // 필터링된 배송 목록
    const getFilteredDeliveries = () => {
        let filtered = deliveries;
        
        // 날짜 필터 적용
        filtered = getDateFilteredDeliveries(filtered);
        
        // 지연 배송 필터 적용
        if (showDelayedOnly) {
            filtered = filtered.filter(delivery => delivery.isDelayed);
        }
        
        return filtered;
    };

    // 지연 배송 필터 토글
    const toggleDelayedFilter = () => {
        setShowDelayedOnly(!showDelayedOnly);
    };

    // 날짜 필터링 함수
    const getDateFilteredDeliveries = (deliveries) => {
        if (!selectedDate) return deliveries;
        
        const selectedDateObj = new Date(selectedDate);
        const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
        
        return deliveries.filter(delivery => {
            const deliveryDate = new Date(delivery.created_at);
            return deliveryDate >= startOfDay && deliveryDate <= endOfDay;
        });
    };

    // 날짜 필터 토글
    const toggleDateFilter = () => {
        setShowDateFilter(!showDateFilter);
        if (!showDateFilter) {
            setSelectedDate(''); // 필터 열 때 날짜 초기화
        }
    };

    // 날짜 선택 핸들러
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // 날짜 필터 초기화
    const clearDateFilter = () => {
        setSelectedDate('');
        setShowDateFilter(false);
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

    // 배송 목록 렌더링
    const renderDeliveryList = () => {
        const delayStats = getDelayStats();
        const filteredDeliveries = getFilteredDeliveries();

        return (
            <div className="delivery-section">
                <h2>배송 관리</h2>
                
                {/* 지연 배송 통계 */}
                {delayStats.delayed > 0 && (
                    <div className="delay-stats">
                        <h3>⚠️ 지연 배송 현황</h3>
                        <div className="delay-count">
                            {delayStats.delayed} / {delayStats.total} 건 ({delayStats.delayedPercentage}%)
                        </div>
                    </div>
                )}

                {/* 필터 버튼 */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button 
                        onClick={toggleDelayedFilter}
                        className={`delay-filter-btn ${showDelayedOnly ? 'active' : ''}`}
                    >
                        {showDelayedOnly ? '전체 보기' : '지연 배송만 보기'}
                    </button>
                    
                    <button 
                        onClick={toggleDateFilter}
                        className={`delay-filter-btn ${showDateFilter ? 'active' : ''}`}
                        style={{ backgroundColor: showDateFilter ? '#6c757d' : '#17a2b8' }}
                    >
                        {showDateFilter ? '날짜 필터 닫기' : '날짜별 조회'}
                    </button>
                </div>

                {/* 날짜 필터 UI */}
                {showDateFilter && (
                    <div style={{ 
                        marginBottom: '20px', 
                        textAlign: 'center',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <label htmlFor="dateFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                            주문일 선택:
                        </label>
                        <input
                            type="date"
                            id="dateFilter"
                            value={selectedDate}
                            onChange={handleDateChange}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                marginRight: '10px'
                            }}
                        />
                        {selectedDate && (
                            <button 
                                onClick={clearDateFilter}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                초기화
                            </button>
                        )}
                        {selectedDate && (
                            <div style={{ marginTop: '10px', color: '#666' }}>
                                📅 {selectedDate} 주문건 조회
                            </div>
                        )}
                    </div>
                )}

                {filteredDeliveries.length === 0 ? (
                    <p>
                        {showDelayedOnly && selectedDate 
                            ? `${selectedDate} 날짜의 지연 배송이 없습니다.`
                            : showDelayedOnly 
                            ? '지연 배송이 없습니다.'
                            : selectedDate 
                            ? `${selectedDate} 날짜의 주문이 없습니다.`
                            : '배송 내역이 없습니다.'
                        }
                    </p>
                ) : (
                    <div className="delivery-grid">
                        {filteredDeliveries.map(delivery => (
                            <div key={delivery.order_id} className={`delivery-card ${delivery.isDelayed ? 'delayed-order' : ''}`}>
                                {/* 지연 배송 경고 배지 */}
                                {delivery.isDelayed && (
                                    <div className="delay-warning">
                                        ⚠️ {delivery.delayDays}일 지연
                                    </div>
                                )}

                                <div className="delivery-header">
                                    <h3>주문 #{delivery.order_id}</h3>
                                    <span className={`status-badge ${getStatusClass(delivery.status)}`}>
                                        {getStatusText(delivery.status)}
                                    </span>
                                </div>
                                
                                <div className="delivery-info">
                                    <p><strong>고객:</strong> {delivery.User?.name || 'N/A'}</p>
                                    <p><strong>이메일:</strong> {delivery.User?.email || 'N/A'}</p>
                                    <p><strong>전화:</strong> {delivery.User?.phone || 'N/A'}</p>
                                    <p><strong>총 금액:</strong> {delivery.total_amount?.toLocaleString()}원</p>
                                    <p><strong>주문일:</strong> {new Date(delivery.created_at).toLocaleDateString()}</p>
                                    
                                    {/* 지연 일수 표시 */}
                                    {delivery.isDelayed && (
                                        <p className="delay-days">
                                            <strong>⚠️ {delivery.daysSinceOrder}일째 미완료</strong>
                                        </p>
                                    )}
                                    
                                    {delivery.tracking_number && (
                                        <p><strong>운송장:</strong> {delivery.tracking_number}</p>
                                    )}
                                    {delivery.delivery_company && (
                                        <p><strong>택배사:</strong> {delivery.delivery_company}</p>
                                    )}
                                </div>

                                <div className="delivery-items">
                                    <h4>주문 상품</h4>
                                    {delivery.OrderItems?.map(item => (
                                        <div key={item.order_item_id} className="delivery-item">
                                            <span>{item.Product?.name || '상품명 없음'}</span>
                                            <span>{item.quantity}개</span>
                                            <span>{item.price?.toLocaleString()}원</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="delivery-actions">
                                    {editingDelivery[delivery.order_id] ? (
                                        <div className="delivery-edit-form">
                                            <div className="status-update-section">
                                                <label>배송 상태:</label>
                                                <select
                                                    defaultValue={delivery.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        const trackingNumber = delivery.tracking_number || '';
                                                        const deliveryCompany = delivery.delivery_company || '';
                                                        handleDeliveryStatusUpdate(delivery.order_id, newStatus, trackingNumber, deliveryCompany);
                                                    }}
                                                >
                                                    <option value="pending">대기</option>
                                                    <option value="paid">결제완료</option>
                                                    <option value="shipping">배송중</option>
                                                    <option value="delivered">배송완료</option>
                                                    <option value="cancelled">취소</option>
                                                </select>
                                                <div className="status-note">
                                                    <small>💡 <strong>참고:</strong> 실제 운영에서는 상태 전환이 제한됩니다.</small>
                                                    <small>• 배송완료 → 취소 불가</small>
                                                    <small>• 취소 → 다른 상태로 변경 불가</small>
                                                    <small>• 현재는 개발 모드로 자유롭게 변경 가능</small>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="운송장 번호"
                                                defaultValue={delivery.tracking_number || ''}
                                                onChange={(e) => {
                                                    const newTrackingNumber = e.target.value;
                                                    const deliveryCompany = delivery.delivery_company || '';
                                                    handleDeliveryStatusUpdate(delivery.order_id, delivery.status, newTrackingNumber, deliveryCompany);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="택배사명"
                                                defaultValue={delivery.delivery_company || ''}
                                                onChange={(e) => {
                                                    const newDeliveryCompany = e.target.value;
                                                    const trackingNumber = delivery.tracking_number || '';
                                                    handleDeliveryStatusUpdate(delivery.order_id, delivery.status, trackingNumber, newDeliveryCompany);
                                                }}
                                            />
                                            <button onClick={() => toggleDeliveryEdit(delivery.order_id)}>
                                                완료
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="delivery-action-buttons">
                                            <button 
                                                onClick={() => toggleDeliveryEdit(delivery.order_id)}
                                                className="edit-btn"
                                            >
                                                수정
                                            </button>
                                            {delivery.tracking_number && (
                                                <button 
                                                    onClick={() => handleTrackParcel(delivery.tracking_number)}
                                                    className="track-btn"
                                                >
                                                    추적
                                                </button>
                                            )}
                                            {delivery.status === 'shipping' && (
                                                <button 
                                                    onClick={() => handleCompleteDelivery(delivery.order_id)}
                                                    className="complete-btn"
                                                >
                                                    완료
                                                </button>
                                            )}
                                            {delivery.status !== 'cancelled' && delivery.status !== 'delivered' && (
                                                <button 
                                                    onClick={() => handleCancelDelivery(delivery.order_id)}
                                                    className="cancel-btn"
                                                >
                                                    취소
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // 택배 추적 모달
    const renderTrackingModal = () => (
        showTrackingModal && (
            <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>택배 추적 정보</h3>
                        <button 
                            onClick={() => setShowTrackingModal(false)}
                            className="modal-close"
                        >
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        {trackingInfo ? (
                            <div className="tracking-info">
                                <div className="tracking-header">
                                    <p><strong>운송장 번호:</strong> {trackingInfo.tracking_number}</p>
                                    <p><strong>택배사:</strong> {trackingInfo.carrier}</p>
                                    <p><strong>상태:</strong> {trackingInfo.status}</p>
                                </div>
                                {trackingInfo.events && trackingInfo.events.length > 0 ? (
                                    <div className="tracking-events">
                                        <h4>배송 이력</h4>
                                        {trackingInfo.events.map((event, index) => (
                                            <div key={index} className="tracking-event">
                                                <div className="event-time">
                                                    {new Date(event.time).toLocaleString()}
                                                </div>
                                                <div className="event-location">
                                                    {event.location}
                                                </div>
                                                <div className="event-status">
                                                    {event.status}
                                                </div>
                                                {event.description && (
                                                    <div className="event-description">
                                                        {event.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>배송 이력이 없습니다.</p>
                                )}
                            </div>
                        ) : (
                            <p>추적 정보를 불러올 수 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        )
    );

    // 매출 관리 함수들
    const fetchSalesData = async () => {
        try {
            // 일간 매출 조회
            const dailyResponse = await saleApi.getDailySales(selectedSaleYear, selectedSaleMonth);
            if (dailyResponse.success) {
                setSalesData(prev => ({ ...prev, daily: dailyResponse.data }));
            }

            // 월간 매출 조회
            const monthlyResponse = await saleApi.getMonthlySales(selectedSaleYear);
            if (monthlyResponse.success) {
                setSalesData(prev => ({ ...prev, monthly: monthlyResponse.data }));
            }

            // 연간 매출 조회
            const yearlyResponse = await saleApi.getYearlySales();
            if (yearlyResponse.success) {
                setSalesData(prev => ({ ...prev, yearly: yearlyResponse.data }));
            }
        } catch (error) {
            console.error('매출 데이터 조회 오류:', error);
            setError('매출 데이터를 불러오는 도중 오류가 발생했습니다.');
        }
    };

    // 매출 기간 변경 시 데이터 재조회
    useEffect(() => {
        if (selectedSaleYear && selectedSaleMonth) {
            fetchSalesData();
        }
    }, [selectedSalePeriod, selectedSaleYear, selectedSaleMonth]);

    // 매출 입력 폼 토글
    const toggleSaleForm = () => {
        setShowSaleForm(!showSaleForm);
        if (!showSaleForm) {
            // 폼을 열 때 초기화
            const now = new Date();
            setNewSale({
                sale_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
                offline_amount: '',
                memo: ''
            });
        }
    };

    // 새 매출 입력 필드 변경
    const handleSaleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 매출 추가
    const handleAddSale = async (e) => {
        e.preventDefault();
        
        if (!newSale.sale_date || newSale.offline_amount === '') {
            setError('날짜와 오프라인 매출은 필수 입력 항목입니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await saleApi.addSale(newSale);
            if (response.success) {
                setShowSaleForm(false);
                setNewSale({ sale_date: '', offline_amount: '', memo: '' });
                fetchSalesData(); // 매출 데이터 재조회
            } else {
                setError(response.message || '매출 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('매출 추가 오류:', error);
            setError('매출 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 매출 데이터 포맷팅
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount || 0);
    };

    // 매출 섹션 렌더링
    const renderSaleSection = () => (
        <div className="sale-section">
            <div className="section-header">
                <h2>매출 관리</h2>
                <button 
                    onClick={toggleSaleForm} 
                    className={`add-sale-btn ${showSaleForm ? 'active' : ''}`}
                >
                    {showSaleForm ? '매출 입력 취소' : '매출 입력'}
                </button>
            </div>

            {/* 매출 입력 폼 */}
            {showSaleForm && (
                <div className="sale-form-section">
                    <h2>매출 입력</h2>
                    <div className="sale-form">
                        <form onSubmit={handleAddSale}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>날짜 선택:</label>
                                    <div className="date-button-selector">
                                        <div className="quick-select">
                                            <button 
                                                type="button"
                                                className="quick-btn" 
                                                onClick={selectSaleDateToday}
                                            >
                                                오늘
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            name="sale_date"
                                            value={newSale.sale_date}
                                            onChange={handleSaleInputChange}
                                            placeholder="2024-01-01"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            required
                                            style={{ marginTop: '10px' }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>오프라인 매출:</label>
                                    <input
                                        type="number"
                                        name="offline_amount"
                                        value={newSale.offline_amount}
                                        onChange={handleSaleInputChange}
                                        placeholder="오프라인 매출 금액"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>메모:</label>
                                <textarea
                                    name="memo"
                                    value={newSale.memo}
                                    onChange={handleSaleInputChange}
                                    placeholder="메모 (선택사항)"
                                    rows="3"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={loading} className="submit-btn">
                                    {loading ? '처리 중...' : '매출 저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 매출 조회 섹션 */}
            <div className="sale-view-section">
                <div className="sale-controls">
                    <div className="period-selector">
                        <button 
                            className={selectedSalePeriod === 'daily' ? 'active' : ''}
                            onClick={() => setSelectedSalePeriod('daily')}
                        >
                            일간
                        </button>
                        <button 
                            className={selectedSalePeriod === 'monthly' ? 'active' : ''}
                            onClick={() => setSelectedSalePeriod('monthly')}
                        >
                            월간
                        </button>
                        <button 
                            className={selectedSalePeriod === 'yearly' ? 'active' : ''}
                            onClick={() => setSelectedSalePeriod('yearly')}
                        >
                            연간
                        </button>
                    </div>
                    
                    {selectedSalePeriod === 'daily' && (
                        <div className="date-button-selector">
                            <div className="year-selector">
                                <button 
                                    className="year-btn" 
                                    onClick={() => handleYearChange('prev')}
                                >
                                    ◀
                                </button>
                                <span className="current-year">{selectedSaleYear}</span>
                                <button 
                                    className="year-btn" 
                                    onClick={() => handleYearChange('next')}
                                >
                                    ▶
                                </button>
                            </div>
                            
                            <div className="month-selector">
                                <select 
                                    value={selectedSaleMonth}
                                    onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                                    className="month-select"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                        <option key={month} value={month}>
                                            {month}월
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="quick-select">
                                <button className="quick-btn" onClick={selectToday}>
                                    오늘
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {selectedSalePeriod === 'monthly' && (
                        <div className="date-button-selector">
                            <div className="year-selector">
                                <button 
                                    className="year-btn" 
                                    onClick={() => handleYearChange('prev')}
                                >
                                    ◀
                                </button>
                                <span className="current-year">{selectedSaleYear}</span>
                                <button 
                                    className="year-btn" 
                                    onClick={() => handleYearChange('next')}
                                >
                                    ▶
                                </button>
                            </div>
                            
                            <div className="quick-select">
                                <button className="quick-btn" onClick={selectThisMonth}>
                                    이번 년도
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 매출 데이터 표시 */}
                <div className="sale-data">
                    {selectedSalePeriod === 'daily' && (
                        <div className="daily-sales">
                            <h3>{selectedSaleYear}년 {selectedSaleMonth}월 일간 매출</h3>
                            <div className="sales-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>날짜</th>
                                            <th>온라인 매출</th>
                                            <th>오프라인 매출</th>
                                            <th>취소 매출</th>
                                            <th>총 매출</th>
                                            <th>주문 수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.daily.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{sale.date}</td>
                                                <td>{formatCurrency(sale.online_amount)}원</td>
                                                <td>
                                                    <button 
                                                        className="offline-amount-btn"
                                                        onClick={() => openMemoModal(sale)}
                                                        disabled={!sale.offline_amount || sale.offline_amount === 0}
                                                    >
                                                        {formatCurrency(sale.offline_amount)}원
                                                    </button>
                                                </td>
                                                <td>{formatCurrency(sale.cancel_amount)}원</td>
                                                <td className="total-amount">{formatCurrency(sale.total_amount)}원</td>
                                                <td>{sale.order_count}건</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedSalePeriod === 'monthly' && (
                        <div className="monthly-sales">
                            <h3>{selectedSaleYear}년 월간 매출</h3>
                            <div className="sales-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>월</th>
                                            <th>온라인 매출</th>
                                            <th>오프라인 매출</th>
                                            <th>취소 매출</th>
                                            <th>총 매출</th>
                                            <th>주문 수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.monthly.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{sale.month}월</td>
                                                <td>{formatCurrency(sale.online_amount)}원</td>
                                                <td>
                                                    <button 
                                                        className="offline-amount-btn"
                                                        onClick={() => openMemoModal(sale)}
                                                        disabled={!sale.offline_amount || sale.offline_amount === 0}
                                                    >
                                                        {formatCurrency(sale.offline_amount)}원
                                                    </button>
                                                </td>
                                                <td>{formatCurrency(sale.cancel_amount)}원</td>
                                                <td className="total-amount">{formatCurrency(sale.total_amount)}원</td>
                                                <td>{sale.order_count}건</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedSalePeriod === 'yearly' && (
                        <div className="yearly-sales">
                            <h3>연간 매출</h3>
                            <div className="sales-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>년도</th>
                                            <th>온라인 매출</th>
                                            <th>오프라인 매출</th>
                                            <th>취소 매출</th>
                                            <th>총 매출</th>
                                            <th>주문 수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.yearly.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{sale.year}년</td>
                                                <td>{formatCurrency(sale.online_amount)}원</td>
                                                <td>
                                                    <button 
                                                        className="offline-amount-btn"
                                                        onClick={() => openMemoModal(sale)}
                                                        disabled={!sale.offline_amount || sale.offline_amount === 0}
                                                    >
                                                        {formatCurrency(sale.offline_amount)}원
                                                    </button>
                                                </td>
                                                <td>{formatCurrency(sale.cancel_amount)}원</td>
                                                <td className="total-amount">{formatCurrency(sale.total_amount)}원</td>
                                                <td>{sale.order_count}건</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // 메모 Modal 렌더링
    const renderMemoModal = () => {
        if (!showMemoModal || !selectedMemoData) return null;

        const renderMemoContent = () => {
            if (selectedMemoData.offline_sales && selectedMemoData.offline_sales.length > 0) {
                // 일간 매출의 경우 해당 날짜의 모든 오프라인 매출과 메모
                return (
                    <div className="memo-list">
                        {selectedMemoData.offline_sales.map((sale, index) => (
                            <div key={index} className="memo-item">
                                <div className="memo-header">
                                    <h5>오프라인 매출 #{index + 1}</h5>
                                    <span className="memo-amount">{formatCurrency(sale.offline_amount)}원</span>
                                </div>
                                {sale.memo ? (
                                    <div className="memo-text">
                                        {sale.memo.split('\n').map((line, lineIndex) => (
                                            <p key={lineIndex}>{line}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-memo">메모 없음</p>
                                )}
                            </div>
                        ))}
                    </div>
                );
            } else if (selectedMemoData.memos && selectedMemoData.memos.length > 0) {
                // 월간 매출의 경우 여러 메모
                return (
                    <div className="memo-list">
                        {selectedMemoData.memos.map((memoItem, index) => (
                            <div key={index} className="memo-item">
                                <h5>{memoItem.date}</h5>
                                <div className="memo-text">
                                    {memoItem.memo.split('\n').map((line, lineIndex) => (
                                        <p key={lineIndex}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            } else {
                return <p className="no-memo">메모가 없습니다.</p>;
            }
        };

        return (
            <div className="modal-overlay" onClick={closeMemoModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>매출 메모</h3>
                        <button className="modal-close" onClick={closeMemoModal}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="memo-info">
                            <p><strong>날짜:</strong> {selectedMemoData.date || selectedMemoData.month + '월' || selectedMemoData.year + '년'}</p>
                            <p><strong>오프라인 매출:</strong> {formatCurrency(selectedMemoData.offline_amount)}원</p>
                            <div className="memo-content">
                                <h4>메모:</h4>
                                {renderMemoContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                <button 
                    onClick={toggleSaleForm} 
                    className={`add-sale-btn ${showSaleForm ? 'active' : ''}`}
                >
                    {showSaleForm ? '매출 입력 취소' : '매출 입력'}
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

            {/* 배송 목록 */}
            {renderDeliveryList()}

            {/* 택배 추적 모달 */}
            {renderTrackingModal()}

            {/* 매출 관리 섹션 */}
            {renderSaleSection()}

            {/* 메모 Modal */}
            {renderMemoModal()}
        </div>
    );
};

export default DashBoard;