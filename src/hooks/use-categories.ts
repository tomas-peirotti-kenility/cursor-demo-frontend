import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryWithStats } from '@/types/category';
import * as storage from '@/services/storage';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(() => {
    setLoading(true);
    try {
      const result = storage.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createCategory = useCallback(
    (data: Omit<Category, 'id' | 'createdAt'>) => {
      try {
        storage.createCategory(data);
        loadCategories();
        return { success: true, error: null };
      } catch (error: any) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
      }
    },
    [loadCategories]
  );

  const updateCategory = useCallback(
    (id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>) => {
      try {
        storage.updateCategory(id, data);
        loadCategories();
        return { success: true, error: null };
      } catch (error: any) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
      }
    },
    [loadCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      try {
        storage.deleteCategory(id);
        loadCategories();
        return { success: true, error: null };
      } catch (error: any) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
      }
    },
    [loadCategories]
  );

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories,
  };
}

export function useCategoriesWithStats() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(() => {
    setLoading(true);
    try {
      const result = storage.getCategoriesWithStats();
      setCategories(result);
    } catch (error) {
      console.error('Error loading categories with stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    refresh: loadCategories,
  };
}

