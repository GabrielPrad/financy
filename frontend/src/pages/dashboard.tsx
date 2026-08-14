import { useQuery } from '@apollo/client/react'
import { ArrowRight, Plus, Receipt } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ExpensesChart } from '@/components/dashboard/expenses-chart'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { PageHeader } from '@/components/layout/page-header'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { TransactionList } from '@/components/transactions/transaction-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import {
  EXPENSES_BY_CATEGORY_QUERY,
  SUMMARY_QUERY,
  TRANSACTIONS_QUERY,
} from '@/graphql/operations'
import type { CategorySummary, Summary, Transaction } from '@/graphql/types'
import { useAuth } from '@/hooks/use-auth'
import { useTransactionActions } from '@/hooks/use-transaction-actions'
import { formatMonth, getMonthRange } from '@/lib/format'

/** Tela exibida na rota `/` quando o usuário está logado. */
export function DashboardPage() {
  const { user } = useAuth()
  const actions = useTransactionActions()

  // O dashboard sempre mostra o mês corrente.
  const monthFilter = useMemo(() => getMonthRange(), [])
  const monthLabel = formatMonth(new Date())

  const summaryQuery = useQuery<{ summary: Summary }>(SUMMARY_QUERY, {
    variables: { filter: monthFilter },
  })

  const expensesQuery = useQuery<{ expensesByCategory: CategorySummary[] }>(
    EXPENSES_BY_CATEGORY_QUERY,
    { variables: { filter: monthFilter } },
  )

  const transactionsQuery = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS_QUERY, {
    variables: { limit: 6 },
  })

  const transactions = transactionsQuery.data?.transactions ?? []
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}!`}
        description="Este é o resumo das suas finanças neste mês."
        action={
          <Button onClick={() => actions.openCreate()}>
            <Plus />
            Nova transação
          </Button>
        }
      />

      <div className="flex flex-col gap-5">
        <SummaryCards
          summary={summaryQuery.data?.summary}
          isLoading={summaryQuery.loading}
          periodLabel={monthLabel}
        />

        <div className="grid gap-5 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <div>
                <CardTitle>Últimas transações</CardTitle>
                <p className="mt-0.5 text-sm text-ink-500">Os registros mais recentes da conta.</p>
              </div>

              <Button asChild variant="ghost" size="sm" className="px-2">
                <Link to="/transacoes">
                  Ver todas
                  <ArrowRight />
                </Link>
              </Button>
            </CardHeader>

            {transactions.length === 0 && !transactionsQuery.loading ? (
              <EmptyState
                icon={<Receipt />}
                title="Nenhuma transação ainda"
                description="Cadastre a sua primeira entrada ou saída para acompanhar o seu saldo."
                action={
                  <Button onClick={() => actions.openCreate()}>
                    <Plus />
                    Nova transação
                  </Button>
                }
              />
            ) : (
              <div className="border-t border-ink-100">
                <TransactionList
                  transactions={transactions}
                  isLoading={transactionsQuery.loading}
                  onEdit={actions.openEdit}
                  onDelete={actions.requestDelete}
                />
              </div>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Saídas por categoria</CardTitle>
                <p className="mt-0.5 text-sm text-ink-500">{monthLabel}</p>
              </div>
            </CardHeader>

            <ExpensesChart
              data={expensesQuery.data?.expensesByCategory ?? []}
              isLoading={expensesQuery.loading}
            />
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Atalhos</CardTitle>
              <p className="mt-0.5 text-sm text-ink-500">Registre rapidamente um novo lancamento.</p>
            </div>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => actions.openCreate('INCOME')}>
              <Plus />
              Nova entrada
            </Button>
            <Button variant="secondary" onClick={() => actions.openCreate('EXPENSE')}>
              <Plus />
              Nova saída
            </Button>
            <Button asChild variant="ghost">
              <Link to="/categorias">Gerenciar categorias</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

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
