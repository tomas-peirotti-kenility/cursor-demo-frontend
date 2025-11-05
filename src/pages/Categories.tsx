import { useState } from 'react';
import { CategoryCard } from '@/components/categories/category-card';
import { CategoryFormModal } from '@/components/categories/category-form-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCategoriesWithStats } from '@/hooks/use-categories';
import { Category, CategoryWithStats } from '@/types/category';
import { Plus } from 'lucide-react';
import * as storage from '@/services/storage';

export function Categories() {
  const { categories, refresh } = useCategoriesWithStats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryWithStats) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        storage.deleteCategory(id);
        refresh();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleSubmit = (data: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      if (editingCategory) {
        const result = storage.updateCategory(editingCategory.id, data);
        if (!result) {
          return { success: false, error: 'Failed to update category' };
        }
      } else {
        storage.createCategory(data);
      }
      refresh();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const totalCategories = categories.length;
  const mostFrequent = categories.reduce(
    (max, cat) => (cat.transactionCount > max.transactionCount ? cat : max),
    categories[0] || { name: 'N/A', transactionCount: 0 }
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Manage Categories
            </p>
            <p className="text-gray-500 dark:text-[#9db9b9] text-base font-normal leading-normal">
              View, create, and edit your expense categories.
            </p>
          </div>
          <Button size="lg" onClick={handleAddCategory}>
            <Plus size={18} className="mr-2" />
            Create New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Your Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Category Overview
            </h2>
            <div className="flex flex-col gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-gray-500 dark:text-[#9db9b9] text-sm font-normal leading-normal mb-1">
                    Total Categories
                  </p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">
                    {totalCategories}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-gray-500 dark:text-[#9db9b9] text-sm font-normal leading-normal mb-1">
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
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        category={editingCategory}
      />
    </div>
  );
}

