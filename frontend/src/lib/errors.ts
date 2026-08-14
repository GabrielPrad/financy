import { CombinedGraphQLErrors } from '@apollo/client/errors'

/** Extrai a mensagem mais útil de um erro do Apollo para mostrar ao usuário. */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors[0]?.message ?? fallback
  }

  if (error instanceof Error) {
    // Erro de rede: a API provavelmente está fora do ar.
    if (error.message === 'Failed to fetch') {
      return 'Não foi possível falar com o servidor. Verifique se a API está rodando.'
    }
    return error.message || fallback
  }

  return fallback
}

/** Mapa `campo -> mensagem` enviado pela API nas validações, para destacar inputs. */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!CombinedGraphQLErrors.is(error)) return {}
  const fields = error.errors[0]?.extensions?.fields
  return typeof fields === 'object' && fields !== null ? (fields as Record<string, string>) : {}
}

export function isUnauthenticatedError(error: unknown) {
  if (!CombinedGraphQLErrors.is(error)) return false
  return error.errors.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')
}
