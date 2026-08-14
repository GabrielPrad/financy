const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

/** Formata o valor com o sinal do tipo da transação (+ para entradas, - para saídas). */
export function formatSignedCurrency(value: number, type: 'INCOME' | 'EXPENSE') {
  return `${type === 'INCOME' ? '+' : '-'} ${currencyFormatter.format(Math.abs(value))}`
}

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value))
}

export function formatLongDate(value: string | Date) {
  return longDateFormatter.format(new Date(value))
}

export function formatMonth(value: string | Date) {
  const label = monthFormatter.format(new Date(value))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatPercentage(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1).replace('.', ',')}%`
}

/** `2026-08-10` a partir de uma data — formato aceito pelo input[type=date]. */
export function toDateInputValue(value: string | Date = new Date()) {
  const date = new Date(value)
  const offsetMinutes = date.getTimezoneOffset()
  return new Date(date.getTime() - offsetMinutes * 60_000).toISOString().slice(0, 10)
}

/**
 * Converte o valor do input[type=date] (data local, sem hora) em um ISO com
 * meio-dia UTC, evitando que o fuso jogue a transação para o dia anterior.
 */
export function fromDateInputValue(value: string) {
  return new Date(`${value}T12:00:00.000Z`).toISOString()
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase()
}

/** Primeiro e último instante do mês informado, em ISO — usado nos filtros de período. */
export function getMonthRange(reference: Date = new Date()) {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1, 0, 0, 0, 0)
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0, 23, 59, 59, 999)
  return { startDate: start.toISOString(), endDate: end.toISOString() }
}
