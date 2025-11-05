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
import { Category } from '@/types/category'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/default-categories'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const categorySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<void>
}

export function CategoryFormModal({ 
  open, 
  onOpenChange, 
  category, 
  onSubmit 
}: CategoryFormModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      color: category.color,
      icon: category.icon,
    } : {
      name: '',
      color: CATEGORY_COLORS[0],
      icon: CATEGORY_ICONS[0].value,
    },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data)
      
      toast({
        title: category ? 'Category updated' : 'Category created',
        description: category 
          ? 'Your category has been updated successfully.' 
          : 'Your category has been created successfully.',
      })
      
      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            Organize your expenses with custom categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
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
          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="flex flex-wrap gap-3">
              {CATEGORY_COLORS.map((color) => (
                <label
                  key={color}
                  className={cn(
                    "size-10 rounded-full border cursor-pointer transition-all",
                    selectedColor === color
                      ? "border-2 border-white dark:border-[#111818] ring-2 ring-primary/50"
                      : "border border-gray-300 dark:border-[#3b5454]"
                  )}
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="radio"
                    className="invisible"
                    value={color}
                    checked={selectedColor === color}
                    onChange={(e) => setValue('color', e.target.value)}
                  />
                </label>
              ))}
            </div>
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color.message}</p>
            )}
          </div>

          {/* Category Icon */}
          <div className="space-y-2">
            <Label>Select an Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_ICONS.map((icon) => (
                <label
                  key={icon.value}
                  className={cn(
                    "flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg px-3 transition-all",
                    selectedIcon === icon.value
                      ? "ring-2 ring-primary/50 bg-primary/20"
                      : "bg-gray-100 dark:bg-[#283939] hover:bg-gray-200 dark:hover:bg-primary/20"
                  )}
                >
                  <input
                    type="radio"
                    className="hidden"
                    value={icon.value}
                    checked={selectedIcon === icon.value}
                    onChange={(e) => setValue('icon', e.target.value)}
                  />
                  <span className="material-symbols-outlined text-black dark:text-white text-lg">
                    {icon.value}
                  </span>
                  <p className="text-black dark:text-white text-sm font-medium leading-normal">
                    {icon.label}
                  </p>
                </label>
              ))}
            </div>
            {errors.icon && (
              <p className="text-xs text-red-500">{errors.icon.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200 dark:border-[#3b5454]">
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
              {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Save Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

