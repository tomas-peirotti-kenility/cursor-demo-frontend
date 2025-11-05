import { useCallback } from 'react';
import { exportExpensesToCSV } from '@/lib/csv-export';
import * as storage from '@/services/storage';
import { ExpenseFilters } from '@/types/expense';

export function useExport() {
  const exportToCSV = useCallback((filters?: ExpenseFilters) => {
    try {
      const { expenses } = storage.getExpenses(filters);
      exportExpensesToCSV(expenses);
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return false;
    }
  }, []);

  return { exportToCSV };
}

