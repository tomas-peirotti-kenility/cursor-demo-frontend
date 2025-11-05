import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getExpenseStats } from '@/services/storage'
import { getCategories } from '@/services/storage'
import { formatCurrency } from '@/lib/date-utils'
import { TrendingDown } from 'lucide-react'

export function CategoryPieChart() {
  const stats = getExpenseStats()
  const categories = getCategories()
  
  const data = Object.entries(stats.categoryBreakdown).map(([name, value]) => {
    const category = categories.find(c => c.name === name)
    return {
      name,
      value,
      color: category?.color || '#6b7280',
    }
  }).filter(item => item.value > 0)

  return (
    <Card className="lg:col-span-2 flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-slate-800 dark:text-white text-lg font-medium leading-normal">
          Category Breakdown
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
          This Month
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-slate-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
            {formatCurrency(stats.totalSpend)}
          </p>
          <div className="flex items-center gap-1">
            <TrendingDown className="text-red-500" size={18} />
            <p className="text-red-500 text-sm font-medium leading-normal">-1.8%</p>
          </div>
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
                    backgroundColor: '#1c2727',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48 text-slate-500 dark:text-slate-400">
            No expenses this month
          </div>
        )}
      </CardContent>
    </Card>
  )
}

