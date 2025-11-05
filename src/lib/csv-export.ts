import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { formatCurrency } from './utils';

export function exportExpensesToCSV(expenses: Expense[]): void {
  // CSV Headers
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Created At'];
  
  // CSV Rows
  const rows = expenses.map(expense => [
    format(expense.date, 'yyyy-MM-dd'),
    `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
    expense.category,
    formatCurrency(expense.amount),
    format(expense.createdAt, 'yyyy-MM-dd HH:mm:ss'),
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = `expenses-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

