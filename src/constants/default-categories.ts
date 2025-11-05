import { Category } from '@/types/category'

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  {
    name: 'Food',
    color: '#10b981',
    icon: 'restaurant',
  },
  {
    name: 'Transportation',
    color: '#3b82f6',
    icon: 'directions_car',
  },
  {
    name: 'Entertainment',
    color: '#8b5cf6',
    icon: 'movie',
  },
  {
    name: 'Utilities',
    color: '#f59e0b',
    icon: 'bolt',
  },
  {
    name: 'Healthcare',
    color: '#ef4444',
    icon: 'favorite',
  },
  {
    name: 'Other',
    color: '#6b7280',
    icon: 'more_horiz',
  },
]

export const CATEGORY_COLORS = [
  '#e53e3e', // red
  '#dd6b20', // orange
  '#d69e2e', // yellow
  '#38a169', // green
  '#3182ce', // blue
  '#00b5d8', // cyan
  '#805ad5', // purple
  '#d53f8c', // pink
]

export const CATEGORY_ICONS = [
  { value: 'shopping_cart', label: 'Groceries' },
  { value: 'shopping_bag', label: 'Shopping' },
  { value: 'restaurant', label: 'Dining' },
  { value: 'directions_car', label: 'Transport' },
  { value: 'flight', label: 'Travel' },
  { value: 'receipt_long', label: 'Bills' },
  { value: 'movie', label: 'Entertainment' },
  { value: 'favorite', label: 'Healthcare' },
  { value: 'bolt', label: 'Utilities' },
  { value: 'more_horiz', label: 'Other' },
]

