import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExpenseFiltersComponent } from '@/components/expenses/expense-filters'
import { ExpenseTable } from '@/components/expenses/expense-table'
import { ExpenseFormModal } from '@/components/expenses/expense-form-modal'
import { useExpenses } from '@/hooks/use-expenses'
import { useCategories } from '@/hooks/use-categories'
import { useExport } from '@/hooks/use-export'
import { Expense, ExpenseFilters } from '@/types/expense'
import { formatCurrency } from '@/lib/date-utils'
import { PlusCircle, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Expenses() {
  const [filters, setFilters] = useState<ExpenseFilters>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { 
    expenses, 
    total, 
    addExpense, 
    editExpense, 
    removeExpense 
  } = useExpenses(filters, { field: 'date', order: 'desc' }, { page: currentPage, limit: pageSize })
  
  const { categories } = useCategories()
  const { exportExpenses } = useExport()
  const { toast } = useToast()

  const totalPages = Math.ceil(total / pageSize)
  const totalFiltered = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleAddExpense = () => {
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await removeExpense(id)
        toast({
          title: 'Expense deleted',
          description: 'The expense has been deleted successfully.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete expense. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSubmitExpense = async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      await editExpense(editingExpense.id, data)
    } else {
      await addExpense(data)
    }
  }

  const handleExport = () => {
    exportExpenses(expenses)
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Expenses
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
          <Button onClick={handleAddExpense}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Expense
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <ExpenseFiltersComponent
          filters={filters}
          categories={categories}
          onFiltersChange={setFilters}
        />

        <div className="mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Filtered Expenses:{' '}
            <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
              {formatCurrency(totalFiltered)}
            </span>
          </p>
        </div>

        <ExpenseTable
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />

        {totalPages > 1 && (
          <nav className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              Showing{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{total}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-8 px-3 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
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
                )
              })}
              <li>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-8 px-3 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-[#283939] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </Card>

      <ExpenseFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        expense={editingExpense}
        categories={categories}
        onSubmit={handleSubmitExpense}
      />
    </div>
  )
}
