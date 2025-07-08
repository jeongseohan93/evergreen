// src/features/admin/pages/categoryPage/CategoryProductList.jsx

import React, { useEffect, useState, useCallback } from 'react';

// ProductList 컴포넌트 임포트
import ProductList from '../productPage/ProductList'; 

// API 함수 임포트
import { getAllProducts, updateProduct } from '../../api/productApi'; 
import { fetchCategories } from '../../api/categoryApi'; 

const CategoryProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [currentCategoryName, setCurrentCategoryName] = useState(''); 

    const [editingProduct, setEditingProduct] = useState(null); 
    const [productEditForm, setProductEditForm] = useState({}); 

    // 카테고리 목록을 불러오는 함수
    const fetchAllCategories = useCallback(async () => {
        try {
            const result = await fetchCategories();
            if (result.success && Array.isArray(result.data)) { 
                setCategories(result.data);
            } else {
                console.error("카테고리 불러오기 실패 또는 데이터 형식이 올바르지 않음:", result.message || "알 수 없는 오류");
                setError(result.message || "카테고리 목록을 불러오는 데 실패했습니다.");
                setCategories([]); // 실패 시 빈 배열로 설정하여 map/find 에러 방지
            }
        } catch (err) {
            console.error("카테고리 API 호출 에러:", err);
            setError("카테고리 목록 API 호출 중 예상치 못한 오류 발생.");
            setCategories([]); 
        }
    }, []);

    // 특정 카테고리의 상품 목록을 불러오는 함수
    // categories 상태에는 의존하지 않음
    const fetchCategoryProducts = useCallback(async (id) => {
        setLoading(true); 
        setError(null);
        setProducts([]); 
        setEditingProduct(null); 
        setProductEditForm({}); 

        if (!id) {
            setError('선택된 카테고리 ID가 유효하지 않습니다.');
            setLoading(false);
            return;
        }

        try {
            const result = await getAllProducts(id); 
            
            if (result.success && Array.isArray(result.data)) { 
                setProducts(result.data); 
            } else {
                throw new Error(result.message || '카테고리 상품을 불러오는 데 실패했습니다.');
            }
            
        } catch (err) {
            console.error("카테고리 상품 조회 에러:", err);
            setError(err.message || '카테고리 상품을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false); 
        }
    }, []); 

    // === useEffect 훅들 ===

    // 1. 컴포넌트 마운트 시 카테고리 목록 초기 로딩
    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    // 2. categoryId 또는 컴포넌트 로딩 상태에 따라 상품 목록 로딩
    useEffect(() => {
        if (categoryId) { 
            fetchCategoryProducts(categoryId);
        } else if (!categoryId && !loading) { 
            setError('표시할 카테고리가 선택되지 않았습니다.');
        }
    }, [categoryId, fetchCategoryProducts, loading]);

    // 3. categoryId 또는 categories 상태가 변경될 때 currentCategoryName 업데이트
    // categories 배열이 비동기적으로 로드된 후에 실행되도록 하여 find 에러를 방지합니다.
    useEffect(() => {
        if (categoryId && categories.length > 0) {
            // categoryId를 숫자로 변환하여 비교하여 타입 불일치 문제 방지
            const category = categories.find(cat => cat.category_id === Number(categoryId));
            setCurrentCategoryName(category ? category.name : `ID: ${categoryId}`);
        } else {
            setCurrentCategoryName(''); 
        }
    }, [categoryId, categories]);


    // === ProductList에 필요한 핸들러 함수들 ===

    const toggleEditMode = (product) => {
        setEditingProduct(product); 
        setProductEditForm(product ? { ...product } : {}); 
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        try {
            const result = await updateProduct(productId, updatedData); 
            if (result.success) {
                alert('상품이 성공적으로 업데이트되었습니다.');
                setEditingProduct(null); 
                setProductEditForm({}); 
                fetchCategoryProducts(categoryId); // 업데이트 후 목록 새로고침
            } else {
                alert('상품 업데이트 실패: ' + (result.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('상품 업데이트 중 오류:', err);
            alert('상품 업데이트 중 예기치 않은 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="p-6 text-center">상품 및 카테고리 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">에러: {error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold font-aggro text-gray-800 mb-6">
                카테고리 '{currentCategoryName}' 상품 목록
            </h2>

            {products.length === 0 ? (
                <p>이 카테고리에 등록된 상품이 없습니다.</p>
            ) : (
                <ProductList
                    products={products}
                    categories={categories} 
                    editingProduct={editingProduct} 
                    productEditForm={productEditForm} 
                    toggleEditMode={toggleEditMode}
                    handleEditInputChange={handleEditInputChange}
                    handleUpdateProduct={handleUpdateProduct} // productEditForm이 전달될 것임
                />
            )}
        </div>
    );
};

export default CategoryProductList;