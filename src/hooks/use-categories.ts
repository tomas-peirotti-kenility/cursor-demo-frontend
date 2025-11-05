import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryInput } from '@/types/category';
import * as storage from '@/services/storage';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(() => {
    try {
      setLoading(true);
      const data = storage.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback((categoryInput: CategoryInput) => {
    try {
      storage.createCategory(categoryInput);
      loadCategories();
      return true;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  }, [loadCategories]);

  const updateCategory = useCallback((id: string, updates: Partial<CategoryInput>) => {
    try {
      storage.updateCategory(id, updates);
      loadCategories();
      return true;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  }, [loadCategories]);

  const removeCategory = useCallback((id: string) => {
    try {
      storage.deleteCategory(id);
      loadCategories();
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  }, [loadCategories]);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    removeCategory,
    refresh: loadCategories,
  };
}

