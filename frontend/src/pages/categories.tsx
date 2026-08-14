import { useMutation, useQuery } from '@apollo/client/react'
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CategoryDialog } from '@/components/categories/category-dialog'
import { CategoryIcon } from '@/components/categories/category-icon'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORIES_QUERY, DELETE_CATEGORY_MUTATION } from '@/graphql/operations'
import type { Category } from '@/graphql/types'
import { getErrorMessage } from '@/lib/errors'

export function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const { data, loading } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const [deleteCategory, { loading: isDeleting }] = useMutation(DELETE_CATEGORY_MUTATION, {
    refetchQueries: ['Categories'],
  })

  const categories = data?.categories ?? []

  function openCreate() {
    setEditing(null)
    setIsFormOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setIsFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting) return

    try {
      await deleteCategory({ variables: { id: deleting.id } })
      toast.success('Categoria excluida com sucesso!')
      setDeleting(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize as suas transações agrupando-as por categoria."
        action={
          <Button onClick={openCreate}>
            <Plus />
            Nova categoria
          </Button>
        }
      />

      {loading && categories.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex items-center gap-3 p-5">
              <Skeleton className="size-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Tags />}
            title="Nenhuma categoria ainda"
            description="Crie categorias como Alimentação, Moradia ou Salário para classificar as suas transações."
            action={
              <Button onClick={openCreate}>
                <Plus />
                Nova categoria
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="group flex items-center gap-3 p-5">
              <CategoryIcon icon={category.icon} color={category.color} size="lg" />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">{category.name}</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {category.transactionsCount === 0
                    ? 'Nenhuma transação'
                    : `${category.transactionsCount} ${category.transactionsCount === 1 ? 'transação' : 'transações'}`}
                </p>
              </div>

              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar categoria ${category.name}`}
                  onClick={() => openEdit(category)}
                >
                  <Pencil />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Excluir categoria ${category.name}`}
                  className="text-ink-400 hover:bg-expense-soft hover:text-expense"
                  onClick={() => setDeleting(category)}
                >
                  <Trash2 />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CategoryDialog open={isFormOpen} onOpenChange={setIsFormOpen} category={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        title="Excluir categoria"
        description={
          deleting && deleting.transactionsCount > 0 ? (
            <>
              A categoria <strong className="text-ink-700">{deleting.name}</strong> possui{' '}
              {deleting.transactionsCount}{' '}
              {deleting.transactionsCount === 1 ? 'transação vinculada' : 'transações vinculadas'}.
              Mova ou exclua essas transações antes de remover a categoria.
            </>
          ) : (
            <>
              A categoria <strong className="text-ink-700">{deleting?.name}</strong> será removida
              permanentemente. Essa ação não pode ser desfeita.
            </>
          )
        }
      />
    </>
  )
}
