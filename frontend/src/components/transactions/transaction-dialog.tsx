import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CategoryIcon } from '@/components/categories/category-icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CATEGORIES_QUERY,
  CREATE_TRANSACTION_MUTATION,
  DASHBOARD_REFETCH,
  UPDATE_TRANSACTION_MUTATION,
} from '@/graphql/operations'
import type { Category, Transaction, TransactionType } from '@/graphql/types'
import { getErrorMessage } from '@/lib/errors'
import { fromDateInputValue, toDateInputValue } from '@/lib/format'
import { transactionSchema, type TransactionValues } from '@/lib/validation'
import { cn } from '@/lib/utils'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Quando informado, o dialog abre em modo de edição. */
  transaction?: Transaction | null
  defaultType?: TransactionType
}

const typeOptions = [
  { value: 'INCOME' as const, label: 'Entrada', icon: ArrowUpRight, activeClass: 'border-income bg-income-soft text-income' },
  { value: 'EXPENSE' as const, label: 'Saída', icon: ArrowDownLeft, activeClass: 'border-expense bg-expense-soft text-expense' },
]

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  defaultType = 'EXPENSE',
}: TransactionDialogProps) {
  const isEditing = Boolean(transaction)
  const { data } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY, { skip: !open })
  const categories = data?.categories ?? []

  const [createTransaction] = useMutation(CREATE_TRANSACTION_MUTATION, {
    refetchQueries: DASHBOARD_REFETCH,
  })
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION, {
    refetchQueries: DASHBOARD_REFETCH,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      type: defaultType,
      date: toDateInputValue(),
      categoryId: '',
    },
  })

  // Recarrega o formulário sempre que o dialog abre (novo registro ou edição).
  useEffect(() => {
    if (!open) return

    reset(
      transaction
        ? {
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            date: toDateInputValue(transaction.date),
            categoryId: transaction.category.id,
          }
        : {
            description: '',
            amount: undefined,
            type: defaultType,
            date: toDateInputValue(),
            categoryId: '',
          },
    )
  }, [open, transaction, defaultType, reset])

  async function onSubmit(values: TransactionValues) {
    const input = {
      description: values.description,
      amount: values.amount,
      type: values.type,
      date: fromDateInputValue(values.date),
      categoryId: values.categoryId,
    }

    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, input } })
        toast.success('Transação atualizada com sucesso!')
      } else {
        await createTransaction({ variables: { input } })
        toast.success('Transação criada com sucesso!')
      }

      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? 'Editar transação' : 'Nova transação'}
        description={
          isEditing
            ? 'Atualize os dados da transação selecionada.'
            : 'Registre uma entrada ou saída na sua conta.'
        }
        icon={<ArrowLeftRight />}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-4 px-6 py-5">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Field label="Tipo" error={errors.type?.message}>
                  <div className="grid grid-cols-2 gap-2">
                    {typeOptions.map((option) => {
                      const isActive = field.value === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          aria-pressed={isActive}
                          className={cn(
                            'flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors',
                            isActive
                              ? option.activeClass
                              : 'border-ink-200 bg-white text-ink-500 hover:bg-ink-50',
                          )}
                        >
                          <option.icon className="size-4" />
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            />

            <Field label="Descrição" htmlFor="description" error={errors.description?.message}>
              <Input
                id="description"
                placeholder="Ex.: Mercado do mês"
                autoComplete="off"
                hasError={Boolean(errors.description)}
                {...register('description')}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Valor" htmlFor="amount" error={errors.amount?.message}>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  prefix="R$"
                  hasError={Boolean(errors.amount)}
                  {...register('amount', { valueAsNumber: true })}
                />
              </Field>

              <Field label="Data" htmlFor="date" error={errors.date?.message}>
                <Input id="date" type="date" hasError={Boolean(errors.date)} {...register('date')} />
              </Field>
            </div>

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                const selected = categories.find((category) => category.id === field.value)

                return (
                  <Field
                    label="Categoria"
                    error={errors.categoryId?.message}
                    hint={
                      categories.length === 0
                        ? 'Você ainda não tem categorias. Crie uma na aba Categorias.'
                        : undefined
                    }
                  >
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger hasError={Boolean(errors.categoryId)} aria-label="Categoria">
                        {selected ? (
                          <>
                            <CategoryIcon
                              icon={selected.icon}
                              color={selected.color}
                              size="sm"
                              className="size-6 rounded-md [&_svg]:size-3.5"
                            />
                            <span className="truncate">{selected.name}</span>
                          </>
                        ) : (
                          <SelectValue placeholder="Selecione uma categoria" />
                        )}
                      </SelectTrigger>

                      <SelectContent>
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
                  </Field>
                )
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Salvar alterações' : 'Criar transação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
