import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Tags } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_ICON_KEYS,
  CategoryIcon,
} from '@/components/categories/category-icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from '@/graphql/operations'
import type { Category } from '@/graphql/types'
import { getErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { categorySchema, type CategoryValues } from '@/lib/validation'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Quando informada, o dialog abre em modo de edição. */
  category?: Category | null
}

const emptyValues: CategoryValues = { name: '', color: CATEGORY_COLORS[0]!, icon: 'tag' }

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const isEditing = Boolean(category)

  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
  })
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, {
    refetchQueries: ['Categories', 'Transactions', 'ExpensesByCategory'],
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!open) return

    reset(
      category
        ? { name: category.name, color: category.color, icon: category.icon ?? 'tag' }
        : emptyValues,
    )
  }, [open, category, reset])

  const preview = watch()

  async function onSubmit(values: CategoryValues) {
    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, input: values } })
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await createCategory({ variables: { input: values } })
        toast.success('Categoria criada com sucesso!')
      }

      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? 'Editar categoria' : 'Nova categoria'}
        description={
          isEditing
            ? 'Atualize o nome, a cor e o ícone da categoria.'
            : 'Crie uma categoria para organizar suas transações.'
        }
        icon={<Tags />}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-5 px-6 py-5">
            {/* Prévia de como a categoria vai aparecer nas listas */}
            <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/60 p-3">
              <CategoryIcon icon={preview.icon} color={preview.color || '#7C3AED'} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">
                  {preview.name?.trim() || 'Nome da categoria'}
                </p>
                <p className="text-xs text-ink-500">Prévia da categoria</p>
              </div>
            </div>

            <Field label="Nome" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                placeholder="Ex.: Alimentação"
                autoComplete="off"
                hasError={Boolean(errors.name)}
                {...register('name')}
              />
            </Field>

            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <Field label="Cor" error={errors.color?.message}>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Cor ${color}`}
                        aria-pressed={field.value === color}
                        onClick={() => field.onChange(color)}
                        className={cn(
                          'flex size-8 items-center justify-center rounded-lg transition-transform hover:scale-105',
                          field.value === color ? 'ring-2 ring-ink-900 ring-offset-2' : null,
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {field.value === color ? <Check className="size-4 text-white" /> : null}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <Field label="Ícone" error={errors.icon?.message}>
                  <div className="scrollbar-thin grid max-h-40 grid-cols-8 gap-1.5 overflow-y-auto rounded-xl border border-ink-200 p-2">
                    {CATEGORY_ICON_KEYS.map((key) => {
                      const Icon = CATEGORY_ICONS[key]!
                      const isActive = field.value === key

                      return (
                        <button
                          key={key}
                          type="button"
                          aria-label={`Ícone ${key}`}
                          aria-pressed={isActive}
                          onClick={() => field.onChange(key)}
                          className={cn(
                            'flex aspect-square items-center justify-center rounded-lg transition-colors',
                            isActive
                              ? 'bg-brand-600 text-white'
                              : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800',
                          )}
                        >
                          <Icon className="size-4" />
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Salvar alterações' : 'Criar categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
