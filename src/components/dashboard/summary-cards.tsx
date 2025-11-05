import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/date-utils'
import { ExpenseStats } from '@/types/expense'

interface SummaryCardsProps {
  stats: ExpenseStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Spend this Month',
      value: formatCurrency(stats.totalSpend),
    },
    {
      label: 'Transactions',
      value: stats.transactionCount.toString(),
    },
    {
      label: 'Top Category',
      value: stats.topCategory,
    },
    {
      label: 'Avg. Daily Spend',
      value: formatCurrency(stats.avgDailySpend),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="flex flex-col gap-2 p-6 transition-all hover:shadow-lg dark:hover:border-white/20"
        >
          <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
            {card.label}
          </p>
          <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
            {card.value}
          </p>
        </Card>
      ))}
    </div>
  )
}

