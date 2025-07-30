// features/admin/components/category/hooks/useCategoryManagements.js
import { useState, useEffect, useCallback } from 'react';
// updateCategory API 함수를 임포트합니다.
// fetchCategoriesApi는 categoryApi에서 가져온 함수이름이 겹치지 않게 별칭으로 변경
import { addCategory, deleteCategory, fetchCategories as fetchCategoriesFromApi, updateCategory } from '../../../api/categoryApi';

const useCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
    const [showDeleteCategoryForm, setShowDeleteCategoryForm] = useState(false);

    // 카테고리 수정 관련 상태 추가: 현재 수정 중인 카테고리 객체 또는 null
    const [editingCategory, setEditingCategory] = useState(null); 

    // API에서 카테고리 목록을 불러오는 함수 (이름 충돌 방지를 위해 내부 함수 이름을 fetchCategoriesData로 변경)
    const fetchCategoriesData = useCallback(async () => { // ⭐ 함수 이름 변경 ⭐
        setLoading(true);
        setError('');
        try {
            // ⭐ fetchCategoriesFromApi가 { success: true, data: [...] } 객체를 반환 ⭐
            const result = await fetchCategoriesFromApi(); // ⭐ 별칭으로 임포트한 함수 호출 ⭐
            
            if (result.success) { // ⭐ result.success 확인 ⭐
                setCategories(result.data); // ⭐ result.data에 접근하여 배열 설정 ⭐
            } else {
                // API 호출은 성공했으나, success가 false인 경우 (백엔드에서 메시지를 줄 때)
                setError(result.message || '카테고리 목록을 불러오는 데 실패했습니다.');
                setCategories([]); // 실패 시 빈 배열로 설정
            }
        } catch (err) {
            console.error('카테고리 목록 불러오기 오류:', err);
            // API 호출 자체에서 오류 발생한 경우 (네트워크 오류 등)
            setError(err.response?.data?.message || '카테고리 목록을 불러오는 데 실패했습니다.');
            setCategories([]); // 에러 시 빈 배열로 설정
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategoriesData(); // ⭐ 변경된 함수 이름 호출 ⭐
    }, [fetchCategoriesData]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('카테고리 이름을 입력해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await addCategory(newCategoryName);
            if (response.success) {
                await fetchCategoriesData(); // ⭐ 변경된 함수 이름 호출 ⭐
                setShowCategoryForm(false);
                setNewCategoryName('');
            } else {
                setError(response.message || '카테고리 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error('카테고리 추가 오류:', err);
            setError(err.response?.data?.message || '카테고리 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategoryToDelete || !selectedCategoryToDelete.category_id) {
            setError('삭제할 카테고리를 선택해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await deleteCategory(selectedCategoryToDelete.category_id); // category_id 사용
            if (response.success) {
                await fetchCategoriesData(); // ⭐ 변경된 함수 이름 호출 ⭐
                setShowDeleteCategoryForm(false);
                setSelectedCategoryToDelete(null);
            } else {
                setError(response.message || '카테고리 삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('카테고리 삭제 오류:', err);
            setError(err.response?.data?.message || '카테고리 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 수정 처리 함수
    const handleUpdateCategory = async (categoryId, newName) => { // newName은 string
        if (!newName.trim()) {
            setError('새 카테고리 이름을 입력해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // ⭐⭐⭐ 이 줄을 수정했습니다. ⭐⭐⭐
            // categoryApi.js의 updateCategory 함수는 두 번째 인자로 'newName' 문자열을 직접 받습니다.
            // 따라서 이미 { name: newName } 객체를 만들어서 넘겨줄 필요가 없습니다.
            const response = await updateCategory(categoryId, newName); 
            if (response.success) {
                await fetchCategoriesData(); // ⭐ 변경된 함수 이름 호출 ⭐
                setEditingCategory(null); // 수정 폼 닫기
            } else {
                setError(response.message || '카테고리 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error('카테고리 수정 오류:', err);
            setError(err.response?.data?.message || '카테고리 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setShowCategoryForm(true);
        setError('');
        setEditingCategory(null); // 추가 폼 열 때 수정 폼 닫기
        setShowDeleteCategoryForm(false); // 추가 폼 열 때 삭제 폼 닫기
    };

    const closeAddForm = () => {
        setShowCategoryForm(false);
        setNewCategoryName('');
        setError('');
    };

    const openDeleteForm = (category) => {
        setSelectedCategoryToDelete(category); // 여기에서 전체 카테고리 객체를 설정하고 있음
        setShowDeleteCategoryForm(true);
        setError('');
        setEditingCategory(null); // 삭제 폼 열 때 수정 폼 닫기
        setShowCategoryForm(false); // 삭제 폼 열 때 추가 폼 닫기
    };

    const closeDeleteForm = () => {
        setShowDeleteCategoryForm(false);
        setSelectedCategoryToDelete(null);
        setError('');
    };

    // 수정 폼 열기 함수 추가
    const openUpdateForm = (category) => {
        setEditingCategory(category); // 수정할 카테고리 정보 설정
        setShowCategoryForm(false); // 수정 폼 열 때 추가 폼 닫기
        setShowDeleteCategoryForm(false); // 수정 폼 열 때 삭제 폼 닫기
        setError('');
    };

    // 수정 폼 닫기 함수 추가
    const closeUpdateForm = () => {
        setEditingCategory(null); // 수정 폼 닫기
        setError('');
    };

    return {
        categories,
        loading,
        error,
        newCategoryName,
        setNewCategoryName,
        showCategoryForm,
        selectedCategoryToDelete,
        setSelectedCategoryToDelete, 
        showDeleteCategoryForm,
        editingCategory, // 새로 추가된 상태
        setEditingCategory, // 새로 추가된 상태 변경 함수
        fetchCategories: fetchCategoriesData, // ⭐ 외부로 노출되는 이름은 기존 fetchCategories로 유지 ⭐
        handleAddCategory,
        handleDeleteCategory,
        handleUpdateCategory, // 새로 추가된 함수
        openAddForm,
        closeAddForm,
        openDeleteForm,
        closeDeleteForm,
        openUpdateForm, // 새로 추가된 함수
        closeUpdateForm, // 새로 추가된 함수
    };
};

export default useCategoryManagement;