export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseFilters {
  search?: string
  dateFrom?: Date
  dateTo?: Date
  category?: string
  minAmount?: number
  maxAmount?: number
}

export type SortField = 'date' | 'amount' | 'category' | 'description'
export type SortOrder = 'asc' | 'desc'

export interface ExpenseSortOptions {
  field: SortField
  order: SortOrder
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface ExpenseStats {
  totalSpend: number
  transactionCount: number
  topCategory: string
  avgDailySpend: number
  categoryBreakdown: Record<string, number>
}

