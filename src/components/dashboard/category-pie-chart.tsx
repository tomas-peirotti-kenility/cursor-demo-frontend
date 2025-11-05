import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  total: number;
  trend?: number;
}

export function CategoryPieChart({ data, total, trend }: CategoryPieChartProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
      <div className="flex flex-col">
        <p className="text-slate-800 dark:text-white text-lg font-medium leading-normal">
          Category Breakdown
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
          This Month
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
          {formatCurrency(total)}
        </p>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={`text-lg ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {trend >= 0 ? '↑' : '↓'}
            </span>
            <p
              className={`text-sm font-medium leading-normal ${
                trend >= 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {Math.abs(trend).toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses this month</p>
        </div>
      )}
    </div>
  );
}

