import { useState, useMemo } from 'react';
import { PlusCircle, Download, Search, Calendar, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseFormModal } from '@/components/expenses/expense-form-modal';
import { useExpenses } from '@/hooks/use-expenses';
import { useCategories } from '@/hooks/use-categories';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { Expense, ExpenseFilters } from '@/types/expense';
import { ExpenseFormData } from '@/lib/validation';
import { formatCurrency } from '@/lib/utils';
import * as storage from '@/services/storage';

export function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { expenses, loading, addExpense, updateExpense, removeExpense, setSort } = useExpenses(filters);
  const { categories } = useCategories();
  const { toasts, showToast, removeToast } = useToast();

  // Create category color map
  const categoryColors = useMemo(() => {
    return categories.reduce(
      (acc, cat) => {
        acc[cat.name] = cat.color;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [categories]);

  // Calculate total filtered expenses
  const totalFiltered = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Pagination
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return expenses.slice(start, end);
  }, [expenses, currentPage]);

  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const handleAddExpense = (data: ExpenseFormData) => {
    try {
      addExpense(data);
      showToast('Expense added successfully', 'success');
    } catch (error) {
      showToast('Failed to add expense', 'error');
    }
  };

  const handleEditExpense = (data: ExpenseFormData) => {
    if (!editingExpense) return;
    try {
      updateExpense(editingExpense.id, data);
      showToast('Expense updated successfully', 'success');
      setEditingExpense(undefined);
    } catch (error) {
      showToast('Failed to update expense', 'error');
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        removeExpense(id);
        showToast('Expense deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete expense', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    try {
      storage.exportToCSV();
      showToast('Expenses exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export expenses', 'error');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Expenses
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Expense
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-[#1c2727] rounded-xl shadow-sm p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Search Description
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  className="pl-10"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value || undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Date Range - simplified to single date for now */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="date"
                  className="pl-10"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value ? new Date(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
                <Select
                  className="pl-10"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Filtered Expenses:{' '}
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                {formatCurrency(totalFiltered)}
              </span>
            </p>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Loading...</p>
            </div>
          ) : (
            <ExpenseTable
              expenses={paginatedExpenses}
              onEdit={(expense) => {
                setEditingExpense(expense);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteExpense}
              onSort={setSort}
              categoryColors={categoryColors}
            />
          )}

          {/* Pagination */}
          {expenses.length > 0 && (
            <nav
              aria-label="Table navigation"
              className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/10"
            >
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, expenses.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {expenses.length}
                </span>
              </span>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-8 px-3 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center h-8 px-3 leading-tight ${
                        currentPage === page
                          ? 'text-black bg-primary/30 border border-primary/50 dark:border-primary/50 dark:text-white'
                          : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-8 px-3 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingExpense(undefined);
        }}
        onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
        categories={categories}
        expense={editingExpense}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

