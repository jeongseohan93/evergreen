// features/admin/components/product/hooks/useProductManagement.js

import { useState, useEffect, useCallback } from 'react';

// 상품 관련 API는 productApi에서만 임포트
import {
    getAllProducts,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct, // <-- ⭐ deleteProduct API 함수 임포트 ⭐
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
     // 기존 setError('');는 그대로 유지해도 됨
     setError(''); 
     try {
         // ⭐⭐ 여기를 이렇게 수정해야 해! ⭐⭐
         // categoryApi에서 { success, data, message } 객체를 받을 것으로 기대
         const response = await fetchCategoriesApi(); 

         // 디버깅용 로그 - 이 로그들이 예상대로 찍히는지 반드시 확인!
         console.log("useProductManagement - fetchCategories: categoryApi에서 받은 response:", response);
         console.log("useProductManagement - fetchCategories: response.success:", response.success);
         console.log("useProductManagement - fetchCategories: Array.isArray(response.data):", Array.isArray(response.data));

         // ⭐⭐ response.success와 response.data를 확인하여 상태 설정 ⭐⭐
         if (response.success && Array.isArray(response.data)) {
             setCategories(response.data); // 핵심: response.data를 categories로 설정
             console.log("useProductManagement - fetchCategories: categories 상태 설정 완료:", response.data);
         } else {
             // API는 성공했지만, 데이터 형식이 예상과 다를 때 (백엔드 버그 또는 예상치 못한 응답)
             setError(response.message || "카테고리 데이터를 불러왔으나 형식이 올바르지 않습니다.");
             setCategories([]); // 안전하게 빈 배열로 설정
             console.error("useProductManagement - fetchCategories: API 응답 형식 오류 또는 데이터 없음", response);
         }
     } catch (err) {
         // API 호출 자체가 실패했을 때 (네트워크 오류, 서버 오류 등)
         setError(err.response?.data?.message || '카테고리 목록을 불러오는 데 실패했습니다.');
         setCategories([]); // 에러 시에도 안전하게 빈 배열로 설정
         console.error("useProductManagement - fetchCategories: API 호출 실패", err);
     }
 }, []); // 의존성 배열은 []로 유지

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
        if (isNaN(updatedData.price) || updatedData.price <= 0) {
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

                await fetchAllProducts(); // 상품 목록 새로고침

                if (isSearching && searchKeyword.trim()) {
                    console.log("handleUpdateProduct: 검색 중이므로 검색 결과 갱신 시작");
                    await handleSearch(); // 검색 결과도 갱신
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

    // --- ⭐⭐⭐ 새로운 상품 삭제 함수 추가 ⭐⭐⭐ ---
    const handleDeleteProduct = useCallback(async (productId) => {
        if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            return; // 사용자가 취소하면 아무것도 하지 않음
        }

        setLoading(true);
        setError('');
        try {
            const response = await deleteProduct(productId); // deleteProduct API 호출
            if (response.success) {
                alert(response.message || '상품이 성공적으로 삭제되었습니다.');
                // 현재 검색 중인 상태에 따라 목록 갱신
                if (isSearching && searchKeyword.trim()) {
                    await handleSearch(); // 검색 결과 갱신
                } else {
                    await fetchAllProducts(); // 전체 목록 새로고침
                }
            } else {
                setError(response.message || '상품 삭제에 실패했습니다.');
                alert(`상품 삭제 실패: ${response.message || '알 수 없는 오류'}`);
            }
        } catch (err) {
            console.error('상품 삭제 오류:', err);
            setError(err.response?.data?.message || '상품 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [isSearching, searchKeyword, fetchAllProducts, handleSearch]); // 의존성 배열에 관련 함수/상태 추가

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
        handleUpdateProduct,
        handleDeleteProduct // <-- ⭐ 반환 객체에 추가 ⭐
    };
};

export default useProductManagement;