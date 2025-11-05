import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import { useCategories } from '@/hooks/use-categories';
import { Calendar } from 'lucide-react';

const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive').min(0.01, 'Amount is required'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be less than 200 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  expense?: Expense;
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  expense,
}: ExpenseFormModalProps) {
  const { categories } = useCategories();
  
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
          date: expense.date.toISOString().split('T')[0],
        }
      : undefined,
  });

  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit({
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={expense ? 'Edit Expense' : 'Add New Expense'}
      description="Fill in the details below to add a new expense record."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)}>
            {expense ? 'Update Expense' : 'Save Expense'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6">
        {/* Amount Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="amount"
            className="text-sm font-medium text-slate-900 dark:text-white"
          >
            Amount
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm">$</span>
            </div>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-900 dark:text-white"
          >
            Description
          </label>
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
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-slate-900 dark:text-white"
          >
            Category
          </label>
          <select
            id="category"
            className="flex w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#283939] px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            {...register('category')}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Date Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="date"
            className="text-sm font-medium text-slate-900 dark:text-white"
          >
            Date
          </label>
          <div className="relative flex w-full items-stretch">
            <Input
              id="date"
              type="date"
              className="rounded-r-none border-r-0"
              max={new Date().toISOString().split('T')[0]}
              {...register('date')}
            />
            <div className="flex items-center justify-center rounded-r-lg border border-l-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#283939] px-3 text-slate-500 dark:text-slate-400">
              <Calendar size={20} />
            </div>
          </div>
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

