import { PieChart } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategorySummary } from '@/graphql/types'
import { formatCurrency, formatPercentage } from '@/lib/format'

interface ExpensesChartProps {
  data: CategorySummary[]
  isLoading?: boolean
}

/** Acima disso as categorias menores viram uma linha "Outras" — nunca inventamos cores. */
const MAX_BARS = 6
const OTHERS_COLOR = '#94A3B8'

/**
 * Ranking de gastos por categoria em barras horizontais.
 * Cada linha traz nome e valor escritos, então a leitura nunca depende só da cor
 * (as cores vêm das categorias criadas pelo usuário e podem ser parecidas).
 */
export function ExpensesChart({ data, isLoading }: ExpensesChartProps) {
  if (isLoading && data.length === 0) {
    return (
      <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6 sm:pb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<PieChart />}
        title="Sem saídas no período"
        description="Quando você registrar saídas, elas aparecem aqui agrupadas por categoria."
      />
    )
  }

  const visible = data.slice(0, MAX_BARS)
  const rest = data.slice(MAX_BARS)

  const rows = [
    ...visible.map((item) => ({
      id: item.category.id,
      name: item.category.name,
      color: item.category.color,
      total: item.total,
      percentage: item.percentage,
    })),
    ...(rest.length > 0
      ? [
          {
            id: 'others',
            name: `Outras (${rest.length})`,
            color: OTHERS_COLOR,
            total: rest.reduce((sum, item) => sum + item.total, 0),
            percentage: rest.reduce((sum, item) => sum + item.percentage, 0),
          },
        ]
      : []),
  ]

  // A barra e proporcional a maior categoria, para as diferencas ficarem visiveis.
  const largest = Math.max(...rows.map((row) => row.total))

  return (
    <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6 sm:pb-6">
      {rows.map((row) => (
        <div key={row.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.color }}
              />
              <span className="truncate text-sm font-medium text-ink-800">{row.name}</span>
            </span>

            <span className="shrink-0 text-sm text-ink-500 tabular-nums">
              <span className="font-semibold text-ink-900">{formatCurrency(row.total)}</span>
              <span className="ml-1.5 text-xs">{formatPercentage(row.percentage)}</span>
            </span>
          </div>

          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.max((row.total / largest) * 100, 2)}%`,
                backgroundColor: row.color,
              }}
              role="img"
              aria-label={`${row.name}: ${formatCurrency(row.total)}, ${formatPercentage(row.percentage)} das saídas`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
