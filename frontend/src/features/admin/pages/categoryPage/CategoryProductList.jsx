// src/features/admin/pages/categoryPage/CategoryProductList.jsx

import React, { useEffect, useState, useCallback } from 'react';
import ProductList from '../productPage/ProductList';
import { getAllProducts, updateProduct, deleteProduct } from '../../api/productApi';
import { fetchCategories } from '../../api/categoryApi'; // fetchCategories는 useCategoryManagement 훅 내부에서 사용되므로 여기서는 직접 필요 없을 수 있음. 다만, CategoryProductList 자체에서 categories를 가져와야 하므로 유지.

const CategoryProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCategoryName, setCurrentCategoryName] = useState('');

    const [editingProduct, setEditingProduct] = useState(null);

    // 카테고리 목록을 불러오는 함수
    // fetchCategories의 반환값이 { success, data } 형태임을 가정하고 수정
    const fetchAllCategories = useCallback(async () => {
        try {
            const result = await fetchCategories(); // api/categoryApi.js의 fetchCategories
            if (result.success && Array.isArray(result.data)) {
                setCategories(result.data);
            } else {
                console.error("카테고리 불러오기 실패 또는 데이터 형식이 올바르지 않음:", result.message || "알 수 없는 오류");
                setError(result.message || "카테고리 목록을 불러오는 데 실패했습니다.");
                setCategories([]);
            }
        } catch (err) {
            console.error("카테고리 API 호출 에러:", err);
            setError("카테고리 목록 API 호출 중 예상치 못한 오류 발생.");
            setCategories([]);
        }
    }, []);

    const fetchCategoryProducts = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        setProducts([]); // 새로운 상품 목록 로딩 전에 기존 목록을 비움
        setEditingProduct(null); // 상품 목록 로딩 시 수정 모드 초기화

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
                // API 호출은 성공했지만 데이터가 없거나 형식 오류일 경우
                setError(result.message || '카테고리 상품을 불러오는 데 실패했습니다.');
                setProducts([]); // 실패 시 빈 배열로 설정
            }

        } catch (err) {
            console.error("카테고리 상품 조회 에러:", err);
            setError(err.message || '카테고리 상품을 불러오는 중 오류가 발생했습니다.');
            setProducts([]); // 에러 시 빈 배열로 설정
        } finally {
            setLoading(false);
        }
    }, []);

    // 카테고리 목록을 마운트 시 한 번 불러옴
    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    // categoryId가 변경될 때마다 해당 카테고리의 상품 목록을 불러옴
    useEffect(() => {
        if (categoryId) {
            fetchCategoryProducts(categoryId);
        } else if (!categoryId && !loading) { // categoryId가 없는데 로딩이 끝난 경우 (초기 상태일 수 있음)
            setError('표시할 카테고리가 선택되지 않았습니다.');
            setProducts([]); // categoryId가 없으면 상품 목록도 비움
        }
    }, [categoryId, fetchCategoryProducts, loading]);

    // categoryId 또는 categories 목록이 변경될 때 현재 카테고리 이름 업데이트
    useEffect(() => {
        if (categoryId && categories.length > 0) {
            const category = categories.find(cat => cat.category_id === Number(categoryId));
            // 카테고리를 찾으면 이름으로, 없으면 ID로 표시
            setCurrentCategoryName(category ? category.name : `ID: ${categoryId}`);
        } else {
            setCurrentCategoryName(''); // categoryId가 없거나 카테고리 목록이 없으면 빈 문자열
        }
    }, [categoryId, categories]);


    // === ProductList에 필요한 핸들러 함수들 ===

    const toggleEditMode = (product) => {
        setEditingProduct(product ? { ...product } : null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        try {
            const result = await updateProduct(productId, updatedData);
            if (result.success) {
                alert('상품이 성공적으로 업데이트되었습니다.');
                setEditingProduct(null); // 수정 모드 종료
                fetchCategoryProducts(categoryId); // 업데이트 후 목록 새로고침
            } else {
                alert('상품 업데이트 실패: ' + (result.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('상품 업데이트 중 오류:', err);
            alert('상품 업데이트 중 예기치 않은 오류가 발생했습니다.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            try {
                const result = await deleteProduct(productId);
                if (result.success) {
                    alert('상품이 성공적으로 삭제되었습니다.');
                    fetchCategoryProducts(categoryId); // 삭제 후 목록 새로고침
                } else {
                    alert('상품 삭제 실패: ' + (result.message || '알 수 없는 오류'));
                }
            } catch (err) {
                console.error('상품 삭제 중 오류:', err);
                alert('상품 삭제 중 예기치 않은 오류가 발생했습니다.');
            }
        }
    };

    // ⭐ 로딩 중일 때 스켈레톤 UI를 표시 ⭐
    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-4xl font-bold font-aggro text-gray-800 mb-6">
                    {/* 로딩 중일 때는 카테고리 이름 대신 임시 텍스트 표시 */}
                    카테고리 '{currentCategoryName || (categoryId ? `ID: ${categoryId}` : '불러오는 중...')}' 상품 목록
                </h2>
                {/* 테이블 스켈레톤 */}
                <div className="animate-pulse border border-gray-200 rounded-lg overflow-hidden">
                    {/* 헤더 부분 스켈레톤 */}
                    <div className="h-10 bg-gray-200 w-full"></div>
                    {/* 행 스켈레톤 */}
                    <div className="p-4 space-y-2">
                        {[...Array(5)].map((_, i) => ( // 5개의 행 스켈레톤
                            <div key={i} className="h-8 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="text-center py-6 text-gray-500">상품 및 카테고리 정보를 불러오는 중...</div>
            </div>
        );
    }

    // 에러 발생 시 UI
    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <h2 className="text-4xl font-bold font-aggro text-gray-800 mb-6">
                    카테고리 '{currentCategoryName || (categoryId ? `ID: ${categoryId}` : '')}' 상품 목록
                </h2>
                에러: {error}
            </div>
        );
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
                    toggleEditMode={toggleEditMode}
                    handleEditInputChange={handleEditInputChange}
                    handleUpdateProduct={handleUpdateProduct}
                    handleDeleteProduct={handleDeleteProduct}
                />
            )}
        </div>
    );
};

export default CategoryProductList;