import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

function parseDate(value: unknown): Date {
  if (value instanceof Date) return value

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }

  throw new GraphQLError('DateTime deve ser uma data válida no formato ISO-8601.')
}

export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Data e hora no formato ISO-8601 (ex.: 2026-08-10T14:30:00.000Z)',

  serialize(value) {
    return parseDate(value).toISOString()
  },

  parseValue(value) {
    return parseDate(value)
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) return parseDate(ast.value)
    throw new GraphQLError('DateTime deve ser informado como string ISO-8601.')
  },
})
