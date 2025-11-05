import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CategoryCard } from '@/components/categories/category-card'
import { CategoryFormModal } from '@/components/categories/category-form-modal'
import { useCategories } from '@/hooks/use-categories'
import { Category, CategoryStats } from '@/types/category'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const { categoryStats, addCategory, editCategory, removeCategory } = useCategories()
  const { toast } = useToast()

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: CategoryStats) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      createdAt: new Date(),
    })
    setIsModalOpen(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await removeCategory(id)
        toast({
          title: 'Category deleted',
          description: 'The category has been deleted successfully.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete category.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSubmitCategory = async (data: Omit<Category, 'id' | 'createdAt'>) => {
    if (editingCategory) {
      await editCategory(editingCategory.id, data)
    } else {
      await addCategory(data)
    }
  }

  const totalCategories = categoryStats.length
  const mostFrequent = categoryStats.reduce((prev, current) => 
    (current.transactionCount > prev.transactionCount) ? current : prev
  , categoryStats[0] || { name: 'None', transactionCount: 0 })

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight">
            Manage Categories
          </h1>
          <p className="text-gray-500 dark:text-[#9db9b9] text-base font-normal leading-normal">
            View, create, and edit your expense categories.
          </p>
        </div>
        <Button onClick={handleAddCategory}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold mb-4">
            Your Categories
          </h2>
          
          {categoryStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categoryStats.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                No categories yet. Create your first category to get started!
              </p>
              <Button onClick={handleAddCategory}>
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Category
              </Button>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold mb-4">
            Category Overview
          </h2>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-gray-500 dark:text-[#9db9b9] text-sm mb-1">
                  Total Categories
                </p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">
                  {totalCategories}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-gray-500 dark:text-[#9db9b9] text-sm mb-1">
                  Most Frequent
                </p>
                <p className="text-gray-900 dark:text-white text-base font-semibold truncate">
                  {mostFrequent.name}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CategoryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={editingCategory}
        onSubmit={handleSubmitCategory}
      />
    </div>
  )
}
