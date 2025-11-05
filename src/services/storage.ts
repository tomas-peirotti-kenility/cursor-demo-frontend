import { Expense, ExpenseFilters, ExpenseSortOptions } from '@/types/expense';
import { Category, CategoryWithStats } from '@/types/category';
import { DEFAULT_CATEGORIES } from '@/constants/default-categories';
import { generateId } from '@/lib/utils';
import { isDateInRange, serializeDate, deserializeDate } from '@/lib/date-utils';
import { startOfMonth, endOfMonth } from 'date-fns';

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  INITIALIZED: 'initialized',
} as const;

// Serialization helpers
function serializeExpense(expense: Expense): any {
  return {
    ...expense,
    date: serializeDate(expense.date),
    createdAt: serializeDate(expense.createdAt),
    updatedAt: serializeDate(expense.updatedAt),
  };
}

function deserializeExpense(data: any): Expense {
  return {
    ...data,
    date: deserializeDate(data.date),
    createdAt: deserializeDate(data.createdAt),
    updatedAt: deserializeDate(data.updatedAt),
  };
}

function serializeCategory(category: Category): any {
  return {
    ...category,
    createdAt: serializeDate(category.createdAt),
  };
}

function deserializeCategory(data: any): Category {
  return {
    ...data,
    createdAt: deserializeDate(data.createdAt),
  };
}

// Initialize storage with default categories
export function initializeStorage(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    const defaultCategories: Category[] = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: generateId(),
      createdAt: new Date(),
    }));
    
    localStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(defaultCategories.map(serializeCategory))
    );
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Expense CRUD operations
export function getExpenses(
  filters?: ExpenseFilters,
  sort?: ExpenseSortOptions,
  page?: number,
  limit?: number
): { expenses: Expense[]; total: number } {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  let expenses: Expense[] = data
    ? JSON.parse(data).map(deserializeExpense)
    : [];

  // Apply filters
  if (filters) {
    expenses = expenses.filter(expense => {
      // Date range filter
      if (!isDateInRange(expense.date, filters.dateFrom, filters.dateTo)) {
        return false;
      }

      // Category filter
      if (filters.category && expense.category !== filters.category) {
        return false;
      }

      // Amount range filter
      if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }

  // Apply sorting
  if (sort) {
    expenses.sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (sort.field === 'date') {
        aVal = a.date.getTime();
        bVal = b.date.getTime();
      } else if (sort.field === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (sort.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  } else {
    // Default sort by date descending
    expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  const total = expenses.length;

  // Apply pagination
  if (page !== undefined && limit !== undefined) {
    const start = (page - 1) * limit;
    expenses = expenses.slice(start, start + limit);
  }

  return { expenses, total };
}

export function getExpenseById(id: string): Expense | null {
  const { expenses } = getExpenses();
  return expenses.find(e => e.id === id) || null;
}

export function createExpense(
  data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Expense {
  const { expenses } = getExpenses();
  
  const newExpense: Expense = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  expenses.push(newExpense);
  localStorage.setItem(
    STORAGE_KEYS.EXPENSES,
    JSON.stringify(expenses.map(serializeExpense))
  );

  return newExpense;
}

export function updateExpense(
  id: string,
  data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
): Expense | null {
  const { expenses } = getExpenses();
  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) return null;

  expenses[index] = {
    ...expenses[index],
    ...data,
    updatedAt: new Date(),
  };

  localStorage.setItem(
    STORAGE_KEYS.EXPENSES,
    JSON.stringify(expenses.map(serializeExpense))
  );

  return expenses[index];
}

export function deleteExpense(id: string): boolean {
  const { expenses } = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);

  if (filtered.length === expenses.length) return false;

  localStorage.setItem(
    STORAGE_KEYS.EXPENSES,
    JSON.stringify(filtered.map(serializeExpense))
  );

  return true;
}

// Category CRUD operations
export function getCategories(): Category[] {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data).map(deserializeCategory) : [];
}

export function getCategoryById(id: string): Category | null {
  const categories = getCategories();
  return categories.find(c => c.id === id) || null;
}

export function getCategoriesWithStats(): CategoryWithStats[] {
  const categories = getCategories();
  const { expenses } = getExpenses();

  return categories.map(category => {
    const categoryExpenses = expenses.filter(e => e.category === category.name);
    const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    const transactionCount = categoryExpenses.length;

    return {
      ...category,
      totalSpent,
      transactionCount,
    };
  });
}

export function createCategory(
  data: Omit<Category, 'id' | 'createdAt'>
): Category | null {
  const categories = getCategories();

  // Check for duplicate name
  if (categories.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error('Category name already exists');
  }

  const newCategory: Category = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  };

  categories.push(newCategory);
  localStorage.setItem(
    STORAGE_KEYS.CATEGORIES,
    JSON.stringify(categories.map(serializeCategory))
  );

  return newCategory;
}

export function updateCategory(
  id: string,
  data: Partial<Omit<Category, 'id' | 'createdAt'>>
): Category | null {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) return null;

  // Check for duplicate name if name is being updated
  if (data.name) {
    const duplicate = categories.find(
      c => c.id !== id && c.name.toLowerCase() === data.name!.toLowerCase()
    );
    if (duplicate) {
      throw new Error('Category name already exists');
    }
  }

  const oldName = categories[index].name;
  categories[index] = {
    ...categories[index],
    ...data,
  };

  localStorage.setItem(
    STORAGE_KEYS.CATEGORIES,
    JSON.stringify(categories.map(serializeCategory))
  );

  // Update expenses with the old category name
  if (data.name && data.name !== oldName) {
    const { expenses } = getExpenses();
    const updatedExpenses = expenses.map(expense =>
      expense.category === oldName
        ? { ...expense, category: data.name!, updatedAt: new Date() }
        : expense
    );
    localStorage.setItem(
      STORAGE_KEYS.EXPENSES,
      JSON.stringify(updatedExpenses.map(serializeExpense))
    );
  }

  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  
  if (!category) return false;

  // Check if category is in use
  const { expenses } = getExpenses();
  const inUse = expenses.some(e => e.category === category.name);
  
  if (inUse) {
    throw new Error('Cannot delete category that is in use');
  }

  const filtered = categories.filter(c => c.id !== id);
  localStorage.setItem(
    STORAGE_KEYS.CATEGORIES,
    JSON.stringify(filtered.map(serializeCategory))
  );

  return true;
}

// Analytics and summaries
export function getMonthlyTotal(month: Date = new Date()): number {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  const { expenses } = getExpenses({ dateFrom: start, dateTo: end });
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getCategoryBreakdown(month: Date = new Date()): {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  const { expenses } = getExpenses({ dateFrom: start, dateTo: end });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const breakdown = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { amount: 0, count: 0 };
    }
    acc[expense.category].amount += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  return Object.entries(breakdown).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count,
    percentage: total > 0 ? (data.amount / total) * 100 : 0,
  }));
}

export function getMonthlyTrend(months: number = 6): {
  month: Date;
  amount: number;
}[] {
  const result: { month: Date; amount: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const amount = getMonthlyTotal(month);
    result.push({ month, amount });
  }

  return result;
}

export function getDashboardStats(month: Date = new Date()) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  const { expenses } = getExpenses({ dateFrom: start, dateTo: end });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const transactionCount = expenses.length;

  // Calculate top category
  const breakdown = getCategoryBreakdown(month);
  const topCategory = breakdown.length > 0
    ? breakdown.reduce((max, cat) => cat.amount > max.amount ? cat : max)
    : null;

  // Calculate average daily spend
  const daysInMonth = end.getDate();
  const avgDailySpend = total / daysInMonth;

  return {
    totalSpend: total,
    transactionCount,
    topCategory: topCategory?.category || 'N/A',
    avgDailySpend,
  };
}

