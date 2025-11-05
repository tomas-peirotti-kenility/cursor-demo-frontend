import { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/categories/category-card';
import { CategoryFormModal } from '@/components/categories/category-form-modal';
import { useCategories } from '@/hooks/use-categories';
import { useExpenses } from '@/hooks/use-expenses';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { Category } from '@/types/category';
import { CategoryFormData } from '@/lib/validation';

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const { categories, loading, addCategory, updateCategory, removeCategory } = useCategories();
  const { expenses } = useExpenses();
  const { toasts, showToast, removeToast } = useToast();

  // Calculate statistics for each category
  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryExpenses = expenses.filter((exp) => exp.category === category.name);
      const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        category,
        totalSpent,
        transactionCount: categoryExpenses.length,
      };
    });
  }, [categories, expenses]);

  // Calculate total categories and most frequent
  const totalCategories = categories.length;
  const mostFrequent = useMemo(() => {
    if (categoryStats.length === 0) return 'N/A';
    const sorted = [...categoryStats].sort((a, b) => b.transactionCount - a.transactionCount);
    return sorted[0]?.category.name || 'N/A';
  }, [categoryStats]);

  const handleAddCategory = (data: CategoryFormData) => {
    try {
      addCategory(data);
      showToast('Category created successfully', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Failed to create category', 'error');
      }
    }
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!editingCategory) return;
    try {
      updateCategory(editingCategory.id, data);
      showToast('Category updated successfully', 'success');
      setEditingCategory(undefined);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Failed to update category', 'error');
      }
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        removeCategory(id);
        showToast('Category deleted successfully', 'success');
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, 'error');
        } else {
          showToast('Failed to delete category', 'error');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Manage Categories
            </h1>
            <p className="text-gray-500 dark:text-[#9db9b9] text-base font-normal leading-normal">
              View, create, and edit your expense categories.
            </p>
          </div>
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="w-5 h-5 mr-2" />
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
              {categoryStats.map(({ category, totalSpent, transactionCount }) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  totalSpent={totalSpent}
                  transactionCount={transactionCount}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No categories found</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  Create your first category to get started
                </p>
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Category Overview
            </h2>
            <div className="flex flex-col gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-[#111818] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-[#9db9b9] text-sm font-normal leading-normal mb-1">
                    Total Categories
                  </p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">
                    {totalCategories}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#111818] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-[#9db9b9] text-sm font-normal leading-normal mb-1">
                    Most Frequent
                  </p>
                  <p className="text-gray-900 dark:text-white text-base font-semibold truncate">
                    {mostFrequent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingCategory(undefined);
        }}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        category={editingCategory}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

