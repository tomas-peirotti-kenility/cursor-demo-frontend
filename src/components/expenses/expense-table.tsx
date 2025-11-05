import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      Transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Utilities: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Healthcare: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No expenses found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-l-lg">
              <div className="flex items-center gap-1 cursor-pointer">
                Date <ArrowUpDown size={14} />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center gap-1 cursor-pointer">
                Description <ArrowUpDown size={14} />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center gap-1 cursor-pointer">
                Category <ArrowUpDown size={14} />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center gap-1 cursor-pointer">
                Amount <ArrowUpDown size={14} />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="bg-white dark:bg-[#1c2727] border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
            >
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                {expense.description}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getCategoryColor(
                    expense.category
                  )}`}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary p-1"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

