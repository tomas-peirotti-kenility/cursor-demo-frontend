export interface Category {
  id: string
  name: string
  color: string
  icon: string
  createdAt: Date
}

export interface CategoryStats {
  id: string
  name: string
  color: string
  icon: string
  totalSpent: number
  transactionCount: number
}

