import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Expense } from '@/types/expense'
import { formatDate, formatCurrency } from '@/lib/date-utils'
import { Edit, Trash2, ArrowUpDown } from 'lucide-react'
import { getCategories } from '@/services/storage'

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const categories = getCategories()

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6b7280'
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No expenses found. Add your first expense to get started!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-l-lg">
              <div className="flex items-center gap-1 cursor-pointer">
                Date <ArrowUpDown className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                Description <ArrowUpDown className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                Category <ArrowUpDown className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                Amount <ArrowUpDown className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead className="rounded-r-lg text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {formatDate(expense.date)}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">
                {expense.description}
              </TableCell>
              <TableCell>
                <span 
                  className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getCategoryColor(expense.category) }}
                >
                  {expense.category}
                </span>
              </TableCell>
              <TableCell className="font-mono text-slate-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

