// features/admin/components/product/hooks/useProductManagement.js

import { useState, useEffect, useCallback } from 'react';

import {
    getAllProducts,
    searchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
} from '../../../api/productApi';

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
        name: '', price: '', category_id: '', memo: '', stock: '',
        small_photo: '',
        large_photo: '',
        brand: '',
        pick: 'nothing', // 기본값 설정
    });

    const [editingProduct, setEditingProduct] = useState(null);

    // ⭐ 중요: 새 상품 추가 폼을 위한 이미지 업로드 관련 상태 다시 정의 ⭐
    const [uploadingSmallImage, setUploadingSmallImage] = useState(false);
    const [smallImageUploadMessage, setSmallImageUploadMessage] = useState('');

    const [uploadingLargeImage, setUploadingLargeImage] = useState(false);
    const [largeImageUploadMessage, setLargeImageUploadMessage] = useState('');


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
            const response = await fetchCategoriesApi();
            console.log("useProductManagement - fetchCategories: categoryApi에서 받은 response:", response);
            if (response.success && Array.isArray(response.data)) {
                setCategories(response.data);
                console.log("useProductManagement - fetchCategories: categories 상태 설정 완료:", response.data);
            } else {
                setError(response.message || "카테고리 데이터를 불러왔으나 형식이 올바르지 않습니다.");
                setCategories([]);
                console.error("useProductManagement - fetchCategories: API 응답 형식 오류 또는 데이터 없음", response);
            }
        } catch (err) {
            setError(err.response?.data?.message || '카테고리 목록을 불러오는 데 실패했습니다.');
            setCategories([]);
            console.error("useProductManagement - fetchCategories: API 호출 실패", err);
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
                name: '', price: '', category_id: '', memo: '', stock: '',
                small_photo: '', large_photo: '', brand: '', pick: 'nothing'
            });
            setError('');
            // ⭐ 다시 활성화: 폼 열 때 이미지 관련 상태 초기화 ⭐
            setSmallImageUploadMessage('');
            setLargeImageUploadMessage('');
            setUploadingSmallImage(false);
            setUploadingLargeImage(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ⭐ 수정: 새로운 상품 추가 폼을 위한 파일 변경 및 업로드 핸들러 ⭐
    const handleNewProductSmallFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setNewProduct(prev => ({ ...prev, small_photo: '' }));
            setSmallImageUploadMessage(''); // 파일 선택 취소 시 메시지 초기화
            return;
        }

        setUploadingSmallImage(true); // 업로드 시작
        setSmallImageUploadMessage('작은 사진 업로드 중...');
        setError('');
        try {
            const result = await uploadProductImage(file);
            if (result.success) {
                setNewProduct(prev => ({ ...prev, small_photo: result.imageUrl }));
                setSmallImageUploadMessage('작은 사진 업로드 성공!');
            } else {
                setSmallImageUploadMessage(`작은 사진 업로드 실패: ${result.message}`);
                e.target.value = ''; // 실패 시 input 파일 초기화
                setNewProduct(prev => ({ ...prev, small_photo: '' })); // URL도 클리어
            }
        } catch (err) {
            console.error('작은 사진 업로드 오류:', err);
            setSmallImageUploadMessage(`작은 사진 업로드 실패: ${err.message || '알 수 없는 오류'}`);
            e.target.value = '';
            setNewProduct(prev => ({ ...prev, small_photo: '' }));
        } finally {
            setUploadingSmallImage(false); // 업로드 완료 (성공/실패 무관)
        }
    };

    // ⭐ 수정: 새로운 상품 추가 폼을 위한 큰 사진 파일 변경 및 업로드 핸들러 ⭐
    const handleNewProductLargeFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setNewProduct(prev => ({ ...prev, large_photo: '' }));
            setLargeImageUploadMessage(''); // 파일 선택 취소 시 메시지 초기화
            return;
        }

        setUploadingLargeImage(true); // 업로드 시작
        setLargeImageUploadMessage('큰 사진 업로드 중...');
        setError('');
        try {
            const result = await uploadProductImage(file);
            if (result.success) {
                setNewProduct(prev => ({ ...prev, large_photo: result.imageUrl }));
                setLargeImageUploadMessage('큰 사진 업로드 성공!');
            } else {
                setLargeImageUploadMessage(`큰 사진 업로드 실패: ${result.message}`);
                e.target.value = ''; // 실패 시 input 파일 초기화
                setNewProduct(prev => ({ ...prev, large_photo: '' })); // URL도 클리어
            }
        } catch (err) {
            console.error('큰 사진 업로드 오류:', err);
            setLargeImageUploadMessage(`큰 사진 업로드 실패: ${err.message || '알 수 없는 오류'}`);
            e.target.value = '';
            setNewProduct(prev => ({ ...prev, large_photo: '' }));
        } finally {
            setUploadingLargeImage(false); // 업로드 완료 (성공/실패 무관)
        }
    };


    const handleAddProduct = async (e) => {
        e.preventDefault();

        // ⭐ 다시 활성화: 이미지 업로드 중일 때는 상품 추가 방지 ⭐
        if (uploadingSmallImage || uploadingLargeImage) {
            setError('이미지 업로드 중입니다. 잠시 기다려주세요.');
            return;
        }

        if (!newProduct.name.trim() || !String(newProduct.price).trim() || !String(newProduct.category_id).trim()) {
            setError('상품명, 가격, 카테고리는 필수 입력 항목입니다.');
            return;
        }
        // small_photo가 필수라면 이 유효성 검사 주석 해제
        // if (!newProduct.small_photo) {
        //     setError('작은 사진은 필수입니다.');
        //     return;
        // }

        setLoading(true);
        setError('');
        try {
            const response = await addProduct(newProduct);
            if (response.success) {
                await fetchAllProducts();
                setShowAddForm(false);
                setNewProduct({
                    name: '', price: '', category_id: '', memo: '', stock: '',
                    small_photo: '', large_photo: '', brand: '', pick: 'nothing'
                });
                // ⭐ 추가: 상품 추가 성공 후 이미지 관련 상태 초기화 ⭐
                setSmallImageUploadMessage('');
                setLargeImageUploadMessage('');
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
            setEditingProduct({
                ...productToEdit,
                _small_photo_file: null, // 작은 사진용 File 객체
                _large_photo_file: null  // 큰 사진용 File 객체
            });
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

    const handleSmallFileChangeForEdit = (productId, file) => {
        setEditingProduct(prev => {
            if (!prev || prev.product_id !== productId) return prev;

            if (file) {
                return { ...prev, _small_photo_file: file, small_photo: null };
            } else {
                const newState = { ...prev };
                delete newState._small_photo_file;
                return newState;
            }
        });
    };

    const handleLargeFileChangeForEdit = (productId, file) => {
        setEditingProduct(prev => {
            if (!prev || prev.product_id !== productId) return prev;

            if (file) {
                return { ...prev, _large_photo_file: file, large_photo: null };
            } else {
                const newState = { ...prev };
                delete newState._large_photo_file;
                return newState;
            }
        });
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
            let finalUpdateData = { ...updatedData };

            if (updatedData._small_photo_file instanceof File) {
                console.log("작은 사진 파일 업로드 시작:", updatedData._small_photo_file.name);
                const smallImageUploadResult = await uploadProductImage(updatedData._small_photo_file);
                if (smallImageUploadResult.success) {
                    finalUpdateData.small_photo = smallImageUploadResult.imageUrl;
                    console.log("작은 사진 업로드 성공, URL:", smallImageUploadResult.imageUrl);
                } else {
                    setError(`작은 사진 업로드 실패: ${smallImageUploadResult.message}`);
                    setLoading(false);
                    return;
                }
            } else if (updatedData.small_photo === null) {
                finalUpdateData.small_photo = null;
            }

            if (updatedData._large_photo_file instanceof File) {
                console.log("큰 사진 파일 업로드 시작:", updatedData._large_photo_file.name);
                const largeImageUploadResult = await uploadProductImage(updatedData._large_photo_file);
                if (largeImageUploadResult.success) {
                    finalUpdateData.large_photo = largeImageUploadResult.imageUrl;
                    console.log("큰 사진 업로드 성공, URL:", largeImageUploadResult.imageUrl);
                } else {
                    setError(`큰 사진 업로드 실패: ${largeImageUploadResult.message}`);
                    setLoading(false);
                    return;
                }
            } else if (updatedData.large_photo === null) {
                finalUpdateData.large_photo = null;
            }

            delete finalUpdateData._small_photo_file;
            delete finalUpdateData._large_photo_file;

            console.log("handleUpdateProduct: 최종 업데이트 요청 데이터", finalUpdateData);
            const result = await updateProduct(productId, finalUpdateData);
            console.log("handleUpdateProduct: updateProduct API 응답 결과:", result);

            if (result.success) {
                alert(result.message || '상품이 성공적으로 업데이트되었습니다.');
                await fetchAllProducts();

                if (isSearching && searchKeyword.trim()) {
                    await handleSearch();
                }

                setEditingProduct(null);
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

    const handleDeleteProduct = useCallback(async (productId) => {
        if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await deleteProduct(productId);
            if (response.success) {
                alert(response.message || '상품이 성공적으로 삭제되었습니다.');
                if (isSearching && searchKeyword.trim()) {
                    await handleSearch();
                } else {
                    await fetchAllProducts();
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
    }, [isSearching, searchKeyword, fetchAllProducts, handleSearch]);

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
        handleDeleteProduct,
        // ProductList에서 수정 모드를 위한 핸들러
        handleSmallFileChange: handleSmallFileChangeForEdit,
        handleLargeFileChange: handleLargeFileChangeForEdit,

        // 새 상품 추가 폼에서만 사용되는 이미지 관련 상태와 핸들러
        handleNewProductSmallFileChange,
        handleNewProductLargeFileChange,
        uploadingSmallImage, // 이제 이 상태들이 ProductAddForm에서 사용될 수 있음
        uploadingLargeImage, //
        smallImageUploadMessage,
        largeImageUploadMessage
    };
};

export default useProductManagement;