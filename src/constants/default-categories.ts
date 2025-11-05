import { Category } from '@/types/category';

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  {
    name: 'Food',
    color: '#10b981',
    icon: 'utensils',
  },
  {
    name: 'Transportation',
    color: '#3b82f6',
    icon: 'car',
  },
  {
    name: 'Entertainment',
    color: '#8b5cf6',
    icon: 'film',
  },
  {
    name: 'Utilities',
    color: '#f59e0b',
    icon: 'bolt',
  },
  {
    name: 'Healthcare',
    color: '#ef4444',
    icon: 'heart',
  },
  {
    name: 'Other',
    color: '#6b7280',
    icon: 'ellipsis',
  },
];

export const CATEGORY_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16', // lime
];

export const CATEGORY_ICONS = [
  { value: 'utensils', label: 'Food' },
  { value: 'car', label: 'Transport' },
  { value: 'film', label: 'Entertainment' },
  { value: 'bolt', label: 'Utilities' },
  { value: 'heart', label: 'Healthcare' },
  { value: 'shopping-cart', label: 'Groceries' },
  { value: 'shopping-bag', label: 'Shopping' },
  { value: 'plane', label: 'Travel' },
  { value: 'home', label: 'Home' },
  { value: 'dumbbell', label: 'Fitness' },
  { value: 'book', label: 'Education' },
  { value: 'ellipsis', label: 'Other' },
];

