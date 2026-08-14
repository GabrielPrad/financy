const TOKEN_KEY = 'financy:token'

/**
 * O token fica no localStorage e é lido pelo link do Apollo em cada requisição.
 * A troca de token dispara um evento para o AuthProvider reagir em outras abas.
 */
export const authStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
    window.dispatchEvent(new Event('financy:auth-changed'))
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event('financy:auth-changed'))
  },
}

export const AUTH_CHANGED_EVENT = 'financy:auth-changed'
export const UNAUTHORIZED_EVENT = 'financy:unauthorized'
