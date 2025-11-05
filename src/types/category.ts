export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
}

export interface CategoryWithStats extends Category {
  totalSpent: number;
  transactionCount: number;
}

