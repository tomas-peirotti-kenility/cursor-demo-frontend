import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/default-categories';
import { useState } from 'react';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => { success: boolean; error: string | null };
  category?: Category;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
}: CategoryFormModalProps) {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          color: category.color,
          icon: category.icon,
        }
      : {
          color: CATEGORY_COLORS[0],
          icon: CATEGORY_ICONS[0].value,
        },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const handleFormSubmit = (data: CategoryFormData) => {
    const result = onSubmit(data);
    if (result.success) {
      reset();
      setError(null);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={category ? 'Edit Category' : 'Create New Category'}
      description="Organize your expenses with custom categories."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)}>
            {category ? 'Update Category' : 'Save Category'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Category Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-base font-medium text-slate-900 dark:text-white"
          >
            Category Name
          </label>
          <Input
            id="name"
            placeholder="e.g., Groceries"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Category Color */}
        <div>
          <h2 className="text-base font-medium text-slate-900 dark:text-white mb-2">
            Category Color
          </h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORY_COLORS.map((color) => (
              <label
                key={color}
                className={`size-10 rounded-full border cursor-pointer transition-all ${
                  selectedColor === color
                    ? 'border-2 border-white dark:border-[#111818] ring-2 ring-primary/50'
                    : 'border border-gray-300 dark:border-[#3b5454]'
                }`}
                style={{ backgroundColor: color }}
              >
                <input
                  type="radio"
                  value={color}
                  className="invisible"
                  {...register('color')}
                />
              </label>
            ))}
          </div>
          {errors.color && (
            <p className="text-xs text-red-500 mt-2">{errors.color.message}</p>
          )}
        </div>

        {/* Category Icon */}
        <div>
          <h2 className="text-base font-medium text-slate-900 dark:text-white mb-2">
            Select an Icon
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_ICONS.map((icon) => (
              <label
                key={icon.value}
                className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg px-3 transition-all ${
                  selectedIcon === icon.value
                    ? 'ring-2 ring-primary/50 bg-primary/20'
                    : 'bg-gray-100 dark:bg-[#283939] hover:bg-gray-200 dark:hover:bg-primary/20'
                }`}
              >
                <input
                  type="radio"
                  value={icon.value}
                  className="hidden"
                  {...register('icon')}
                />
                <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">
                  {icon.label}
                </p>
              </label>
            ))}
          </div>
          {errors.icon && (
            <p className="text-xs text-red-500 mt-2">{errors.icon.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

