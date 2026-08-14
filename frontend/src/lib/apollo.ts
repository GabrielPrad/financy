import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { authStorage, UNAUTHORIZED_EVENT } from './auth-storage'

const backendUrl = import.meta.env.VITE_BACKEND_URL

if (!backendUrl) {
  throw new Error('VITE_BACKEND_URL não definida. Copie o .env.example para .env.')
}

const httpLink = new HttpLink({ uri: backendUrl })

// Anexa o token JWT em toda requisição.
const authLink = new SetContextLink((prevContext) => {
  const token = authStorage.get()

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

// Token expirado/inválido: limpa a sessão e devolve o usuário para o login.
const errorLink = new ErrorLink(({ error }) => {
  const isUnauthenticated =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')

  if (isUnauthenticated && authStorage.get()) {
    authStorage.clear()
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }
})

export const apolloClient = new ApolloClient({
  link: ErrorLink.concat(errorLink, authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})
