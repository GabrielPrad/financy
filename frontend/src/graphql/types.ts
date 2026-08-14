export type TransactionType = 'INCOME' | 'EXPENSE'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  transactionsCount: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  category: Pick<Category, 'id' | 'name' | 'color' | 'icon'>
  createdAt: string
  updatedAt: string
}

export interface Summary {
  income: number
  expenses: number
  balance: number
  transactionsCount: number
}

export interface CategorySummary {
  category: Pick<Category, 'id' | 'name' | 'color'>
  total: number
  percentage: number
  transactionsCount: number
}

export interface TransactionsFilterInput {
  type?: TransactionType | null
  categoryId?: string | null
  search?: string | null
  startDate?: string | null
  endDate?: string | null
}

export interface AuthPayload {
  token: string
  user: User
}
