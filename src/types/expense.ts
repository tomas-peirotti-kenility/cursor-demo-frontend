export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type ExpenseUpdate = Partial<ExpenseInput> & { id: string };

export interface ExpenseFilters {
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export type SortField = 'date' | 'amount' | 'category' | 'description';
export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

