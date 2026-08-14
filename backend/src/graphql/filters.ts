import type { Prisma } from '@prisma/client'

export interface TransactionsFilterInput {
  type?: 'INCOME' | 'EXPENSE' | null
  categoryId?: string | null
  search?: string | null
  startDate?: Date | null
  endDate?: Date | null
}

/**
 * Monta o `where` do Prisma para transações. O `userId` sempre entra na cláusula,
 * garantindo que nenhum filtro consiga alcancar dados de outro usuário.
 */
export function buildTransactionWhere(
  userId: string,
  filter?: TransactionsFilterInput | null,
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId }

  if (!filter) return where

  if (filter.type) where.type = filter.type
  if (filter.categoryId) where.categoryId = filter.categoryId

  const search = filter.search?.trim()
  if (search) {
    where.OR = [{ description: { contains: search } }, { category: { name: { contains: search } } }]
  }

  if (filter.startDate || filter.endDate) {
    where.date = {
      ...(filter.startDate ? { gte: filter.startDate } : {}),
      ...(filter.endDate ? { lte: filter.endDate } : {}),
    }
  }

  return where
}
