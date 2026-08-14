import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { Loader2, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  onConfirm: () => void
}

/** Confirmacao usada antes de excluir uma transação ou categoria. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-950/45 backdrop-blur-[2px] data-[state=open]:animate-in-up" />

        <AlertDialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-pop data-[state=open]:animate-in-up">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-expense-soft text-expense">
              <TriangleAlert className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <AlertDialogPrimitive.Title className="text-base font-semibold text-ink-900">
                {title}
              </AlertDialogPrimitive.Title>

              <AlertDialogPrimitive.Description asChild>
                <div className="mt-1 text-sm text-ink-500">{description}</div>
              </AlertDialogPrimitive.Description>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogPrimitive.Cancel
              className={cn(buttonVariants({ variant: 'secondary' }))}
              disabled={isLoading}
            >
              {cancelLabel}
            </AlertDialogPrimitive.Cancel>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(buttonVariants({ variant: 'danger' }))}
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
              {confirmLabel}
            </button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
