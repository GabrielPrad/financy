import { useQuery } from '@apollo/client/react'
import { Plus, Receipt, Search, SlidersHorizontal, X } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { TransactionList } from '@/components/transactions/transaction-list'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES_QUERY, SUMMARY_QUERY, TRANSACTIONS_QUERY } from '@/graphql/operations'
import type { Category, Summary, Transaction, TransactionType } from '@/graphql/types'
import { useTransactionActions } from '@/hooks/use-transaction-actions'
import { formatCurrency } from '@/lib/format'

const ALL = 'all'

export function TransactionsPage() {
  const actions = useTransactionActions()

  const [search, setSearch] = useState('')
  const [type, setType] = useState<TransactionType | typeof ALL>(ALL)
  const [categoryId, setCategoryId] = useState<string>(ALL)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Evita disparar uma query a cada tecla digitada na busca.
  const deferredSearch = useDeferredValue(search)

  const filter = useMemo(
    () => ({
      ...(deferredSearch.trim() ? { search: deferredSearch.trim() } : {}),
      ...(type !== ALL ? { type } : {}),
      ...(categoryId !== ALL ? { categoryId } : {}),
      ...(startDate ? { startDate: new Date(`${startDate}T00:00:00`).toISOString() } : {}),
      ...(endDate ? { endDate: new Date(`${endDate}T23:59:59`).toISOString() } : {}),
    }),
    [deferredSearch, type, categoryId, startDate, endDate],
  )

  const hasFilters =
    Boolean(search) || type !== ALL || categoryId !== ALL || Boolean(startDate) || Boolean(endDate)

  const { data, loading } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS_QUERY, {
    variables: { filter },
  })
  const summaryQuery = useQuery<{ summary: Summary }>(SUMMARY_QUERY, { variables: { filter } })
  const categoriesQuery = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)

  const transactions = data?.transactions ?? []
  const categories = categoriesQuery.data?.categories ?? []
  const summary = summaryQuery.data?.summary

  function clearFilters() {
    setSearch('')
    setType(ALL)
    setCategoryId(ALL)
    setStartDate('')
    setEndDate('')
  }

  return (
    <>
      <PageHeader
        title="Transações"
        description="Todas as suas entradas e saídas em um só lugar."
        action={
          <Button onClick={() => actions.openCreate()}>
            <Plus />
            Nova transação
          </Button>
        }
      />

      <Card className="mb-5">
        <CardHeader className="border-b border-ink-100">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-ink-600">
            <SlidersHorizontal className="size-4" />
            Filtros
          </CardTitle>

          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X />
              Limpar filtros
            </Button>
          ) : null}
        </CardHeader>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              placeholder="Buscar por descrição..."
              icon={<Search />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar transações"
            />
          </div>

          <Select value={type} onValueChange={(value) => setType(value as TransactionType | typeof ALL)}>
            <SelectTrigger aria-label="Filtrar por tipo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os tipos</SelectItem>
              <SelectItem value="INCOME">Entradas</SelectItem>
              <SelectItem value="EXPENSE">Saídas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger aria-label="Filtrar por categoria">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            aria-label="Data inicial"
          />

          <Input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            aria-label="Data final"
          />
        </div>
      </Card>

      <Card>
        <CardHeader className="border-b border-ink-100">
          <CardTitle className="text-sm font-medium text-ink-600">
            {loading && transactions.length === 0
              ? 'Carregando...'
              : `${transactions.length} ${transactions.length === 1 ? 'transação encontrada' : 'transações encontradas'}`}
          </CardTitle>

          {summary ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-ink-500">
                Entradas <strong className="ml-1 text-income">{formatCurrency(summary.income)}</strong>
              </span>
              <span className="text-ink-500">
                Saídas <strong className="ml-1 text-expense">{formatCurrency(summary.expenses)}</strong>
              </span>
              <span className="text-ink-500">
                Saldo <strong className="ml-1 text-ink-900">{formatCurrency(summary.balance)}</strong>
              </span>
            </div>
          ) : null}
        </CardHeader>

        {transactions.length === 0 && !loading ? (
          <EmptyState
            icon={<Receipt />}
            title={hasFilters ? 'Nenhum resultado' : 'Nenhuma transação ainda'}
            description={
              hasFilters
                ? 'Nenhuma transação corresponde aos filtros aplicados. Tente ajustar a busca.'
                : 'Cadastre a sua primeira entrada ou saída para começar a acompanhar o seu saldo.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : (
                <Button onClick={() => actions.openCreate()}>
                  <Plus />
                  Nova transação
                </Button>
              )
            }
          />
        ) : (
          <TransactionList
            transactions={transactions}
            isLoading={loading}
            onEdit={actions.openEdit}
            onDelete={actions.requestDelete}
          />
        )}
      </Card>

      <TransactionDialog {...actions.formProps} />

      <ConfirmDialog
        {...actions.confirmProps}
        title="Excluir transação"
        description={
          <>
            A transação <strong className="text-ink-700">{actions.deleting?.description}</strong> será
            removida permanentemente. Essa ação não pode ser desfeita.
          </>
        }
      />
    </>
  )
}
