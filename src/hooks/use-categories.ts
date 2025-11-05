import { useState, useEffect, useCallback } from 'react'
import { Category, CategoryStats } from '@/types/category'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryStats } from '@/services/storage'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(() => {
    setLoading(true)
    try {
      const cats = getCategories()
      const stats = getCategoryStats()
      setCategories(cats)
      setCategoryStats(stats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = useCallback(
    async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
      try {
        createCategory(categoryData)
        fetchCategories()
      } catch (error) {
        console.error('Error adding category:', error)
        throw error
      }
    },
    [fetchCategories]
  )

  const editCategory = useCallback(
    async (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => {
      try {
        updateCategory(id, updates)
        fetchCategories()
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      }
    },
    [fetchCategories]
  )

  const removeCategory = useCallback(
    async (id: string) => {
      try {
        deleteCategory(id)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    },
    [fetchCategories]
  )

  return {
    categories,
    categoryStats,
    loading,
    addCategory,
    editCategory,
    removeCategory,
    refresh: fetchCategories,
  }
}

