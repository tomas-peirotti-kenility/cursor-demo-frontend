import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categorySchema, CategoryFormData } from '@/lib/validation';
import { Category } from '@/types/category';
import {
  Utensils,
  Car,
  Film,
  Zap,
  Heart,
  MoreHorizontal,
  ShoppingBag,
  Home,
  Plane,
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'utensils', label: 'Food', icon: Utensils },
  { value: 'car', label: 'Car', icon: Car },
  { value: 'film', label: 'Film', icon: Film },
  { value: 'zap', label: 'Utilities', icon: Zap },
  { value: 'heart', label: 'Health', icon: Heart },
  { value: 'shopping-bag', label: 'Shopping', icon: ShoppingBag },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'plane', label: 'Travel', icon: Plane },
  { value: 'more-horizontal', label: 'Other', icon: MoreHorizontal },
];

const COLOR_OPTIONS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6b7280',
];

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  category?: Category;
}

export function CategoryFormModal({
  open,
  onOpenChange,
  onSubmit,
  category,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          color: category.color,
          icon: category.icon,
        }
      : {
          color: COLOR_OPTIONS[0],
          icon: 'more-horizontal',
        },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        color: category.color,
        icon: category.icon,
      });
    } else if (open && !category) {
      reset({
        name: '',
        color: COLOR_OPTIONS[0],
        icon: 'more-horizontal',
      });
    }
  }, [open, category, reset]);

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category Name *
            </label>
            <Input type="text" placeholder="Enter category name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Color *
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1c2727]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input type="hidden" {...register('color')} />
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((iconOption) => {
                const IconComponent = iconOption.icon;
                return (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() => setValue('icon', iconOption.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedIcon === iconOption.value
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
                    }`}
                    title={iconOption.label}
                  >
                    <IconComponent className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('icon')} />
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
            <Button type="submit">{category ? 'Update' : 'Create'} Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

