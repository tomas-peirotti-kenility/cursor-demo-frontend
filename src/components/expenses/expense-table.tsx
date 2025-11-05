import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Expense, SortField } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onSort: (field: SortField) => void;
  categoryColors: Record<string, string>;
}

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  onSort,
  categoryColors,
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-lg">No expenses found</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
          Add your first expense to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="px-6 py-3 rounded-l-lg" scope="col">
              <button
                onClick={() => onSort('date')}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Date <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-6 py-3" scope="col">
              <button
                onClick={() => onSort('description')}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Description <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-6 py-3" scope="col">
              <button
                onClick={() => onSort('category')}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Category <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-6 py-3" scope="col">
              <button
                onClick={() => onSort('amount')}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                Amount <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="px-6 py-3 rounded-r-lg text-center" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="bg-white dark:bg-[#1c2727] border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                {expense.description}
              </td>
              <td className="px-6 py-4">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${categoryColors[expense.category]}20`,
                    color: categoryColors[expense.category],
                  }}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(expense)}
                    className="h-8 w-8 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(expense.id)}
                    className="h-8 w-8 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

