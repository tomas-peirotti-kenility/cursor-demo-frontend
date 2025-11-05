import { Input } from '@/components/ui/input';
import { Search, Calendar, Tag } from 'lucide-react';
import { ExpenseFilters } from '@/types/expense';
import { useCategories } from '@/hooks/use-categories';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

export function ExpenseFiltersComponent({ filters, onFiltersChange }: ExpenseFiltersProps) {
  const { categories } = useCategories();

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category || undefined });
  };

  const handleDateFromChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateFrom: date ? new Date(date) : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
      {/* Search Bar */}
      <div className="lg:col-span-2">
        <label className="flex flex-col w-full">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Search Description
          </span>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-slate-400 dark:text-[#9db9b9]" size={20} />
            </div>
            <Input
              placeholder="Search expenses..."
              className="pl-10"
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Date Range Picker */}
      <div>
        <label className="flex flex-col w-full">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Date From
          </span>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="text-slate-400 dark:text-[#9db9b9]" size={20} />
            </div>
            <Input
              type="date"
              className="pl-10"
              value={filters.dateFrom?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Category Filter */}
      <div>
        <label className="flex flex-col w-full">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Category
          </span>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <Tag className="text-slate-400 dark:text-[#9db9b9]" size={20} />
            </div>
            <select
              className="flex w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#283939] pl-10 pr-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </div>
  );
}

