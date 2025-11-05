import { useEffect, useState } from 'react';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { MonthlyChart } from '@/components/dashboard/monthly-chart';
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart';
import * as storage from '@/services/storage';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalSpend: 0,
    transactionCount: 0,
    topCategory: 'N/A',
    avgDailySpend: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState<{ month: Date; amount: number }[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    { category: string; amount: number; count: number; percentage: number }[]
  >([]);

  useEffect(() => {
    // Load dashboard data
    const dashboardStats = storage.getDashboardStats();
    setStats(dashboardStats);

    const trend = storage.getMonthlyTrend(6);
    setMonthlyTrend(trend);

    const breakdown = storage.getCategoryBreakdown();
    setCategoryBreakdown(breakdown);
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Dashboard
          </p>
          <div className="flex gap-3">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-white/10 pl-4 pr-2 border border-slate-200 dark:border-white/20">
              <p className="text-slate-800 dark:text-white text-sm font-medium leading-normal">
                This Month
              </p>
              <span className="text-slate-500 dark:text-slate-400 text-xl">▼</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          totalSpend={stats.totalSpend}
          transactionCount={stats.transactionCount}
          topCategory={stats.topCategory}
          avgDailySpend={stats.avgDailySpend}
        />

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <MonthlyChart data={monthlyTrend} />
          <CategoryPieChart data={categoryBreakdown} total={stats.totalSpend} />
        </div>
      </div>
    </div>
  );
}

