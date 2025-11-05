import { SummaryCards } from '@/components/dashboard/summary-cards'
import { MonthlyChart } from '@/components/dashboard/monthly-chart'
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart'
import { useExpenses } from '@/hooks/use-expenses'

export function Dashboard() {
  const { stats } = useExpenses()

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Dashboard
        </h1>
      </div>

      <SummaryCards stats={stats} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <MonthlyChart />
        <CategoryPieChart />
      </div>
    </div>
  )
}
