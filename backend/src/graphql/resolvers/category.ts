import type { Category } from '@prisma/client'
import type { GraphQLContext } from '../context.js'
import { requireUserId } from '../context.js'
import { badRequest, conflict, notFound } from '../../lib/errors.js'
import { createCategorySchema, updateCategorySchema } from '../validators.js'
import { validate } from '../../lib/errors.js'

type CategoryWithCount = Category & { _count?: { transactions: number } }

/** Busca a categoria garantindo que ela pertence ao usuário autenticado. */
async function findOwnedCategory(context: GraphQLContext, userId: string, id: string) {
  const category = await context.prisma.category.findFirst({ where: { id, userId } })
  if (!category) throw notFound('Categoria não encontrada.')
  return category
}

export const categoryResolvers = {
  Category: {
    // Evita uma consulta extra quando o `_count` já veio junto do resolver pai.
    transactionsCount: (parent: CategoryWithCount, _args: unknown, context: GraphQLContext) =>
      parent._count?.transactions ??
      context.prisma.transaction.count({ where: { categoryId: parent.id } }),
  },

  Query: {
    categories: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const userId = requireUserId(context)

      return context.prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
        include: { _count: { select: { transactions: true } } },
      })
    },

    category: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = requireUserId(context)

      return context.prisma.category.findFirst({
        where: { id: args.id, userId },
        include: { _count: { select: { transactions: true } } },
      })
    },
  },

  Mutation: {
    createCategory: async (
      _parent: unknown,
      args: { input: { name: string; color: string; icon?: string | null } },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const input = validate(createCategorySchema, args.input)

      const duplicated = await context.prisma.category.findFirst({
        where: { userId, name: input.name },
      })
      if (duplicated) throw conflict('Você já possui uma categoria com esse nome.')

      return context.prisma.category.create({
        data: { name: input.name, color: input.color, icon: input.icon ?? null, userId },
      })
    },

    updateCategory: async (
      _parent: unknown,
      args: { id: string; input: { name?: string; color?: string; icon?: string | null } },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const input = validate(updateCategorySchema, args.input)

      await findOwnedCategory(context, userId, args.id)

      if (input.name) {
        const duplicated = await context.prisma.category.findFirst({
          where: { userId, name: input.name, id: { not: args.id } },
        })
        if (duplicated) throw conflict('Você já possui uma categoria com esse nome.')
      }

      return context.prisma.category.update({
        where: { id: args.id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.color !== undefined ? { color: input.color } : {}),
          ...(input.icon !== undefined ? { icon: input.icon ?? null } : {}),
        },
        include: { _count: { select: { transactions: true } } },
      })
    },

    deleteCategory: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = requireUserId(context)
      await findOwnedCategory(context, userId, args.id)

      const transactionsCount = await context.prisma.transaction.count({
        where: { categoryId: args.id },
      })

      if (transactionsCount > 0) {
        throw badRequest(
          `Não é possível excluir: existem ${transactionsCount} ${transactionsCount === 1 ? 'transação' : 'transações'} nessa categoria.`,
        )
      }

      await context.prisma.category.delete({ where: { id: args.id } })
      return true
    },
  },
}
