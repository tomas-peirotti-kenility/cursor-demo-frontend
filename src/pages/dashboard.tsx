import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { MonthlyChart } from '@/components/dashboard/monthly-chart';
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useExpenses } from '@/hooks/use-expenses';
import { useCategories } from '@/hooks/use-categories';
import * as storage from '@/services/storage';

export function Dashboard() {
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    return storage.getMonthlySummary(currentMonth, currentYear);
  }, [expenses, currentMonth, currentYear]);

  // Calculate monthly data for chart (last 6 months)
  const monthlyData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const summary = storage.getMonthlySummary(month, year);
      data.push({
        month: format(date, 'MMM'),
        total: summary.total,
      });
    }
    return data;
  }, [expenses, currentDate]);

  // Calculate category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categoryMap = categories.reduce(
      (acc, cat) => {
        acc[cat.name] = cat.color;
        return acc;
      },
      {} as Record<string, string>
    );

    return Object.entries(monthlySummary.byCategory).map(([name, data]) => ({
      name,
      value: data.total,
      color: categoryMap[name] || '#6b7280',
    }));
  }, [monthlySummary.byCategory, categories]);

  // Calculate top category
  const topCategory = useMemo(() => {
    const entries = Object.entries(monthlySummary.byCategory);
    if (entries.length === 0) return '';
    const sorted = entries.sort((a, b) => b[1].total - a[1].total);
    return sorted[0][0];
  }, [monthlySummary.byCategory]);

  // Calculate average daily spend
  const avgDailySpend = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return monthlySummary.total / daysInMonth;
  }, [monthlySummary.total, currentMonth, currentYear]);

  // Calculate total for last 6 months
  const totalLastSixMonths = useMemo(() => {
    return monthlyData.reduce((sum, data) => sum + data.total, 0);
  }, [monthlyData]);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Dashboard
          </h1>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          totalSpend={monthlySummary.total}
          transactionCount={monthlySummary.count}
          topCategory={topCategory}
          avgDailySpend={avgDailySpend}
        />

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <MonthlyChart data={monthlyData} total={totalLastSixMonths} />
          <CategoryPieChart data={categoryData} total={monthlySummary.total} />
        </div>
      </div>
    </div>
  );
}

