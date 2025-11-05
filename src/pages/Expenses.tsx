import { useState } from 'react';
import { ExpenseTable } from '@/components/expenses/expense-table';
import { ExpenseFiltersComponent } from '@/components/expenses/expense-filters';
import { ExpenseFormModal } from '@/components/expenses/expense-form-modal';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/hooks/use-expenses';
import { useExport } from '@/hooks/use-export';
import { ExpenseFilters, Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { Plus, Download } from 'lucide-react';

export function Expenses() {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const limit = 10;
  const { expenses, total, createExpense, updateExpense, deleteExpense } = useExpenses(
    filters,
    { field: 'date', direction: 'desc' },
    page,
    limit
  );
  const { exportToCSV } = useExport();

  const totalPages = Math.ceil(total / limit);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleSubmit = (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      createExpense(data);
    }
  };

  const handleExport = () => {
    exportToCSV(filters);
  };

  const filteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Expenses
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export to CSV
            </Button>
            <Button onClick={handleAddExpense}>
              <Plus size={16} className="mr-2" />
              Add New Expense
            </Button>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white dark:bg-[#1c2727] rounded-xl shadow-sm p-6">
          {/* Filters */}
          <ExpenseFiltersComponent filters={filters} onFiltersChange={setFilters} />

          {/* Total Expenses */}
          <div className="mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Filtered Expenses:{' '}
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                {formatCurrency(filteredTotal)}
              </span>
            </p>
          </div>

          {/* Expenses Table */}
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Table navigation"
              className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/10"
            >
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {total}
                </span>
              </span>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center justify-center h-8 px-3 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <li key={pageNum}>
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`flex items-center justify-center h-8 px-3 leading-tight ${
                        pageNum === page
                          ? 'text-black bg-primary/30 border border-primary/50 dark:border-primary/50 dark:text-white'
                          : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        expense={editingExpense}
      />
    </div>
  );
}

