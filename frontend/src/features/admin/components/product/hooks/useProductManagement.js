// features/admin/components/product/hooks/useProductManagement.js

import { useState, useEffect, useCallback } from 'react';

// 상품 관련 API는 productApi에서만 임포트
import {
    getAllProducts,
    searchProducts,
    addProduct,
    updateProduct,
} from '../../../api/productApi';

// 카테고리 관련 API는 categoryApi에서만 임포트
import { fetchCategories as fetchCategoriesApi } from '../../../api/categoryApi';


const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [showAddForm, setShowAddForm] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: '', brand: ''
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const fetchAllProducts = useCallback(async () => {
        setError('');
        try {
            const response = await getAllProducts();
            if (response.success) {
                console.log("fetchAllProducts - GET ALL PRODUCTS API 응답:", response.data);
                setProducts(response.data);
            } else {
                setError(response.message || '상품을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('상품 조회 오류:', err);
            setError(err.response?.data?.message || '상품을 불러오는 도중 오류가 발생했습니다.');
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setError('');
        try {
            const fetchedCategoriesArray = await fetchCategoriesApi();
            setCategories(fetchedCategoriesArray);
        } catch (err) {
            console.error('카테고리 조회 오류:', err);
            setError(err.response?.data?.message || '카테고리를 불러오는 데 실패했습니다.');
        }
    }, []);

    const initialLoad = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchAllProducts(), fetchCategories()]);
        } catch (error) {
            console.error("초기 데이터 로드 중 오류 발생:", error);
            setError('초기 데이터 로드에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [fetchAllProducts, fetchCategories]);

    useEffect(() => {
        initialLoad();
    }, [initialLoad]);


    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults([]);
        setIsSearching(false);
        setError('');
    };

    const handleSearch = useCallback(async () => {
        if (!searchKeyword.trim()) {
            setError('검색 키워드를 입력하세요');
            return;
        }

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
        }
    }, [searchKeyword]);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) {
            setNewProduct({
                name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: '', brand: ''
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
                    name: '', price: '', category_id: '', memo: '', stock: '', small_photo: '', large_photo: '', brand: ''
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

    const toggleEditMode = (productToEdit) => {
        if (productToEdit) {
            setEditingProduct({ ...productToEdit });
        } else {
            setEditingProduct(null);
        }
        setError('');
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        if (!updatedData.name.trim() || !String(updatedData.price).trim() || !String(updatedData.category_id).trim()) {
            setError('상품명, 가격, 카테고리는 필수 입력 항목입니다.');
            return;
        }
        // 이 부분에서 'price' 대신 'updatedData.price'를 사용해야 합니다.
        if (isNaN(updatedData.price) || updatedData.price <= 0) { // <--- 여기가 수정됨
            setError('가격은 0보다 큰 숫자여야 합니다.');
            return;
        }
        if (updatedData.stock !== undefined && (isNaN(updatedData.stock) || updatedData.stock < 0)) {
            setError('재고는 0 이상의 숫자여야 합니다.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            console.log("handleUpdateProduct: 업데이트 요청 데이터", updatedData);
            const result = await updateProduct(productId, updatedData);
            console.log("handleUpdateProduct: updateProduct API 응답 결과:", result);

            if (result.success) {
                alert(result.message || '상품이 성공적으로 업데이트되었습니다.');
                console.log("handleUpdateProduct: fetchAllProducts 호출 직전");

                await fetchAllProducts();

                if (isSearching && searchKeyword.trim()) {
                    console.log("handleUpdateProduct: 검색 중이므로 검색 결과 갱신 시작");
                    await handleSearch();
                }

                setEditingProduct(null);
                console.log("handleUpdateProduct: fetchAllProducts 호출 완료");
            } else {
                setError(result.message || '상품 수정에 실패했습니다.');
                alert(`상품 수정 실패: ${result.message || '알 수 없는 오류'}`);
            }
        } catch (err) {
            console.error('handleUpdateProduct 에러:', err);
            setError(err.message || '상품 수정 중 알 수 없는 오류가 발생했습니다.');
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
        showAddForm,
        newProduct,
        fetchAllProducts,
        clearSearch,
        handleSearch,
        toggleAddForm,
        handleInputChange,
        handleAddProduct,
        editingProduct,
        toggleEditMode,
        handleEditInputChange,
        handleUpdateProduct
    };
};

export default useProductManagement;