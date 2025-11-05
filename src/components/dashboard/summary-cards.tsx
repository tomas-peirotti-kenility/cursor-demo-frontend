import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  totalSpend: number;
  transactionCount: number;
  topCategory: string;
  avgDailySpend: number;
}

export function SummaryCards({
  totalSpend,
  transactionCount,
  topCategory,
  avgDailySpend,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-white/5 p-6 border border-slate-200 dark:border-white/10 transition-all hover:shadow-lg dark:hover:border-white/20">
        <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
          Total Spend this Month
        </p>
        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
          {formatCurrency(totalSpend)}
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-white/5 p-6 border border-slate-200 dark:border-white/10 transition-all hover:shadow-lg dark:hover:border-white/20">
        <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
          Transactions
        </p>
        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
          {transactionCount}
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-white/5 p-6 border border-slate-200 dark:border-white/10 transition-all hover:shadow-lg dark:hover:border-white/20">
        <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
          Top Category
        </p>
        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight truncate">
          {topCategory || 'N/A'}
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-white/5 p-6 border border-slate-200 dark:border-white/10 transition-all hover:shadow-lg dark:hover:border-white/20">
        <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
          Avg. Daily Spend
        </p>
        <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
          {formatCurrency(avgDailySpend)}
        </p>
      </div>
    </div>
  );
}

