export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface ExpenseFilters {
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ExpenseSortOptions {
  field: 'date' | 'amount' | 'category' | 'description';
  direction: 'asc' | 'desc';
}

