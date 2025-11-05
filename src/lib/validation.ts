import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      'Amount must have at most 2 decimal places'
    ),
  description: z
    .string({ required_error: 'Description is required' })
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be at most 200 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.date({ required_error: 'Date is required' }).max(new Date(), 'Date cannot be in the future'),
});

export const categorySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  icon: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;

