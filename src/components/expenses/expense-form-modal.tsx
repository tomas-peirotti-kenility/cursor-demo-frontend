import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Expense } from '@/types/expense'
import { Category } from '@/types/category'
import { useToast } from '@/hooks/use-toast'

const expenseSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Amount must have at most 2 decimal places'),
  description: z.string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be at most 200 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string()
    .min(1, 'Date is required')
    .refine((val) => new Date(val) <= new Date(), 'Date cannot be in the future'),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: Expense | null
  categories: Category[]
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export function ExpenseFormModal({ 
  open, 
  onOpenChange, 
  expense, 
  categories, 
  onSubmit 
}: ExpenseFormModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense ? {
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      date: expense.date.toISOString().split('T')[0],
    } : {
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedCategory = watch('category')

  const handleFormSubmit = async (data: ExpenseFormData) => {
    try {
      await onSubmit({
        amount: Number(data.amount),
        description: data.description,
        category: data.category,
        date: new Date(data.date),
      })
      
      toast({
        title: expense ? 'Expense updated' : 'Expense created',
        description: expense 
          ? 'Your expense has been updated successfully.' 
          : 'Your expense has been created successfully.',
      })
      
      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save expense. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {expense ? 'update' : 'add'} an expense record.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Lunch with client"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

