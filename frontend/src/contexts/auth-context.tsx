import { useApolloClient } from '@apollo/client/react'
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ME_QUERY, SIGN_IN_MUTATION, SIGN_UP_MUTATION } from '@/graphql/operations'
import type { AuthPayload, User } from '@/graphql/types'
import { authStorage, UNAUTHORIZED_EVENT } from '@/lib/auth-storage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (input: { email: string; password: string }) => Promise<void>
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>
  signOut: () => void
  setUser: (user: User) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restaura a sessão no boot: se ha token salvo, busca o usuário correspondente.
  useEffect(() => {
    let active = true

    async function restoreSession() {
      if (!authStorage.get()) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const { data } = await client.query<{ me: User | null }>({
          query: ME_QUERY,
          fetchPolicy: 'network-only',
        })
        if (active) setUser(data?.me ?? null)
      } catch {
        authStorage.clear()
        if (active) setUser(null)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void restoreSession()
    return () => {
      active = false
    }
  }, [client])

  // O ErrorLink avisa quando a API rejeita o token — derruba a sessão na hora.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null)
      void client.clearStore()
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [client])

  const signIn = useCallback<AuthContextValue['signIn']>(
    async (input) => {
      const { data } = await client.mutate<{ signIn: AuthPayload }>({
        mutation: SIGN_IN_MUTATION,
        variables: { input },
      })

      if (!data?.signIn) throw new Error('Não foi possível entrar. Tente novamente.')

      authStorage.set(data.signIn.token)
      await client.resetStore().catch(() => undefined)
      setUser(data.signIn.user)
    },
    [client],
  )

  const signUp = useCallback<AuthContextValue['signUp']>(
    async (input) => {
      const { data } = await client.mutate<{ signUp: AuthPayload }>({
        mutation: SIGN_UP_MUTATION,
        variables: { input },
      })

      if (!data?.signUp) throw new Error('Não foi possível criar a conta. Tente novamente.')

      authStorage.set(data.signUp.token)
      await client.resetStore().catch(() => undefined)
      setUser(data.signUp.user)
    },
    [client],
  )

  const signOut = useCallback(() => {
    authStorage.clear()
    setUser(null)
    void client.clearStore()
  }, [client])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signUp,
      signOut,
      setUser,
    }),
    [user, isLoading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
