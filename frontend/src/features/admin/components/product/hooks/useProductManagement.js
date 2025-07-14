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
    const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부

    const [showAddForm, setShowAddForm] = useState(false);

    // 새 상품 추가 폼의 초기 상태: brand, origin, model_name 필드 추가
    const [newProduct, setNewProduct] = useState({
        name: '', 
        price: '', 
        category_id: '', 
        memo: '', 
        stock: '',
        small_photo: '',
        large_photo: '',
        brand: '',      // 브랜드명 (필수)
        origin: '',     // 원산지 (필수)
        model_name: '', // 모델명 (선택 사항)
        pick: 'nothing', // 기본값 설정
    });

    // editingProduct는 toggleEditMode에서 기존 상품 데이터를 스프레드하여 초기화되므로,
    // brand, origin, model_name 필드는 자동으로 포함됩니다.
    const [editingProduct, setEditingProduct] = useState(null);

    // 새 상품 추가 폼을 위한 이미지 업로드 관련 상태
    const [uploadingSmallImage, setUploadingSmallImage] = useState(false);
    const [smallImageUploadMessage, setSmallImageUploadMessage] = useState('');

    const [uploadingLargeImage, setUploadingLargeImage] = useState(false);
    const [largeImageUploadMessage, setLargeImageUploadMessage] = useState('');

    // 기존 상품 수정 시 이미지 업로드 관련 상태
    const [uploadingEditSmallImage, setUploadingEditSmallImage] = useState(false);
    const [uploadingEditLargeImage, setUploadingEditLargeImage] = useState(false);
    const [editSmallImageUploadMessage, setEditSmallImageUploadMessage] = useState('');
    const [editLargeImageUploadMessage, setEditLargeImageUploadMessage] = useState('');


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
        setIsSearching(false); // 검색 초기화 시에만 isSearching을 false로 설정
        setError('');
    };

    const handleSearch = useCallback(async () => {
        if (!searchKeyword.trim()) {
            setError('검색 키워드를 입력하세요');
            // 검색 키워드가 없으면 검색 상태를 해제하고 모든 상품을 보여주도록 할 수 있습니다.
            setIsSearching(false); // 검색 키워드가 없으면 검색 상태 해제
            return;
        }

        setError('');
        setLoading(true); // 검색 중 로딩 스피너 표시
        setIsSearching(true); // 검색 시작 시 isSearching을 true로 설정
        try {
            const response = await searchProducts(searchKeyword);
            if (response.success) {
                // 백엔드에서 이미 필터링된 데이터를 보내주므로, 클라이언트 측 필터링 제거
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
            setLoading(false); // 검색 완료 후 로딩 스피너 숨김
            // ⭐ 중요: isSearching을 여기서 false로 설정하지 않습니다.
            // 검색 결과가 표시된 상태를 유지하기 위해 clearSearch에서만 false로 설정합니다.
        }
    }, [searchKeyword]);


    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) {
            setNewProduct({
                name: '', 
                price: '', 
                category_id: '', 
                memo: '', 
                stock: '',
                small_photo: '', 
                large_photo: '', 
                brand: '', 
                origin: '',     // 원산지 초기화
                model_name: '', // 모델명 초기화
                pick: 'nothing'
            });
            setError('');
            // 폼 열 때 이미지 관련 상태 초기화
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

    // 새로운 상품 추가 폼을 위한 파일 변경 및 업로드 핸들러
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

    // 새로운 상품 추가 폼을 위한 큰 사진 파일 변경 및 업로드 핸들러
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

        // 이미지 업로드 중일 때는 상품 추가 방지
        if (uploadingSmallImage || uploadingLargeImage) {
            setError('이미지 업로드 중입니다. 잠시 기다려주세요.');
            return;
        }

        // 필수 필드 유효성 검사 (상품명, 브랜드명, 원산지, 가격, 카테고리)
        if (!newProduct.name.trim() || !newProduct.brand.trim() || !newProduct.origin.trim() || !String(newProduct.price).trim() || !String(newProduct.category_id).trim()) {
            setError('상품명, 브랜드명, 원산지, 가격, 카테고리는 필수 입력 항목입니다.');
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
                    name: '', 
                    price: '', 
                    category_id: '', 
                    memo: '', 
                    stock: '',
                    small_photo: '', 
                    large_photo: '', 
                    brand: '', 
                    origin: '',     // 원산지 초기화
                    model_name: '', // 모델명 초기화
                    pick: 'nothing'
                });
                // 상품 추가 성공 후 이미지 관련 상태 초기화
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
                // API 응답에서 brand, origin, model_name이 null일 경우 빈 문자열로 변환하여 폼에 표시
                brand: productToEdit.brand || '',
                origin: productToEdit.origin || '',
                model_name: productToEdit.model_name || '',
                _small_photo_file: null, // 작은 사진용 File 객체
                _large_photo_file: null  // 큰 사진용 File 객체
            });
        } else {
            setEditingProduct(null);
        }
        setError('');
        // 편집 모드 진입/종료 시 이미지 업로드 메시지 초기화
        setEditSmallImageUploadMessage('');
        setEditLargeImageUploadMessage('');
        setUploadingEditSmallImage(false);
        setUploadingEditLargeImage(false);
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
                setUploadingEditSmallImage(true);
                setEditSmallImageUploadMessage('작은 사진 업로드 중...');
                setError('');
                // 파일 업로드 로직
                uploadProductImage(file).then(result => {
                    if (result.success) {
                        setEditingProduct(current => ({ ...current, small_photo: result.imageUrl, _small_photo_file: null }));
                        setEditSmallImageUploadMessage('작은 사진 업로드 성공!');
                    } else {
                        // ⭐ 수정: 오타 수정 setEditImageUploadMessage -> setEditSmallImageUploadMessage ⭐
                        setEditSmallImageUploadMessage(`작은 사진 업로드 실패: ${result.message}`); 
                        setError(`작은 사진 업로드 실패: ${result.message}`);
                        // 실패 시 파일 입력 초기화
                        const inputElement = document.querySelector(`input[type="file"][name="editSmallImage-${productId}"]`);
                        if (inputElement) inputElement.value = '';
                        setEditingProduct(current => ({ ...current, small_photo: '', _small_photo_file: null })); // URL도 클리어
                    }
                }).catch(err => {
                    console.error('편집 작은 사진 업로드 오류:', err);
                    setEditSmallImageUploadMessage(`작은 사진 업로드 실패: ${err.message || '알 수 없는 오류'}`);
                    setError(`편집 작은 사진 업로드 오류: ${err.message || '알 수 없는 오류'}`);
                    const inputElement = document.querySelector(`input[type="file"][name="editSmallImage-${productId}"]`);
                    if (inputElement) inputElement.value = '';
                    setEditingProduct(current => ({ ...current, small_photo: '', _small_photo_file: null }));
                }).finally(() => {
                    setUploadingEditSmallImage(false);
                });
                return { ...prev, _small_photo_file: file, small_photo: null }; // 즉시 파일 객체 저장 및 기존 URL 초기화
            } else {
                setEditSmallImageUploadMessage(''); // 파일 선택 취소 시 메시지 초기화
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
                setUploadingEditLargeImage(true);
                setEditLargeImageUploadMessage('큰 사진 업로드 중...');
                setError('');
                // 파일 업로드 로직
                uploadProductImage(file).then(result => {
                    if (result.success) {
                        setEditingProduct(current => ({ ...current, large_photo: result.imageUrl, _large_photo_file: null }));
                        setEditLargeImageUploadMessage('큰 사진 업로드 성공!');
                    } else {
                        setEditLargeImageUploadMessage(`큰 사진 업로드 실패: ${result.message}`);
                        setError(`큰 사진 업로드 실패: ${result.message}`);
                        // 실패 시 파일 입력 초기화
                        const inputElement = document.querySelector(`input[type="file"][name="editLargeImage-${productId}"]`);
                        if (inputElement) inputElement.value = '';
                        setEditingProduct(current => ({ ...current, large_photo: '', _large_photo_file: null })); // URL도 클리어
                    }
                }).catch(err => {
                    console.error('편집 큰 사진 업로드 오류:', err);
                    setEditLargeImageUploadMessage(`큰 사진 업로드 실패: ${err.message || '알 수 없는 오류'}`);
                    setError(`편집 큰 사진 업로드 오류: ${err.message || '알 수 없는 오류'}`);
                    const inputElement = document.querySelector(`input[type="file"][name="editLargeImage-${productId}"]`);
                    if (inputElement) inputElement.value = '';
                    setEditingProduct(current => ({ ...current, large_photo: '', _large_photo_file: null }));
                }).finally(() => {
                    setUploadingEditLargeImage(false);
                });
                return { ...prev, _large_photo_file: file, large_photo: null }; // 즉시 파일 객체 저장 및 기존 URL 초기화
            } else {
                setEditLargeImageUploadMessage(''); // 파일 선택 취소 시 메시지 초기화
                const newState = { ...prev };
                delete newState._large_photo_file;
                return newState;
            }
        });
    };


    const handleUpdateProduct = async (productId, updatedData) => {
        // 이미지 업로드 중일 때는 상품 업데이트 방지
        if (uploadingEditSmallImage || uploadingEditLargeImage) {
            setError('이미지 업로드 중입니다. 잠시 기다려주세요.');
            return;
        }

        // 필수 필드 유효성 검사 (상품명, 브랜드명, 원산지, 가격, 카테고리)
        if (!updatedData.name.trim() || !updatedData.brand.trim() || !updatedData.origin.trim() || !String(updatedData.price).trim() || !String(updatedData.category_id).trim()) {
            setError('상품명, 브랜드명, 원산지, 가격, 카테고리는 필수 입력 항목입니다.');
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

            // _small_photo_file과 _large_photo_file은 ProductList에서 File 객체를 직접 넘겨주므로,
            // 여기서는 이미 업로드된 URL을 사용하거나, 새로 업로드된 파일의 URL을 반영합니다.
            // handleSmallFileChangeForEdit / handleLargeFileChangeForEdit 에서 이미 이미지 업로드를 처리하고
            // editingProduct 상태를 업데이트하므로, 여기서는 해당 필드를 삭제하기만 하면 됩니다.
            delete finalUpdateData._small_photo_file;
            delete finalUpdateData._large_photo_file;

            // 모델명이 빈 문자열이면 null로 변환하여 전송 (선택 사항이므로)
            if (finalUpdateData.model_name === '') {
                finalUpdateData.model_name = null;
            }

            console.log("handleUpdateProduct: 최종 업데이트 요청 데이터", finalUpdateData);
            const result = await updateProduct(productId, finalUpdateData);
            console.log("handleUpdateProduct: updateProduct API 응답 결과:", result);

            if (result.success) {
                alert(result.message || '상품이 성공적으로 업데이트되었습니다.');
                await fetchAllProducts(); // 전체 목록 새로고침

                // ⭐ 수정: 검색 중이었다면 검색 결과도 새로고침 (isSearching 상태에 따라 조건부 호출) ⭐
                if (isSearching) { // searchKeyword.trim() 조건 제거 (isSearching이 이미 검색 상태를 나타냄)
                    await handleSearch(); 
                }

                setEditingProduct(null); // 수정 모드 종료
                // 수정 성공 후 이미지 관련 상태 초기화
                setEditSmallImageUploadMessage('');
                setEditLargeImageUploadMessage('');
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
                // ⭐ 수정: 검색 중이었다면 검색 결과도 새로고침 (isSearching 상태에 따라 조건부 호출) ⭐
                if (isSearching) { // searchKeyword.trim() 조건 제거
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
    }, [isSearching, fetchAllProducts, handleSearch]); // searchKeyword 의존성 제거

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
        uploadingSmallImage, 
        uploadingLargeImage, 
        smallImageUploadMessage,
        largeImageUploadMessage,

        // 기존 상품 수정 시 이미지 업로드 관련 상태
        uploadingEditSmallImage,
        uploadingEditLargeImage,
        editSmallImageUploadMessage,
        editLargeImageUploadMessage,
    };
};

export default useProductManagement;
