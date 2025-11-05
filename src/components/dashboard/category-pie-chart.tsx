import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown } from 'lucide-react';

interface CategoryPieChartProps {
  data: {
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }[];
  total: number;
}

const COLORS = [
  '#2c5282',
  '#2a4365',
  '#1a365d',
  '#1d4ed8',
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
];

export function CategoryPieChart({ data, total }: CategoryPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <div className="flex items-baseline gap-2 px-6 pb-2">
        <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
          {formatCurrency(total)}
        </p>
        <div className="flex items-center gap-1">
          <TrendingDown className="text-red-500" size={18} />
          <p className="text-red-500 text-sm font-medium">-1.8%</p>
        </div>
      </div>
      <div className="px-6 pb-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c2727',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm px-6 pb-6">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-slate-600 dark:text-slate-300">{item.category}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

