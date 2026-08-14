import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  icon?: ReactNode
  /** Texto fixo exibido antes do valor (ex.: "R$"). */
  prefix?: string
}

export function Input({ className, hasError, icon, prefix, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400 [&_svg]:size-4">
          {icon}
        </span>
      ) : null}

      {prefix ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-ink-500">
          {prefix}
        </span>
      ) : null}

      <input
        className={cn(
          'h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 shadow-sm transition-colors',
          'placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
          icon ? 'pl-9.5' : null,
          prefix ? 'pl-10' : null,
          hasError ? 'border-expense focus:border-expense focus:ring-rose-100' : null,
          className,
        )}
        {...props}
      />
    </div>
  )
}
