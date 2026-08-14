import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { CategoryIcon } from '@/components/categories/category-icon'
import { Skeleton } from '@/components/ui/skeleton'
import type { Transaction } from '@/graphql/types'
import { formatDate, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}) {
  const isIncome = transaction.type === 'INCOME'

  return (
    <li className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ink-50/70 sm:px-6">
      <CategoryIcon icon={transaction.category.icon} color={transaction.category.color} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{transaction.description}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-500">
          <span className="truncate">{transaction.category.name}</span>
          <span aria-hidden className="text-ink-300">
            •
          </span>
          <span>{formatDate(transaction.date)}</span>
        </p>
      </div>

      <span
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome ? 'text-income' : 'text-expense',
        )}
      >
        {formatSignedCurrency(transaction.amount, transaction.type)}
      </span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          aria-label={`Ações da transação ${transaction.description}`}
          className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-200/60 hover:text-ink-700"
        >
          <MoreVertical className="size-4" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 w-40 rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop"
          >
            <DropdownMenu.Item
              onSelect={() => onEdit(transaction)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-700 outline-none data-[highlighted]:bg-ink-100"
            >
              <Pencil className="size-4" />
              Editar
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => onDelete(transaction)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-expense outline-none data-[highlighted]:bg-expense-soft"
            >
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </li>
  )
}

export function TransactionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-ink-100">
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </li>
      ))}
    </ul>
  )
}

export function TransactionList({ transactions, isLoading, onEdit, onDelete }: TransactionListProps) {
  if (isLoading && transactions.length === 0) return <TransactionListSkeleton />

  return (
    <ul className="divide-y divide-ink-100">
      {transactions.map((transaction) => (
        <TransactionRow
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
