import { Button } from '@/components/ui/button'
import { CategoryStats } from '@/types/category'
import { formatCurrency } from '@/lib/date-utils'
import { Edit, Trash2 } from 'lucide-react'

interface CategoryCardProps {
  category: CategoryStats
  onEdit: (category: CategoryStats) => void
  onDelete: (id: string) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="group relative flex flex-col justify-between gap-4 p-4 bg-white dark:bg-[#111818] rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0" 
          style={{ backgroundColor: category.color }}
        />
        <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">
          {category.name}
        </p>
      </div>
      
      <div>
        <p className="text-gray-600 dark:text-[#9db9b9] text-sm font-normal leading-normal">
          Total Spent:
        </p>
        <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
          {formatCurrency(category.totalSpent)}
        </p>
        <p className="text-gray-500 dark:text-[#9db9b9] text-xs font-normal leading-normal mt-1">
          {category.transactionCount} Transaction{category.transactionCount !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#283939] text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-[#3a4f4f]"
          onClick={() => onEdit(category)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#283939] text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-[#3a4f4f]"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

