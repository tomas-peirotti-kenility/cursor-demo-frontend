import { Expense, ExpenseFilters, ExpenseSortOptions, PaginationOptions, ExpenseStats } from '@/types/expense'
import { Category, CategoryStats } from '@/types/category'
import { DEFAULT_CATEGORIES } from '@/constants/default-categories'
import { serializeDate, deserializeDate, isDateInRange, getCurrentMonthRange } from '@/lib/date-utils'
import { startOfMonth, endOfMonth, subMonths, differenceInDays } from 'date-fns'

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  INITIALIZED: 'initialized',
}

// Initialize storage with default categories on first load
export function initializeStorage(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  
  if (!initialized) {
    const defaultCategories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }))
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories))
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
}

// Helper functions for serialization
function serializeExpense(expense: Expense): Record<string, unknown> {
  return {
    ...expense,
    date: serializeDate(expense.date),
    createdAt: serializeDate(expense.createdAt),
    updatedAt: serializeDate(expense.updatedAt),
  }
}

function deserializeExpense(data: Record<string, unknown>): Expense {
  return {
    ...data,
    date: deserializeDate(data.date as string),
    createdAt: deserializeDate(data.createdAt as string),
    updatedAt: deserializeDate(data.updatedAt as string),
  } as Expense
}

function serializeCategory(category: Category): Record<string, unknown> {
  return {
    ...category,
    createdAt: serializeDate(category.createdAt),
  }
}

function deserializeCategory(data: Record<string, unknown>): Category {
  return {
    ...data,
    createdAt: deserializeDate(data.createdAt as string),
  } as Category
}

// Expense CRUD Operations
export function getExpenses(
  filters?: ExpenseFilters,
  sort?: ExpenseSortOptions,
  pagination?: PaginationOptions
): { expenses: Expense[]; total: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    let expenses: Expense[] = data ? JSON.parse(data).map(deserializeExpense) : []
    
    // Apply filters
    if (filters) {
      expenses = expenses.filter((expense) => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          if (!expense.description.toLowerCase().includes(searchLower)) {
            return false
          }
        }
        
        if (filters.category && expense.category !== filters.category) {
          return false
        }
        
        if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
          return false
        }
        
        if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
          return false
        }
        
        if (!isDateInRange(expense.date, filters.dateFrom, filters.dateTo)) {
          return false
        }
        
        return true
      })
    }
    
    // Apply sorting
    if (sort) {
      expenses.sort((a, b) => {
        let comparison = 0
        
        switch (sort.field) {
          case 'date':
            comparison = a.date.getTime() - b.date.getTime()
            break
          case 'amount':
            comparison = a.amount - b.amount
            break
          case 'category':
            comparison = a.category.localeCompare(b.category)
            break
          case 'description':
            comparison = a.description.localeCompare(b.description)
            break
        }
        
        return sort.order === 'asc' ? comparison : -comparison
      })
    } else {
      // Default sort by date descending
      expenses.sort((a, b) => b.date.getTime() - a.date.getTime())
    }
    
    const total = expenses.length
    
    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      expenses = expenses.slice(start, end)
    }
    
    return { expenses, total }
  } catch (error) {
    console.error('Error getting expenses:', error)
    return { expenses: [], total: 0 }
  }
}

export function getExpenseById(id: string): Expense | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    const expenses: Expense[] = data ? JSON.parse(data).map(deserializeExpense) : []
    return expenses.find((e) => e.id === id) || null
  } catch (error) {
    console.error('Error getting expense by id:', error)
    return null
  }
}

export function createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    const expenses: Expense[] = data ? JSON.parse(data).map(deserializeExpense) : []
    
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    expenses.push(newExpense)
    localStorage.setItem(
      STORAGE_KEYS.EXPENSES,
      JSON.stringify(expenses.map(serializeExpense))
    )
    
    return newExpense
  } catch (error) {
    console.error('Error creating expense:', error)
    throw new Error('Failed to create expense')
  }
}

export function updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    const expenses: Expense[] = data ? JSON.parse(data).map(deserializeExpense) : []
    
    const index = expenses.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date(),
    }
    
    localStorage.setItem(
      STORAGE_KEYS.EXPENSES,
      JSON.stringify(expenses.map(serializeExpense))
    )
    
    return expenses[index]
  } catch (error) {
    console.error('Error updating expense:', error)
    throw new Error('Failed to update expense')
  }
}

export function deleteExpense(id: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    let expenses: Expense[] = data ? JSON.parse(data).map(deserializeExpense) : []
    
    expenses = expenses.filter((e) => e.id !== id)
    
    localStorage.setItem(
      STORAGE_KEYS.EXPENSES,
      JSON.stringify(expenses.map(serializeExpense))
    )
  } catch (error) {
    console.error('Error deleting expense:', error)
    throw new Error('Failed to delete expense')
  }
}

// Category CRUD Operations
export function getCategories(): Category[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data).map(deserializeCategory) : []
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}

export function getCategoryById(id: string): Category | null {
  try {
    const categories = getCategories()
    return categories.find((c) => c.id === id) || null
  } catch (error) {
    console.error('Error getting category by id:', error)
    return null
  }
}

export function createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Category {
  try {
    const categories = getCategories()
    
    // Check for unique name
    if (categories.some((c) => c.name.toLowerCase() === categoryData.name.toLowerCase())) {
      throw new Error('Category name already exists')
    }
    
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    
    categories.push(newCategory)
    localStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories.map(serializeCategory))
    )
    
    return newCategory
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category {
  try {
    const categories = getCategories()
    
    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    // Check for unique name if name is being updated
    if (updates.name) {
      const nameExists = categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === updates.name!.toLowerCase()
      )
      if (nameExists) {
        throw new Error('Category name already exists')
      }
    }
    
    categories[index] = {
      ...categories[index],
      ...updates,
    }
    
    localStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories.map(serializeCategory))
    )
    
    return categories[index]
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export function deleteCategory(id: string): void {
  try {
    let categories = getCategories()
    
    // Check if category is in use
    const { expenses } = getExpenses()
    const categoryInUse = expenses.some((e) => e.category === categories.find((c) => c.id === id)?.name)
    
    if (categoryInUse) {
      throw new Error('Cannot delete category that is in use')
    }
    
    categories = categories.filter((c) => c.id !== id)
    
    localStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories.map(serializeCategory))
    )
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Statistics and Analytics
export function getExpenseStats(monthsAgo: number = 0): ExpenseStats {
  try {
    const { start, end } = monthsAgo === 0 
      ? getCurrentMonthRange() 
      : {
          start: startOfMonth(subMonths(new Date(), monthsAgo)),
          end: endOfMonth(subMonths(new Date(), monthsAgo)),
        }
    
    const { expenses } = getExpenses({
      dateFrom: start,
      dateTo: end,
    })
    
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0)
    const transactionCount = expenses.length
    
    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    expenses.forEach((expense) => {
      categoryBreakdown[expense.category] = 
        (categoryBreakdown[expense.category] || 0) + expense.amount
    })
    
    // Top category
    let topCategory = 'None'
    let maxAmount = 0
    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount
        topCategory = category
      }
    })
    
    // Average daily spend
    const daysInMonth = differenceInDays(end, start) + 1
    const avgDailySpend = totalSpend / daysInMonth
    
    return {
      totalSpend,
      transactionCount,
      topCategory,
      avgDailySpend,
      categoryBreakdown,
    }
  } catch (error) {
    console.error('Error getting expense stats:', error)
    return {
      totalSpend: 0,
      transactionCount: 0,
      topCategory: 'None',
      avgDailySpend: 0,
      categoryBreakdown: {},
    }
  }
}

export function getMonthlySpending(months: number = 6): { month: string; amount: number }[] {
  try {
    const result: { month: string; amount: number }[] = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      
      const { expenses } = getExpenses({
        dateFrom: start,
        dateTo: end,
      })
      
      const amount = expenses.reduce((sum, e) => sum + e.amount, 0)
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short' })
      
      result.push({ month: monthLabel, amount })
    }
    
    return result
  } catch (error) {
    console.error('Error getting monthly spending:', error)
    return []
  }
}

export function getCategoryStats(): CategoryStats[] {
  try {
    const categories = getCategories()
    const { expenses } = getExpenses()
    
    return categories.map((category) => {
      const categoryExpenses = expenses.filter((e) => e.category === category.name)
      const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      const transactionCount = categoryExpenses.length
      
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        totalSpent,
        transactionCount,
      }
    })
  } catch (error) {
    console.error('Error getting category stats:', error)
    return []
  }
}

// Initialize on module load
initializeStorage()

