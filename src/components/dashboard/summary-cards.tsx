import { Card } from '@/components/ui/card';
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
  const cards = [
    {
      label: 'Total Spend this Month',
      value: formatCurrency(totalSpend),
    },
    {
      label: 'Transactions',
      value: transactionCount.toString(),
    },
    {
      label: 'Top Category',
      value: topCategory,
    },
    {
      label: 'Avg. Daily Spend',
      value: formatCurrency(avgDailySpend),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="flex flex-col gap-2">
          <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-normal">
            {card.label}
          </p>
          <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
            {card.value}
          </p>
        </Card>
      ))}
    </div>
  );
}

