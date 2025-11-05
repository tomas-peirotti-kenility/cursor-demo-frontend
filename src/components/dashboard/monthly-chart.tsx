import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { formatMonthShort } from '@/lib/date-utils';
import { TrendingUp } from 'lucide-react';

interface MonthlyChartProps {
  data: { month: Date; amount: number }[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = data.map((item) => ({
    month: formatMonthShort(item.month),
    amount: item.amount,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Calculate percentage change from previous month
  const currentMonth = data[data.length - 1]?.amount || 0;
  const previousMonth = data[data.length - 2]?.amount || 0;
  const percentChange =
    previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Monthly Spending Overview</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <div className="flex items-baseline gap-2 px-6 pb-2">
        <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
          {formatCurrency(total)}
        </p>
        <div className="flex items-center gap-1">
          <TrendingUp
            className={percentChange >= 0 ? 'text-green-500' : 'text-red-500'}
            size={18}
          />
          <p
            className={`text-sm font-medium ${
              percentChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {percentChange >= 0 ? '+' : ''}
            {percentChange.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c2727',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [formatCurrency(value), 'Amount']}
            />
            <Bar dataKey="amount" fill="#13ecec" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

