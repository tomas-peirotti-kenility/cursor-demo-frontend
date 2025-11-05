import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFilters, ExpenseSortOptions } from '@/types/expense';
import * as storage from '@/services/storage';

export function useExpenses(
  filters?: ExpenseFilters,
  sort?: ExpenseSortOptions,
  page?: number,
  limit?: number
) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(() => {
    setLoading(true);
    try {
      const result = storage.getExpenses(filters, sort, page, limit);
      setExpenses(result.expenses);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page, limit]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const createExpense = useCallback(
    (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        storage.createExpense(data);
        loadExpenses();
        return true;
      } catch (error) {
        console.error('Error creating expense:', error);
        return false;
      }
    },
    [loadExpenses]
  );

  const updateExpense = useCallback(
    (id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
      try {
        storage.updateExpense(id, data);
        loadExpenses();
        return true;
      } catch (error) {
        console.error('Error updating expense:', error);
        return false;
      }
    },
    [loadExpenses]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      try {
        storage.deleteExpense(id);
        loadExpenses();
        return true;
      } catch (error) {
        console.error('Error deleting expense:', error);
        return false;
      }
    },
    [loadExpenses]
  );

  return {
    expenses,
    total,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    refresh: loadExpenses,
  };
}

