export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatarUrl: String
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    icon: String
    "Quantidade de transações vinculadas a esta categoria"
    transactionsCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Transaction {
    id: ID!
    description: String!
    "Valor em reais. Positivo em ambos os tipos — use o campo type para saber o sinal."
    amount: Float!
    type: TransactionType!
    date: DateTime!
    category: Category!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Summary {
    income: Float!
    expenses: Float!
    balance: Float!
    transactionsCount: Int!
  }

  type CategorySummary {
    category: Category!
    total: Float!
    percentage: Float!
    transactionsCount: Int!
  }

  input TransactionsFilterInput {
    type: TransactionType
    categoryId: ID
    search: String
    startDate: DateTime
    endDate: DateTime
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    email: String
    avatarUrl: String
    currentPassword: String
    newPassword: String
  }

  input CreateCategoryInput {
    name: String!
    color: String!
    icon: String
  }

  input UpdateCategoryInput {
    name: String
    color: String
    icon: String
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    type: TransactionType!
    date: DateTime!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: TransactionType
    date: DateTime
    categoryId: ID
  }

  type Query {
    "Usuário autenticado no momento (null quando não ha token válido)"
    me: User

    categories: [Category!]!
    category(id: ID!): Category

    transactions(filter: TransactionsFilterInput, limit: Int, offset: Int): [Transaction!]!
    transaction(id: ID!): Transaction

    "Totais de entradas, saídas e saldo do período informado"
    summary(filter: TransactionsFilterInput): Summary!

    "Saídas agrupadas por categoria, usado no gráfico do dashboard"
    expensesByCategory(filter: TransactionsFilterInput): [CategorySummary!]!
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
