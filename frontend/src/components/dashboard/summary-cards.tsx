import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Summary } from '@/graphql/types'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  summary?: Summary
  isLoading?: boolean
  periodLabel: string
}

export function SummaryCards({ summary, isLoading, periodLabel }: SummaryCardsProps) {
  const cards = [
    {
      key: 'income',
      label: 'Entradas',
      value: summary?.income ?? 0,
      icon: ArrowUpRight,
      iconClass: 'bg-income-soft text-income',
      valueClass: 'text-income',
    },
    {
      key: 'expenses',
      label: 'Saídas',
      value: summary?.expenses ?? 0,
      icon: ArrowDownLeft,
      iconClass: 'bg-expense-soft text-expense',
      valueClass: 'text-expense',
    },
    {
      key: 'balance',
      label: 'Saldo',
      value: summary?.balance ?? 0,
      icon: Wallet,
      iconClass: 'bg-white/15 text-white',
      valueClass: 'text-white',
      highlighted: true,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className={cn(
            'rounded-card border p-5 shadow-card',
            card.highlighted ? 'border-transparent bg-ink-950' : 'border-ink-200/70 bg-white',
          )}
        >
          <div className="flex items-center justify-between">
            <p
              className={cn(
                'text-sm font-medium',
                card.highlighted ? 'text-ink-300' : 'text-ink-500',
              )}
            >
              {card.label}
            </p>
            <span
              className={cn('flex size-8 items-center justify-center rounded-lg', card.iconClass)}
            >
              <card.icon className="size-4" />
            </span>
          </div>

          {isLoading && !summary ? (
            <Skeleton className={cn('mt-3 h-7 w-32', card.highlighted ? 'bg-white/15' : null)} />
          ) : (
            <p className={cn('mt-2 text-2xl font-semibold tabular-nums', card.valueClass)}>
              {formatCurrency(card.value)}
            </p>
          )}

          <p
            className={cn('mt-1 text-xs', card.highlighted ? 'text-ink-500' : 'text-ink-400')}
          >
            {periodLabel}
          </p>
        </div>
      ))}
    </div>
  )
}
