export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt'>;
export type CategoryUpdate = Partial<CategoryInput> & { id: string };

