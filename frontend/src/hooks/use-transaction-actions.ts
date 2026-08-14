import { useMutation } from '@apollo/client/react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { DASHBOARD_REFETCH, DELETE_TRANSACTION_MUTATION } from '@/graphql/operations'
import type { Transaction, TransactionType } from '@/graphql/types'
import { getErrorMessage } from '@/lib/errors'

/**
 * Centraliza criar/editar/excluir transação para o dashboard e a página de
 * transações compartilharem exatamente o mesmo comportamento.
 */
export function useTransactionActions() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [defaultType, setDefaultType] = useState<TransactionType>('EXPENSE')
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const [deleteTransaction, { loading: isDeleting }] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: DASHBOARD_REFETCH,
  })

  const openCreate = useCallback((type: TransactionType = 'EXPENSE') => {
    setEditing(null)
    setDefaultType(type)
    setIsFormOpen(true)
  }, [])

  const openEdit = useCallback((transaction: Transaction) => {
    setEditing(transaction)
    setIsFormOpen(true)
  }, [])

  const requestDelete = useCallback((transaction: Transaction) => {
    setDeleting(transaction)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleting) return

    try {
      await deleteTransaction({ variables: { id: deleting.id } })
      toast.success('Transação excluida com sucesso!')
      setDeleting(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }, [deleting, deleteTransaction])

  return {
    openCreate,
    openEdit,
    requestDelete,
    deleting,
    formProps: {
      open: isFormOpen,
      onOpenChange: setIsFormOpen,
      transaction: editing,
      defaultType,
    },
    confirmProps: {
      open: Boolean(deleting),
      onOpenChange: (open: boolean) => {
        if (!open) setDeleting(null)
      },
      isLoading: isDeleting,
      onConfirm: confirmDelete,
    },
  }
}
