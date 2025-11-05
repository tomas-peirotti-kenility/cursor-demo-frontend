import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface MonthlyData {
  month: string;
  total: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
  total: number;
  trend?: number;
}

export function MonthlyChart({ data, total, trend }: MonthlyChartProps) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
      <div className="flex flex-col">
        <p className="text-slate-800 dark:text-white text-lg font-medium leading-normal">
          Monthly Spending Overview
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
          Last 6 Months
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
          {formatCurrency(total)}
        </p>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={`text-lg ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {trend >= 0 ? '↑' : '↓'}
            </span>
            <p
              className={`text-sm font-medium leading-normal ${
                trend >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {Math.abs(trend).toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
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
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Total']}
          />
          <Bar dataKey="total" fill="#13ecec" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

