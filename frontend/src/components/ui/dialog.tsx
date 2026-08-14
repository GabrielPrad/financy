import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  title: string
  description?: string
  icon?: ReactNode
}

export function DialogContent({
  title,
  description,
  icon,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-950/45 backdrop-blur-[2px] data-[state=open]:animate-in-up" />

      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col',
          'overflow-hidden rounded-2xl bg-white shadow-pop data-[state=open]:animate-in-up',
          className,
        )}
        {...props}
      >
        <header className="flex items-start gap-3 border-b border-ink-100 px-6 py-5">
          {icon ? (
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 [&_svg]:size-4.5">
              {icon}
            </span>
          ) : null}

          <div className="min-w-0 flex-1">
            <DialogPrimitive.Title className="text-base font-semibold text-ink-900">
              {title}
            </DialogPrimitive.Title>

            {description ? (
              <DialogPrimitive.Description className="mt-0.5 text-sm text-ink-500">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>

          <DialogPrimitive.Close
            aria-label="Fechar"
            className="-mt-1 -mr-1 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4.5" />
          </DialogPrimitive.Close>
        </header>

        <div className="scrollbar-thin overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-ink-100 bg-ink-50/60 px-6 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}
