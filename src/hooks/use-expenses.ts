import { useState, useEffect, useCallback } from 'react'
import { Expense, ExpenseFilters, ExpenseSortOptions, PaginationOptions } from '@/types/expense'
import { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseStats } from '@/services/storage'

export function useExpenses(
  initialFilters?: ExpenseFilters,
  initialSort?: ExpenseSortOptions,
  initialPagination?: PaginationOptions
) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<ExpenseFilters | undefined>(initialFilters)
  const [sort, setSort] = useState<ExpenseSortOptions | undefined>(initialSort)
  const [pagination, setPagination] = useState<PaginationOptions | undefined>(initialPagination)
  const [loading, setLoading] = useState(true)

  const fetchExpenses = useCallback(() => {
    setLoading(true)
    try {
      const result = getExpenses(filters, sort, pagination)
      setExpenses(result.expenses)
      setTotal(result.total)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, pagination])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = useCallback(
    async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        createExpense(expenseData)
        fetchExpenses()
      } catch (error) {
        console.error('Error adding expense:', error)
        throw error
      }
    },
    [fetchExpenses]
  )

  const editExpense = useCallback(
    async (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
      try {
        updateExpense(id, updates)
        fetchExpenses()
      } catch (error) {
        console.error('Error updating expense:', error)
        throw error
      }
    },
    [fetchExpenses]
  )

  const removeExpense = useCallback(
    async (id: string) => {
      try {
        deleteExpense(id)
        fetchExpenses()
      } catch (error) {
        console.error('Error deleting expense:', error)
        throw error
      }
    },
    [fetchExpenses]
  )

  const stats = getExpenseStats()

  return {
    expenses,
    total,
    loading,
    filters,
    setFilters,
    sort,
    setSort,
    pagination,
    setPagination,
    addExpense,
    editExpense,
    removeExpense,
    refresh: fetchExpenses,
    stats,
  }
}

