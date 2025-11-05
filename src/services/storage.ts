import {
  Expense,
  ExpenseInput,
  ExpenseFilters,
  SortField,
  SortOrder,
  PaginationParams,
  PaginationResult,
} from '@/types/expense';
import { Category, CategoryInput } from '@/types/category';
import { DEFAULT_CATEGORIES } from '@/constants/default-categories';
import { format } from 'date-fns';

const EXPENSES_KEY = 'expenses';
const CATEGORIES_KEY = 'categories';

// Initialize storage with default categories on first load
export function initializeStorage(): void {
  const categories = localStorage.getItem(CATEGORIES_KEY);
  if (!categories) {
    const defaultCategories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }));
    saveCategories(defaultCategories);
  }

  const expenses = localStorage.getItem(EXPENSES_KEY);
  if (!expenses) {
    saveExpenses([]);
  }
}

// Serialization helpers
function saveExpenses(expenses: Expense[]): void {
  try {
    const serialized = JSON.stringify(expenses);
    localStorage.setItem(EXPENSES_KEY, serialized);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete old expenses.');
    }
    throw error;
  }
}

function loadExpenses(): Expense[] {
  const data = localStorage.getItem(EXPENSES_KEY);
  if (!data) return [];

  const parsed = JSON.parse(data);
  return parsed.map((expense: Expense) => ({
    ...expense,
    date: new Date(expense.date),
    createdAt: new Date(expense.createdAt),
    updatedAt: new Date(expense.updatedAt),
  }));
}

function saveCategories(categories: Category[]): void {
  try {
    const serialized = JSON.stringify(categories);
    localStorage.setItem(CATEGORIES_KEY, serialized);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded.');
    }
    throw error;
  }
}

function loadCategories(): Category[] {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) return [];

  const parsed = JSON.parse(data);
  return parsed.map((category: Category) => ({
    ...category,
    createdAt: new Date(category.createdAt),
  }));
}

// Expense CRUD operations
export function getExpenses(filters?: ExpenseFilters): Expense[] {
  const expenses = loadExpenses();
  if (!filters) return expenses;

  return filterExpenses(expenses, filters);
}

export function getExpenseById(id: string): Expense | null {
  const expenses = loadExpenses();
  return expenses.find((exp) => exp.id === id) || null;
}

export function createExpense(expenseInput: ExpenseInput): Expense {
  const expenses = loadExpenses();
  const now = new Date();

  const newExpense: Expense = {
    ...expenseInput,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
}

export function updateExpense(id: string, updates: Partial<ExpenseInput>): Expense {
  const expenses = loadExpenses();
  const index = expenses.findIndex((exp) => exp.id === id);

  if (index === -1) {
    throw new Error(`Expense with id ${id} not found`);
  }

  const updatedExpense: Expense = {
    ...expenses[index],
    ...updates,
    updatedAt: new Date(),
  };

  expenses[index] = updatedExpense;
  saveExpenses(expenses);
  return updatedExpense;
}

export function deleteExpense(id: string): void {
  const expenses = loadExpenses();
  const filtered = expenses.filter((exp) => exp.id !== id);
  saveExpenses(filtered);
}

// Category CRUD operations
export function getCategories(): Category[] {
  return loadCategories();
}

export function getCategoryById(id: string): Category | null {
  const categories = loadCategories();
  return categories.find((cat) => cat.id === id) || null;
}

export function createCategory(categoryInput: CategoryInput): Category {
  const categories = loadCategories();

  // Check for uniqueness
  if (categories.some((cat) => cat.name.toLowerCase() === categoryInput.name.toLowerCase())) {
    throw new Error('Category name must be unique');
  }

  const newCategory: Category = {
    ...categoryInput,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };

  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
}

export function updateCategory(id: string, updates: Partial<CategoryInput>): Category {
  const categories = loadCategories();
  const index = categories.findIndex((cat) => cat.id === id);

  if (index === -1) {
    throw new Error(`Category with id ${id} not found`);
  }

  // Check for uniqueness if name is being updated
  if (updates.name) {
    const nameExists = categories.some(
      (cat) => cat.id !== id && cat.name.toLowerCase() === updates.name!.toLowerCase()
    );
    if (nameExists) {
      throw new Error('Category name must be unique');
    }
  }

  const updatedCategory: Category = {
    ...categories[index],
    ...updates,
  };

  categories[index] = updatedCategory;
  saveCategories(categories);
  return updatedCategory;
}

export function deleteCategory(id: string): void {
  const category = getCategoryById(id);
  if (!category) {
    throw new Error(`Category with id ${id} not found`);
  }

  // Check for dependent expenses
  const expenses = loadExpenses();
  const hasExpenses = expenses.some((exp) => exp.category === category.name);

  if (hasExpenses) {
    throw new Error(
      `Cannot delete category "${category.name}" because it has associated expenses. ` +
        `Please reassign or delete those expenses first.`
    );
  }

  const categories = loadCategories();
  const filtered = categories.filter((cat) => cat.id !== id);
  saveCategories(filtered);
}

// Query operations
export function getExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
  const expenses = loadExpenses();
  return expenses.filter((exp) => exp.date >= startDate && exp.date <= endDate);
}

export function getExpensesByCategory(categoryName: string): Expense[] {
  const expenses = loadExpenses();
  return expenses.filter((exp) => exp.category === categoryName);
}

export function getMonthlySummary(month: number, year: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const expenses = getExpensesByDateRange(startDate, endDate);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;
  const byCategory = calculateCategorySummary(month, year);

  return {
    total,
    count,
    average,
    byCategory,
  };
}

export function calculateCategorySummary(month: number, year: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const expenses = getExpensesByDateRange(startDate, endDate);

  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0 };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );
}

export function getTotalExpenses(): number {
  const expenses = loadExpenses();
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

// Filtering logic
function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.minAmount !== undefined && expense.amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) return false;
    if (
      filters.searchTerm &&
      !expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

// Sorting logic
export function sortExpenses(
  expenses: Expense[],
  field: SortField,
  order: SortOrder = 'desc'
): Expense[] {
  return [...expenses].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

// Pagination logic
export function paginateExpenses(
  expenses: Expense[],
  params: PaginationParams
): PaginationResult<Expense> {
  const { page, limit } = params;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: expenses.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(expenses.length / limit),
      totalItems: expenses.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < expenses.length,
      hasPreviousPage: page > 1,
    },
  };
}

// CSV Export
export function exportToCSV(): void {
  const expenses = loadExpenses();

  const CSV_COLUMNS = ['Date', 'Description', 'Category', 'Amount', 'Created At'];

  const formatExpenseForCSV = (expense: Expense): string[] => {
    return [
      format(expense.date, 'yyyy-MM-dd'),
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.category,
      `$${expense.amount.toFixed(2)}`,
      format(expense.createdAt, 'yyyy-MM-dd HH:mm:ss'),
    ];
  };

  const BOM = '\uFEFF';
  const header = CSV_COLUMNS.join(',');
  const rows = expenses.map((exp) => formatExpenseForCSV(exp).join(','));
  const csv = BOM + [header, ...rows].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = `expenses-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
  localStorage.removeItem(EXPENSES_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  initializeStorage();
}

