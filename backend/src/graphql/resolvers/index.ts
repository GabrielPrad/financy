import { dateTimeScalar } from '../scalars/dateTime.js'
import { authResolvers } from './auth.js'
import { categoryResolvers } from './category.js'
import { transactionResolvers } from './transaction.js'

export const resolvers = {
  DateTime: dateTimeScalar,

  Category: categoryResolvers.Category,
  Transaction: transactionResolvers.Transaction,

  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
}
