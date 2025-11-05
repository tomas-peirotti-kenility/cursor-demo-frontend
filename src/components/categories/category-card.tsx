import { Edit, Trash2 } from 'lucide-react';
import { Category } from '@/types/category';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: Category;
  totalSpent: number;
  transactionCount: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({
  category,
  totalSpent,
  transactionCount,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="group relative flex flex-col justify-between gap-4 p-4 bg-white dark:bg-[#111818] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal">
          {category.name}
        </p>
      </div>

      <div>
        <p className="text-slate-600 dark:text-[#9db9b9] text-sm font-normal leading-normal">
          Total Spent:
        </p>
        <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
          {formatCurrency(totalSpent)}
        </p>
        <p className="text-slate-500 dark:text-[#9db9b9] text-xs font-normal leading-normal mt-1">
          {transactionCount} Transaction{transactionCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(category)}
          className="h-8 w-8 rounded-full bg-slate-100 dark:bg-[#283939] text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-[#3a4f4f]"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(category.id)}
          className="h-8 w-8 rounded-full bg-slate-100 dark:bg-[#283939] text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-[#3a4f4f]"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

