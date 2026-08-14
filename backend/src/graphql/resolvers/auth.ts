import { Prisma } from '@prisma/client'
import type { GraphQLContext } from '../context.js'
import { requireUserId } from '../context.js'
import { comparePassword, hashPassword, signToken } from '../../lib/auth.js'
import { badRequest, conflict, notFound, unauthenticated, validate } from '../../lib/errors.js'
import { signInSchema, signUpSchema, updateProfileSchema } from '../validators.js'

/** Categorias iniciais criadas junto com a conta, para o usuário não começar do zero. */
const DEFAULT_CATEGORIES = [
  { name: 'Salário', color: '#22C55E', icon: 'wallet' },
  { name: 'Alimentação', color: '#F97316', icon: 'utensils' },
  { name: 'Moradia', color: '#3B82F6', icon: 'house' },
  { name: 'Transporte', color: '#06B6D4', icon: 'car' },
  { name: 'Lazer', color: '#8B5CF6', icon: 'party-popper' },
  { name: 'Saúde', color: '#EF4444', icon: 'heart-pulse' },
]

export const authResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.userId) return null
      return context.prisma.user.findUnique({ where: { id: context.userId } })
    },
  },

  Mutation: {
    signUp: async (
      _parent: unknown,
      args: { input: { name: string; email: string; password: string } },
      context: GraphQLContext,
    ) => {
      const input = validate(signUpSchema, args.input)

      const existing = await context.prisma.user.findUnique({ where: { email: input.email } })
      if (existing) throw conflict('Já existe uma conta cadastrada com esse e-mail.')

      const user = await context.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: await hashPassword(input.password),
          categories: { create: DEFAULT_CATEGORIES },
        },
      })

      return { token: signToken(user.id), user }
    },

    signIn: async (
      _parent: unknown,
      args: { input: { email: string; password: string } },
      context: GraphQLContext,
    ) => {
      const input = validate(signInSchema, args.input)

      const user = await context.prisma.user.findUnique({ where: { email: input.email } })
      // Mensagem genérica de propósito: não revela se o e-mail existe.
      if (!user) throw unauthenticated('E-mail ou senha inválidos.')

      const passwordMatches = await comparePassword(input.password, user.password)
      if (!passwordMatches) throw unauthenticated('E-mail ou senha inválidos.')

      return { token: signToken(user.id), user }
    },

    updateProfile: async (
      _parent: unknown,
      args: {
        input: {
          name?: string
          email?: string
          avatarUrl?: string | null
          currentPassword?: string
          newPassword?: string
        }
      },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context)
      const input = validate(updateProfileSchema, args.input)

      const user = await context.prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw notFound('Usuário não encontrado.')

      const data: Prisma.UserUpdateInput = {}

      if (input.name) data.name = input.name
      if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl || null

      if (input.email && input.email !== user.email) {
        const emailTaken = await context.prisma.user.findUnique({ where: { email: input.email } })
        if (emailTaken) throw conflict('Esse e-mail já está em uso.')
        data.email = input.email
      }

      if (input.newPassword) {
        const matches = await comparePassword(input.currentPassword ?? '', user.password)
        if (!matches) throw badRequest('A senha atual está incorreta.', { currentPassword: 'Senha incorreta.' })
        data.password = await hashPassword(input.newPassword)
      }

      if (Object.keys(data).length === 0) return user

      return context.prisma.user.update({ where: { id: userId }, data })
    },
  },
}
