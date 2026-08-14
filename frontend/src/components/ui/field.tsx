import * as LabelPrimitive from '@radix-ui/react-label'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

/** Rótulo + controle + mensagem de erro: o bloco padrão de todos os formulários. */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <LabelPrimitive.Root htmlFor={htmlFor} className="text-sm font-medium text-ink-700">
        {label}
      </LabelPrimitive.Root>

      {children}

      {error ? (
        <p role="alert" className="text-xs font-medium text-expense">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
}
