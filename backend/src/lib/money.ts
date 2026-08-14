/**
 * O banco guarda valores em centavos (Int) para evitar erros de arredondamento
 * de ponto flutuante. Na API GraphQL os valores trafegam em reais (Float).
 */

export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

export function toAmount(cents: number): number {
  return cents / 100
}
