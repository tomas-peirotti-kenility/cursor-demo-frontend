import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, FolderOpen } from 'lucide-react'
import { ExpenseFilters } from '@/types/expense'
import { Category } from '@/types/category'

interface ExpenseFiltersProps {
  filters: ExpenseFilters
  categories: Category[]
  onFiltersChange: (filters: ExpenseFilters) => void
}

export function ExpenseFiltersComponent({ filters, categories, onFiltersChange }: ExpenseFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
      {/* Search Bar */}
      <div className="lg:col-span-2">
        <Label htmlFor="search" className="mb-1.5 block">Search Description</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db9b9]" size={20} />
          <Input
            id="search"
            placeholder="Search expenses..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* Date Range Picker */}
      <div>
        <Label htmlFor="date-from" className="mb-1.5 block">Date From</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db9b9]" size={20} />
          <Input
            id="date-from"
            type="date"
            className="pl-10"
            value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              dateFrom: e.target.value ? new Date(e.target.value) : undefined 
            })}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <Label htmlFor="category" className="mb-1.5 block">Category</Label>
        <div className="relative">
          <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db9b9] z-10" size={20} />
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => onFiltersChange({ 
              ...filters, 
              category: value === 'all' ? undefined : value 
            })}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

