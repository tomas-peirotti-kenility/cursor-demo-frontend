import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { expenseSchema, ExpenseFormData } from '@/lib/validation';
import { Expense } from '@/types/expense';
import { Category } from '@/types/category';
import { formatDateInput } from '@/lib/utils';

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExpenseFormData) => void;
  categories: Category[];
  expense?: Expense;
}

export function ExpenseFormModal({
  open,
  onOpenChange,
  onSubmit,
  categories,
  expense,
}: ExpenseFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          date: expense.date,
        }
      : {
          date: new Date(),
        },
  });

  useEffect(() => {
    if (open && expense) {
      reset({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
      });
    } else if (open && !expense) {
      reset({
        amount: undefined,
        description: '',
        category: '',
        date: new Date(),
      });
    }
  }, [open, expense, reset]);

  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Amount *
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description *
            </label>
            <Input
              type="text"
              placeholder="Enter expense description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <Select {...register('category')}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Date *
            </label>
            <Input
              type="date"
              max={formatDateInput(new Date())}
              {...register('date', { valueAsDate: true })}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{expense ? 'Update' : 'Add'} Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

