import { useState, useEffect, useCallback } from 'react';

import { addCategory, deleteCategory, fetchCategories as fetchCategoriesApi } from '../../../api/adminApi';


const useCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDeleteCategoryForm, setShowDeleteCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedCategories = await fetchCategoriesApi();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('카테고리 목록 불러오기 오류:', err);
      setError('카테고리 목록을 불러오는 데 실패했습니다.');
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
      setError('카테고리명을 입력하세요');
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
      setError('카테고리 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryToDelete) {
      setError('삭제할 카테고리를 선택하세요');
      return;
    }

    const selectedCategory = categories.find(cat => cat.category_id.toString() === selectedCategoryToDelete);
    if (!selectedCategory) {
      setError('선택된 카테고리를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await deleteCategory(selectedCategory.category_id); // productApi에서 가져온 deleteCategory 사용
      if (response.success) {
        await fetchCategories();
        setShowDeleteCategoryForm(false);
        setSelectedCategoryToDelete('');
      } else {
        setError(response.message || '카테고리 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('카테고리 삭제 오류:', err);
      setError('카테고리 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryForm = () => {
    setShowCategoryForm(prev => !prev);
    if (showCategoryForm) {
      setNewCategoryName('');
      setError('');
    }
  };

  const toggleDeleteCategoryForm = () => {
    setShowDeleteCategoryForm(prev => !prev);
    if (showDeleteCategoryForm) {
      setSelectedCategoryToDelete('');
      setError('');
    }
  };

  return {
    categories,
    newCategoryName,
    setNewCategoryName,
    selectedCategoryToDelete,
    setSelectedCategoryToDelete,
    showCategoryForm,
    showDeleteCategoryForm,
    loading,
    error,
    handleAddCategory,
    handleDeleteCategory,
    toggleCategoryForm,
    toggleDeleteCategoryForm,
    fetchCategories
  };
};

export default useCategoryManagement;