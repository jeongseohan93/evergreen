// features/admin/components/category/hooks/useCategoryManagements.js
import { useState, useEffect, useCallback } from 'react';
import { addCategory, deleteCategory, fetchCategories as fetchCategoriesApi } from '../../../api/categoryApi';

const useCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
    const [showDeleteCategoryForm, setShowDeleteCategoryForm] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const fetchedCategoriesArray = await fetchCategoriesApi();
            setCategories(fetchedCategoriesArray);
        } catch (err) {
            console.error('카테고리 목록 불러오기 오류:', err);
            setError(err.response?.data?.message || '카테고리 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
                await fetchCategories();
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
        // 이 부분은 selectedCategoryToDelete가 `category_id` 자체가 아니라
        // 전체 카테고리 객체여야 정상 작동할 거야. (openDeleteForm에서 객체를 넘겨주므로)
        if (!selectedCategoryToDelete || !selectedCategoryToDelete.category_id) {
            setError('삭제할 카테고리를 선택해주세요.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await deleteCategory(selectedCategoryToDelete.category_id); // category_id 사용
            if (response.success) {
                await fetchCategories();
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

    const openAddForm = () => {
        setShowCategoryForm(true);
        setError('');
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
    };

    const closeDeleteForm = () => {
        setShowDeleteCategoryForm(false);
        setSelectedCategoryToDelete(null);
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
        setSelectedCategoryToDelete, // 👈👈👈 이 줄을 추가해야 해!
        showDeleteCategoryForm,
        fetchCategories,
        handleAddCategory,
        handleDeleteCategory,
        openAddForm,
        closeAddForm,
        openDeleteForm,
        closeDeleteForm,
    };
};

export default useCategoryManagement;