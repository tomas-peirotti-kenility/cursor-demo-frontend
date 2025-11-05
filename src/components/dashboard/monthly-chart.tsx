import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getMonthlySpending } from '@/services/storage'
import { formatCurrency } from '@/lib/date-utils'
import { TrendingUp } from 'lucide-react'

export function MonthlyChart() {
  const data = getMonthlySpending(6)
  
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  const previousTotal = data.slice(0, 5).reduce((sum, item) => sum + item.amount, 0)
  const percentChange = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0

  return (
    <Card className="lg:col-span-3 flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-slate-800 dark:text-white text-lg font-medium leading-normal">
          Monthly Spending Overview
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
          Last 6 Months
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
            {formatCurrency(total)}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className={percentChange >= 0 ? "text-green-500" : "text-red-500"} size={18} />
            <p className={`text-sm font-medium leading-normal ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c2727',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Amount']}
            />
            <Bar 
              dataKey="amount" 
              fill="#13ecec" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

