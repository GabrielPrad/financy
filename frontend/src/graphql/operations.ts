import { gql } from '@apollo/client'

/* ------------------------------ Autenticação ------------------------------ */

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    avatarUrl
    createdAt
  }
`

export const ME_QUERY = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`

export const SIGN_UP_MUTATION = gql`
  ${USER_FIELDS}
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`

export const SIGN_IN_MUTATION = gql`
  ${USER_FIELDS}
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`

export const UPDATE_PROFILE_MUTATION = gql`
  ${USER_FIELDS}
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
`

/* -------------------------------- Categorias ------------------------------- */

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    color
    icon
    transactionsCount
    createdAt
    updatedAt
  }
`

export const CATEGORIES_QUERY = gql`
  ${CATEGORY_FIELDS}
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`

export const CREATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
`

export const UPDATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`

/* ------------------------------- Transações ------------------------------- */

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amount
    type
    date
    createdAt
    updatedAt
    category {
      id
      name
      color
      icon
    }
  }
`

export const TRANSACTIONS_QUERY = gql`
  ${TRANSACTION_FIELDS}
  query Transactions($filter: TransactionsFilterInput, $limit: Int, $offset: Int) {
    transactions(filter: $filter, limit: $limit, offset: $offset) {
      ...TransactionFields
    }
  }
`

export const CREATE_TRANSACTION_MUTATION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
`

export const UPDATE_TRANSACTION_MUTATION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
`

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

/* --------------------------------- Resumo --------------------------------- */

export const SUMMARY_QUERY = gql`
  query Summary($filter: TransactionsFilterInput) {
    summary(filter: $filter) {
      income
      expenses
      balance
      transactionsCount
    }
  }
`

export const EXPENSES_BY_CATEGORY_QUERY = gql`
  query ExpensesByCategory($filter: TransactionsFilterInput) {
    expensesByCategory(filter: $filter) {
      total
      percentage
      transactionsCount
      category {
        id
        name
        color
      }
    }
  }
`

/** Queries recarregadas depois de qualquer mutação que altere os números. */
export const DASHBOARD_REFETCH = ['Transactions', 'Summary', 'ExpensesByCategory', 'Categories']
