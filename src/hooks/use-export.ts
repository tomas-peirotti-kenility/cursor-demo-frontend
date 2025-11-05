import { useCallback } from 'react'
import { Expense } from '@/types/expense'
import { exportExpensesToCSV } from '@/lib/csv-export'
import { useToast } from './use-toast'

export function useExport() {
  const { toast } = useToast()

  const exportExpenses = useCallback(
    (expenses: Expense[]) => {
      try {
        exportExpensesToCSV(expenses)
        toast({
          title: 'Export successful',
          description: `Exported ${expenses.length} expenses to CSV`,
        })
      } catch (error) {
        console.error('Error exporting expenses:', error)
        toast({
          title: 'Export failed',
          description: 'Failed to export expenses. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [toast]
  )

  return { exportExpenses }
}

