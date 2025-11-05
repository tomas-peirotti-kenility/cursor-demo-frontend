import { useState, useEffect, useCallback } from 'react';
import {
  Expense,
  ExpenseInput,
  ExpenseFilters,
  SortField,
  SortOrder,
} from '@/types/expense';
import * as storage from '@/services/storage';

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const loadExpenses = useCallback(() => {
    try {
      setLoading(true);
      const data = storage.getExpenses(filters);
      const sorted = storage.sortExpenses(data, sortField, sortOrder);
      setExpenses(sorted);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, sortField, sortOrder]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const addExpense = useCallback((expenseInput: ExpenseInput) => {
    try {
      storage.createExpense(expenseInput);
      loadExpenses();
      return true;
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  }, [loadExpenses]);

  const updateExpense = useCallback((id: string, updates: Partial<ExpenseInput>) => {
    try {
      storage.updateExpense(id, updates);
      loadExpenses();
      return true;
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  }, [loadExpenses]);

  const removeExpense = useCallback((id: string) => {
    try {
      storage.deleteExpense(id);
      loadExpenses();
      return true;
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  }, [loadExpenses]);

  const setSort = useCallback((field: SortField, order?: SortOrder) => {
    setSortField(field);
    if (order) {
      setSortOrder(order);
    } else {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }
  }, []);

  return {
    expenses,
    loading,
    sortField,
    sortOrder,
    addExpense,
    updateExpense,
    removeExpense,
    setSort,
    refresh: loadExpenses,
  };
}

