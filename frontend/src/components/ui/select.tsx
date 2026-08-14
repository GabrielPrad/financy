import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends ComponentProps<typeof SelectPrimitive.Trigger> {
  hasError?: boolean
}

export function SelectTrigger({ className, hasError, children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 shadow-sm transition-colors',
        'data-[placeholder]:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-ink-50',
        hasError ? 'border-expense focus:border-expense focus:ring-rose-100' : null,
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{children}</span>
      <SelectPrimitive.Icon>
        <ChevronDown className="size-4 shrink-0 text-ink-400" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          'z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-ink-200 bg-white shadow-pop',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="scrollbar-thin max-h-72 overflow-y-auto p-1.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

interface SelectItemProps extends ComponentProps<typeof SelectPrimitive.Item> {
  children: ReactNode
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-8 pl-2.5 text-sm text-ink-700 outline-none select-none',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-50 data-[highlighted]:text-brand-700',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2.5">
        <Check className="size-4 text-brand-600" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
