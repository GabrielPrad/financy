import { GraphQLError } from 'graphql'
import { ZodError } from 'zod'

export function unauthenticated(message = 'Você precisa estar autenticado.') {
  return new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } } })
}

export function badRequest(message: string, fields?: Record<string, string>) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', fields, http: { status: 400 } },
  })
}

export function notFound(message = 'Registro não encontrado.') {
  return new GraphQLError(message, { extensions: { code: 'NOT_FOUND', http: { status: 404 } } })
}

export function conflict(message: string) {
  return new GraphQLError(message, { extensions: { code: 'CONFLICT', http: { status: 409 } } })
}

/**
 * Converte um erro do Zod em um erro GraphQL legivel, mantendo o mapa
 * `campo -> mensagem` para o front-end destacar os inputs inválidos.
 */
export function fromZodError(error: ZodError) {
  const fields: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (path && !fields[path]) fields[path] = issue.message
  }

  const firstIssue = error.issues[0]
  return badRequest(firstIssue?.message ?? 'Dados inválidos.', fields)
}

/** Válida `input` com o schema informado e lanca um erro GraphQL amigavel se falhar. */
export function validate<T>(schema: { parse: (value: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) throw fromZodError(error)
    throw error
  }
}
