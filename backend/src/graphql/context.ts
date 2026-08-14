import type { PrismaClient } from '@prisma/client'
import type { IncomingMessage } from 'node:http'
import { getUserIdFromToken } from '../lib/auth.js'
import { unauthenticated } from '../lib/errors.js'
import { prisma } from '../lib/prisma.js'

export interface GraphQLContext {
  prisma: PrismaClient
  userId: string | null
}

export async function createContext({ req }: { req: IncomingMessage }): Promise<GraphQLContext> {
  const authorization = req.headers.authorization ?? null

  return {
    prisma,
    userId: getUserIdFromToken(authorization),
  }
}

/**
 * Garante que a requisição está autenticada. Toda query/mutation de dados passa
 * por aqui — é o que assegura que o usuário só enxerga o que é dele.
 */
export function requireUserId(context: GraphQLContext): string {
  if (!context.userId) throw unauthenticated()
  return context.userId
}
