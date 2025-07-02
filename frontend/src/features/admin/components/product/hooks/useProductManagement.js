// features/admin/components/product/hooks/useProductManagement.js

import { useState, useEffect, useCallback } from 'react';

// 상품 관련 API는 productApi에서만 임포트
import {
    getAllProducts,
    searchProducts,
    updateStock,
    addProduct,
} from '../../../api/productApi'; // << 정확한 경로 확인

// 카테고리 관련 API는 categoryApi에서만 임포트
import { fetchCategories as fetchCategoriesApi } from '../../../api/categoryApi'; // << 정확한 경로 확인


const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [editingStock, setEditingStock] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: ''
    });

    const fetchAllProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // productApi의 getAllProducts는 { success, data } 객체를 반환한다고 가정
            const response = await getAllProducts();
            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message || '상품을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('상품 조회 오류:', err);
            // throw된 에러 객체에서 메시지를 추출하거나 기본 메시지 사용
            setError(err.response?.data?.message || '상품을 불러오는 도중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // categoryApi의 fetchCategories는 배열을 직접 반환
            const fetchedCategoriesArray = await fetchCategoriesApi();
            setCategories(fetchedCategoriesArray);
        } catch (err) {
            console.error('카테고리 조회 오류:', err);
            // throw된 에러 객체에서 메시지를 추출하거나 기본 메시지 사용
            setError(err.response?.data?.message || '카테고리를 불러오는 데 실패했습니다.');
        } finally {
             setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchAllProducts(); // 상품 로드
        fetchCategories(); // 카테고리 로드
    }, [fetchAllProducts, fetchCategories]);

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults([]);
        setIsSearching(false);
        setError('');
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setError('검색 키워드를 입력하세요');
            return;
        }

        setLoading(true);
        setError('');
        setIsSearching(true);
        try {
            const response = await searchProducts(searchKeyword);
            if (response.success) {
                setSearchResults(response.data);
            } else {
                setError(response.message || '검색에 실패했습니다.');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('검색 오류:', err);
            setError(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = async (productId, newStock) => {
        if (newStock < 0) {
            setError('재고는 0 이상이어야 합니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await updateStock(productId, newStock);
            if (response.success) {
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
        } catch (err) {
            console.error('재고 수정 오류:', err);
            setError(err.response?.data?.message || '재고 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStockEdit = (productId) => {
        setEditingStock(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) {
            setNewProduct({
                name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: ''
            });
            setError('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.name.trim() || !String(newProduct.price).trim() || !String(newProduct.category_id).trim()) {
            setError('상품명, 가격, 카테고리는 필수 입력 항목입니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await addProduct(newProduct);
            if (response.success) {
                await fetchAllProducts();
                setShowAddForm(false);
                setNewProduct({
                    name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: ''
                });
            } else {
                setError(response.message || '상품 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error('상품 추가 오류:', err);
            setError(err.response?.data?.message || '상품 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        categories,
        loading,
        error,
        searchKeyword,
        setSearchKeyword,
        searchResults,
        isSearching,
        editingStock,
        showAddForm,
        newProduct,
        fetchAllProducts,
        clearSearch,
        handleSearch,
        handleStockUpdate,
        toggleStockEdit,
        toggleAddForm,
        handleInputChange,
        handleAddProduct
    };
};

export default useProductManagement;