import type { Category, Transaction } from '@prisma/client'
import type { GraphQLContext } from '../context.js'
import { requireUserId } from '../context.js'
import { badRequest, notFound, validate } from '../../lib/errors.js'
import { toAmount, toCents } from '../../lib/money.js'
import { buildTransactionWhere, type TransactionsFilterInput } from '../filters.js'
import { createTransactionSchema, updateTransactionSchema } from '../validators.js'

type TransactionWithCategory = Transaction & { category?: Category }

/** Garante que a categoria informada existe e pertence ao usuário autenticado. */
async function assertOwnedCategory(context: GraphQLContext, userId: string, categoryId: string) {
  const category = await context.prisma.category.findFirst({ where: { id: categoryId, userId } })
  if (!category) throw badRequest('Categoria inválida ou inexistente.', { categoryId: 'Categoria inválida.' })
  return category
}

export const transactionResolvers = {
  Transaction: {
    amount: (parent: Transaction) => toAmount(parent.amountCents),

    category: (parent: TransactionWithCategory, _args: unknown, context: GraphQLContext) =>
      parent.category ?? context.prisma.category.findUnique({ where: { id: parent.categoryId } }),
  },

  Query: {
    transactions: async (
      _parent: unknown,
      args: { filter?: TransactionsFilterInput | null; limit?: number | null; offset?: number | null },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)

      return context.prisma.transaction.findMany({
        where: buildTransactionWhere(userId, args.filter),
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        include: { category: true },
        ...(args.limit ? { take: Math.min(args.limit, 200) } : {}),
        ...(args.offset ? { skip: args.offset } : {}),
      })
    },

    transaction: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = requireUserId(context)

      return context.prisma.transaction.findFirst({
        where: { id: args.id, userId },
        include: { category: true },
      })
    },

    summary: async (
      _parent: unknown,
      args: { filter?: TransactionsFilterInput | null },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const where = buildTransactionWhere(userId, args.filter)

      const grouped = await context.prisma.transaction.groupBy({
        by: ['type'],
        where,
        _sum: { amountCents: true },
        _count: { _all: true },
      })

      const income = grouped.find((row) => row.type === 'INCOME')
      const expenses = grouped.find((row) => row.type === 'EXPENSE')

      const incomeCents = income?._sum.amountCents ?? 0
      const expensesCents = expenses?._sum.amountCents ?? 0

      return {
        income: toAmount(incomeCents),
        expenses: toAmount(expensesCents),
        balance: toAmount(incomeCents - expensesCents),
        transactionsCount: (income?._count._all ?? 0) + (expenses?._count._all ?? 0),
      }
    },

    expensesByCategory: async (
      _parent: unknown,
      args: { filter?: TransactionsFilterInput | null },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const where = buildTransactionWhere(userId, { ...args.filter, type: 'EXPENSE' })

      const grouped = await context.prisma.transaction.groupBy({
        by: ['categoryId'],
        where,
        _sum: { amountCents: true },
        _count: { _all: true },
      })

      if (grouped.length === 0) return []

      const categories = await context.prisma.category.findMany({
        where: { id: { in: grouped.map((row) => row.categoryId) }, userId },
      })
      const categoriesById = new Map(categories.map((category) => [category.id, category]))

      const totalCents = grouped.reduce((total, row) => total + (row._sum.amountCents ?? 0), 0)

      return grouped
        .map((row) => {
          const category = categoriesById.get(row.categoryId)
          if (!category) return null

          const cents = row._sum.amountCents ?? 0

          return {
            category,
            total: toAmount(cents),
            percentage: totalCents > 0 ? Number(((cents / totalCents) * 100).toFixed(2)) : 0,
            transactionsCount: row._count._all,
          }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null)
        .sort((a, b) => b.total - a.total)
    },
  },

  Mutation: {
    createTransaction: async (
      _parent: unknown,
      args: {
        input: {
          description: string
          amount: number
          type: 'INCOME' | 'EXPENSE'
          date: Date
          categoryId: string
        }
      },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const input = validate(createTransactionSchema, args.input)

      await assertOwnedCategory(context, userId, input.categoryId)

      return context.prisma.transaction.create({
        data: {
          description: input.description,
          amountCents: toCents(input.amount),
          type: input.type,
          date: input.date,
          categoryId: input.categoryId,
          userId,
        },
        include: { category: true },
      })
    },

    updateTransaction: async (
      _parent: unknown,
      args: {
        id: string
        input: {
          description?: string
          amount?: number
          type?: 'INCOME' | 'EXPENSE'
          date?: Date
          categoryId?: string
        }
      },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const input = validate(updateTransactionSchema, args.input)

      const existing = await context.prisma.transaction.findFirst({ where: { id: args.id, userId } })
      if (!existing) throw notFound('Transação não encontrada.')

      if (input.categoryId) await assertOwnedCategory(context, userId, input.categoryId)

      return context.prisma.transaction.update({
        where: { id: args.id },
        data: {
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.amount !== undefined ? { amountCents: toCents(input.amount) } : {}),
          ...(input.type !== undefined ? { type: input.type } : {}),
          ...(input.date !== undefined ? { date: input.date } : {}),
          ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        },
        include: { category: true },
      })
    },

    deleteTransaction: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = requireUserId(context)

      const existing = await context.prisma.transaction.findFirst({ where: { id: args.id, userId } })
      if (!existing) throw notFound('Transação não encontrada.')

      await context.prisma.transaction.delete({ where: { id: args.id } })
      return true
    },
  },
}
